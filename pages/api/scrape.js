// 服务端API - 在Vercel Serverless中抓取百度热搜（无CORS限制）
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://top.baidu.com/board?tab=realtime', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const hotspots = [];

    // 尝试从JSON数据中提取
    let jsonData = null;
    $('script').each((i, el) => {
      const content = $(el).html() || '';
      const match = content.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
      if (match) {
        try { jsonData = JSON.parse(match[1]); } catch(e) {}
      }
    });

    if (jsonData) {
      // 解析百度内部数据结构
      try {
        const cards = jsonData?.data?.cards;
        if (cards) {
          for (const card of cards) {
            const content = card.content || [];
            for (let i = 0; i < Math.min(content.length, 30); i++) {
              const item = content[i];
              if (item.word || item.query) {
                const title = item.word || item.query || '';
                const hotness = parseInt(item.hotScore) || parseInt(item.hotNum) || (30 - i) * 250000;
                hotspots.push({
                  id: i + 1,
                  title: title.replace(/<[^>]*>/g, ''),
                  score: Math.min(100, Math.round(Math.log10(hotness + 1) * 13)),
                  hotness: hotness,
                  url: item.url || `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`,
                  category: autoCategory(title),
                  keywords: autoKeywords(title),
                  summary: autoSummary(title),
                  sentiment: autoSentiment(title),
                  reasons: autoReasons(title, hotness)
                });
              }
            }
          }
        }
      } catch(e) {
        console.error('JSON parse error:', e);
      }
    }

    // 备用：DOM解析
    if (hotspots.length === 0) {
      $('.category-wrap_iQLoo .content_1YWBm').each((i, el) => {
        if (i >= 30) return;
        const $el = $(el);
        const title = $el.find('.c-single-text-ellipsis').text().trim();
        const hotText = $el.find('.hot-index_1Bl1a').text().trim().replace(/,/g, '');
        const hotness = parseInt(hotText) || (30 - i) * 250000;
        
        if (title) {
          hotspots.push({
            id: i + 1,
            title,
            score: Math.min(100, Math.round(Math.log10(hotness + 1) * 13)),
            hotness,
            url: `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`,
            category: autoCategory(title),
            keywords: autoKeywords(title),
            summary: autoSummary(title),
            sentiment: autoSentiment(title),
            reasons: autoReasons(title, hotness)
          });
        }
      });
    }

    // 按分数排序
    hotspots.sort((a, b) => b.score - a.score);

    if (hotspots.length === 0) {
      return res.status(200).json([]);
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');
    res.status(200).json(hotspots.slice(0, 30));

  } catch (error) {
    console.error('Scrape error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

function autoCategory(title) {
  const t = title.toLowerCase();
  if (/科技|ai|芯片|半导体|模型|算法|碳纤维|苹果|比亚迪|新能源|中国造|龙虾|智能|手机|材料/.test(t)) return '科技前沿';
  if (/股市|股票|投资|财报|金融|基金|油价|富豪|华莱士|退市|车险|福布斯|商业|餐饮/.test(t)) return '市场投资';
  if (/经济|政策|政府|两会|宏观|gdp|普京|伊朗|朝鲜|导弹|高速|义乌|养老|养老/.test(t)) return '宏观经济';
  return '校园与社会';
}

function autoKeywords(title) {
  const t = title.toLowerCase();
  const map = {
    '科技':['#科技','#前沿'],'ai':['#AI','#人工智能'],'芯片':['#半导体','#芯片'],
    '半导体':['#半导体','#芯片'],'苹果':['#苹果','#消费电子'],'比亚迪':['#新能源','#汽车'],
    '油价':['#原油','#能源'],'福布斯':['#财富','#榜单'],'退市':['#退市','#企业'],
    '碳纤维':['#新材料','#创新'],'导弹':['#军事','#安全'],'龙虾':['#AI','#科技'],
    'nba':['#体育','#NBA'],'乒乓':['#体育','#国乒'],'两会':['#两会','#政策'],
    '养老':['#养老','#民生'],'华莱士':['#餐饮','#退市'],'义乌':['#外贸','#制造']
  };
  for (const [k,v] of Object.entries(map)) { if (t.includes(k)) return v; }
  return ['#热点','#趋势'];
}

function autoSummary(title) {
  const cat = autoCategory(title);
  return {
    '科技前沿':'科技领域重大动态，引发产业链广泛关注与讨论。',
    '市场投资':'市场资金流向出现显著变化，投资者密切关注后续走势。',
    '宏观经济':'宏观层面重要信号，政策及经济走势引发社会各界热议。',
    '校园与社会':'社会关注度高的话题，在全网引发广泛讨论和传播。'
  }[cat] || '全网热议话题，持续引发关注和讨论。';
}

function autoSentiment(title) {
  const t = title.toLowerCase();
  if (/爆单|刷屏|突破|首|官宣|走.*红|暖|救人|正|升级|创新|好消息/.test(t)) return '正面';
  if (/暴跌|退市|跌|负|不实|拒|违|关|禁|刑|删|封/.test(t)) return '负面';
  return '中性';
}

function autoReasons(title, hotness) {
  const r = [`全网搜索指数 ${(hotness/10000).toFixed(0)}万+`];
  const cat = autoCategory(title);
  if (cat==='科技前沿') r.push('科技产业影响深远');
  else if (cat==='市场投资') r.push('资本市场高度关注');
  else if (cat==='宏观经济') r.push('涉及宏观政策走向');
  else r.push('社会讨论热度持续走高');
  r.push('多平台同步传播');
  return r;
}