import { useState, useEffect } from 'react';
import Head from 'next/head';

const CATEGORIES = ['全部', '科技前沿', '市场投资', '宏观经济', '校园与社会'];

// 根据标题自动分类
function autoCategory(title) {
  const t = title.toLowerCase();
  if (/科技|ai|芯片|半导体|模型|算法|碳纤维|苹果|比亚迪|新能源|中国造|龙虾|智能/.test(t)) return '科技前沿';
  if (/股市|股票|投资|财报|金融|基金|油价|富豪|华莱士|退市|车险|福布斯/.test(t)) return '市场投资';
  if (/经济|政策|政府|两会|宏观|gdp|普京|伊朗|朝鲜|导弹|高速|义乌|养老/.test(t)) return '宏观经济';
  return '校园与社会';
}

// 根据标题提取关键词
function autoKeywords(title) {
  const t = title.toLowerCase();
  const map = {
    '科技': ['#科技','#前沿'], 'ai': ['#AI','#人工智能'], '芯片': ['#半导体','#芯片'],
    '半导体': ['#半导体','#芯片'], '苹果': ['#苹果','#手机'], '比亚迪': ['#新能源','#汽车'],
    '股价': ['#股市','#投资'], '两会': ['#两会','#政策'], '养老': ['#养老','#民生'],
    '油价': ['#原油','#能源'], '福布斯': ['#财富','#榜单'], '退市': ['#退市','#企业经营'],
    '碳纤维': ['#新材料','#创新'], '导弹': ['#军事','#安全'], '龙虾': ['#AI','#科技'],
    '高考': ['#教育','#校园'], 'NBA': ['#体育','#NBA'], '乒乓': ['#体育','#国乒']
  };
  for (const [k, v] of Object.entries(map)) {
    if (t.includes(k)) return v;
  }
  return ['#热点', '#趋势'];
}

// 根据标题生成摘要模板
function autoSummary(title) {
  const cat = autoCategory(title);
  const templates = {
    '科技前沿': '科技领域重大动态，引发产业链广泛关注与讨论。',
    '市场投资': '市场资金流向出现显著变化，投资者密切关注后续走势。',
    '宏观经济': '宏观层面重要信号，政策及经济走势引发社会各界热议。',
    '校园与社会': '社会关注度高的话题，在全网引发广泛讨论和传播。'
  };
  return templates[cat] || '全网热议话题，持续引发关注和讨论。';
}

// 自动判断情绪倾向
function autoSentiment(title) {
  const t = title.toLowerCase();
  if (/爆单|刷屏|突破|首|官宣|走.*红|暖|救人|正|升级|创新/.test(t)) return '正面';
  if (/暴跌|退市|跌|负|不实|拒|违|关|禁|刑/.test(t)) return '负面';
  return '中性';
}

// 自动生成打分依据
function autoReasons(title, hotness) {
  const reasons = [`全网搜索指数 ${(hotness/10000).toFixed(0)}万+`];
  if (autoCategory(title) === '科技前沿') reasons.push('科技产业影响深远');
  else if (autoCategory(title) === '市场投资') reasons.push('资本市场高度关注');
  else if (autoCategory(title) === '宏观经济') reasons.push('涉及宏观经济政策走向');
  else reasons.push('社会讨论热度持续走高');
  reasons.push('多平台同步传播');
  return reasons;
}

// 环形进度条
function Ring({ score, size=90 }) {
  const r = (size-12)/2;
  const c = 2*Math.PI*r;
  const off = c*(1-score/100);
  const col = score>=90?'#ef4444':score>=70?'#f97316':'#3b82f6';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{transition:'stroke-dashoffset 1.5s ease'}}/>
    </svg>
  );
}

export default function TrendScore() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('全部');
  const [detail, setDetail] = useState(null);
  const [now, setNow] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => { const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); }, []);

  // 抓取百度热搜
  useEffect(() => {
    async function fetchHot() {
      try {
        setLoading(true);
        setError(null);

        // 方法1: 通过代理API抓取（Vercel serverless端）
        let data = null;
        try {
          const res = await fetch('/api/scrape');
          if (res.ok) data = await res.json();
        } catch(e) {}

        // 方法2: 客户端直接通过CORS代理
        if (!data || data.length === 0) {
          const proxy = 'https://corsproxy.io/?';
          const res = await fetch(proxy + encodeURIComponent('https://top.baidu.com/board?tab=realtime'));
          const html = await res.text();

          // 从JS变量中提取数据
          const match = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/s)
            || html.match(/s-data\s*=\s*(\{.*?\})\s*;/s);
          
          if (match) {
            try { data = parseBaiduData(JSON.parse(match[1])); } catch(e) {}
          }

          // 备用：用正则提取标题和热度
          if (!data || data.length === 0) {
            data = parseHTML(html);
          }
        }

        if (data && data.length > 0) {
          setHotspots(data);
          setLastUpdate(new Date().toLocaleString('zh-CN'));
        } else {
          throw new Error('empty');
        }
      } catch(e) {
        console.error('抓取失败:', e);
        setError('抓取失败，显示上次缓存数据');
        // 使用localStorage缓存
        try {
          const cached = localStorage.getItem('hotspot_cache');
          if (cached) {
            const { data, time } = JSON.parse(cached);
            setHotspots(data);
            setLastUpdate(time);
          }
        } catch(err) {}
      } finally {
        setLoading(false);
      }
    }
    fetchHot();
  }, []);

  // 缓存到localStorage
  useEffect(() => {
    if (hotspots.length > 0) {
      localStorage.setItem('hotspot_cache', JSON.stringify({
        data: hotspots,
        time: new Date().toLocaleString('zh-CN')
      }));
    }
  }, [hotspots]);

  // 倒计时
  const next = new Date(now);
  next.setHours(23,0,0,0);
  if (now >= next) next.setDate(next.getDate()+1);
  const diff = next - now;
  const hh = Math.floor(diff/3600000);
  const mm = Math.floor((diff%3600000)/60000);
  const ss = Math.floor((diff%60000)/1000);
  const dateStr = now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});

  // 过滤 & 排序
  const list = (category==='全部' ? hotspots : hotspots.filter(h=>h.category===category)).slice(0,30);
  const top = hotspots.length > 0 ? hotspots[0] : null;

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",minHeight:'100vh',background:'#f8fafc'}}>
      <Head>
        <title>热力雷达 TrendScore</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
      </Head>

      {/* HEADER */}
      <div style={{position:'sticky',top:0,zIndex:50,background:'#fff',borderBottom:'1px solid #e5e7eb'}}>
        <div style={{maxWidth:480,margin:'0 auto',padding:'14px 20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#f97316,#ef4444)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🔥</div>
              <div>
                <div style={{fontWeight:700,fontSize:18,color:'#111827'}}>热力雷达</div>
                <div style={{fontSize:10,color:'#9ca3af',letterSpacing:1}}>TRENDSCORE</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#6b7280',textAlign:'right'}}>{dateStr}</div>
          </div>
          <div style={{marginTop:12,display:'flex',justifyContent:'center',alignItems:'center',background:'linear-gradient(135deg,#7c3aed,#db2777)',borderRadius:20,padding:'8px 20px',color:'#fff',fontSize:13}}>
            <span style={{opacity:0.9}}>距下次更新</span>
            <span style={{margin:'0 4px',fontSize:18,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
              {String(hh).padStart(2,'0')}:{String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}
            </span>
            <span style={{opacity:0.9}}>每晚23:00</span>
          </div>
          {lastUpdate && <div style={{textAlign:'center',fontSize:11,color:'#9ca3af',marginTop:6}}>上次更新: {lastUpdate}</div>}
        </div>
      </div>

      {loading ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 20px'}}>
          <div style={{width:40,height:40,border:'3px solid #e5e7eb',borderTopColor:'#7c3aed',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{marginTop:16,color:'#6b7280',fontSize:14}}>正在抓取最新热点数据...</div>
        </div>
      ) : (
        <>
          {/* HERO */}
          {top && (
            <div style={{maxWidth:480,margin:'0 auto',padding:'16px 20px'}}>
              <div style={{borderRadius:20,overflow:'hidden',background:top.score>=90?'linear-gradient(135deg,#dc2626,#f97316)':top.score>=70?'linear-gradient(135deg,#ea580c,#eab308)':'linear-gradient(135deg,#2563eb,#06b6d4)',padding:'28px 24px',color:'#fff'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                  <div>
                    <div style={{fontSize:11,opacity:0.8,letterSpacing:2,marginBottom:4}}>TODAY'S #1</div>
                    <div style={{fontSize:42,fontWeight:800,lineHeight:1}}>🔥 {top.score}<span style={{fontSize:20,fontWeight:500,opacity:0.8}}>/100</span></div>
                  </div>
                  <div style={{position:'relative',width:90,height:90}}>
                    <Ring score={top.score} size={90}/>
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:22}}>{top.score}</div>
                  </div>
                </div>
                <div style={{fontSize:20,fontWeight:700,lineHeight:1.4,marginBottom:10}}>{top.title}</div>
                <div style={{fontSize:13,opacity:0.9,lineHeight:1.6,marginBottom:14}}>{top.summary}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {top.keywords.map((k,i)=>(<span key={i} style={{background:'rgba(255,255,255,0.2)',borderRadius:12,padding:'4px 12px',fontSize:12}}>{k}</span>))}
                </div>
              </div>
            </div>
          )}

          {/* 分类标签 */}
          <div style={{maxWidth:480,margin:'0 auto',padding:'4px 20px 8px',overflowX:'auto',display:'flex',gap:8}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCategory(c)} style={{flexShrink:0,border:'none',cursor:'pointer',padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:600,background:category===c?'linear-gradient(135deg,#7c3aed,#db2777)':'#f3f4f6',color:category===c?'#fff':'#374151',transition:'all 0.2s'}}>{c}</button>
            ))}
          </div>

          {/* 信息流 */}
          <div style={{maxWidth:480,margin:'0 auto',padding:'8px 20px 120px'}}>
            {error && <div style={{background:'#fef3c7',borderRadius:12,padding:'12px 16px',fontSize:13,color:'#92400e',marginBottom:12}}>⚠️ {error}</div>}
            {list.map((h,i)=>(
              <div key={h.id} onClick={()=>setDetail(h)} style={{background:'#fff',borderRadius:14,padding:'16px 18px',marginBottom:10,cursor:'pointer',border:'1px solid #f3f4f6',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
                  <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:i<3?(i===0?'#fbbf24':i===1?'#9ca3af':'#d97706'):'#f3f4f6',color:i<3?'#fff':'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:600,color:'#111827',lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{h.title}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                      {h.keywords.slice(0,3).map((k,j)=>(<span key={j} style={{background:'#f3f4f6',color:'#6b7280',borderRadius:10,padding:'2px 8px',fontSize:11}}>{k}</span>))}
                    </div>
                  </div>
                  <div style={{flexShrink:0,width:50,height:50,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',background:h.score>=90?'linear-gradient(135deg,#ef4444,#f97316)':h.score>=70?'linear-gradient(135deg,#f97316,#eab308)':'linear-gradient(135deg,#3b82f6,#06b6d4)',color:'#fff'}}>
                    <div style={{fontSize:20,fontWeight:800,lineHeight:1}}>{h.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 详情面板 */}
          {detail && (
            <div style={{position:'fixed',inset:0,zIndex:100}}>
              <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} onClick={()=>setDetail(null)}/>
              <div style={{position:'absolute',bottom:0,left:0,right:0,background:'#fff',borderRadius:'24px 24px 0 0',padding:'24px 24px 40px',maxHeight:'70vh',overflowY:'auto'}}>
                <div style={{display:'flex',justifyContent:'center',marginBottom:20}}><div style={{width:40,height:4,borderRadius:2,background:'#d1d5db'}}/></div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div style={{fontSize:28,fontWeight:800,color:detail.score>=90?'#ef4444':detail.score>=70?'#f97316':'#3b82f6'}}>{detail.score}/100</div>
                  <span style={{padding:'6px 14px',borderRadius:20,fontSize:13,fontWeight:600,background:detail.sentiment==='正面'?'#dcfce7':detail.sentiment==='负面'?'#fee2e2':'#f3f4f6',color:detail.sentiment==='正面'?'#16a34a':detail.sentiment==='负面'?'#dc2626':'#6b7280'}}>{detail.sentiment==='正面'?'📈 正面':detail.sentiment==='负面'?'📉 负面':'➡️ 中性'}</span>
                </div>
                <div style={{fontSize:18,fontWeight:700,color:'#111827',lineHeight:1.4,marginBottom:16}}>{detail.title}</div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#6b7280',marginBottom:6,letterSpacing:1}}>事件简述</div>
                  <div style={{fontSize:14,color:'#374151',lineHeight:1.7}}>{detail.summary}</div>
                </div>
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#6b7280',marginBottom:8,letterSpacing:1}}>打分依据</div>
                  {detail.reasons.map((r,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6}}>
                      <span style={{color:'#7c3aed',fontWeight:700,flexShrink:0}}>●</span>
                      <span style={{fontSize:14,color:'#374151',lineHeight:1.5}}>{r}</span>
                    </div>
                  ))}
                </div>
                <a href={detail.url} target="_blank" rel="noopener noreferrer" style={{display:'block',textAlign:'center',background:'linear-gradient(135deg,#7c3aed,#db2777)',color:'#fff',padding:'14px',borderRadius:14,fontSize:15,fontWeight:600,textDecoration:'none'}}>查看原文 →</a>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{textAlign:'center',padding:'20px',fontSize:11,color:'#9ca3af'}}>
        © 2026 热力雷达 TrendScore · 数据来自百度热搜 · 每次打开自动获取最新
      </div>
    </div>
  );
}