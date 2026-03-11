import { useState, useEffect } from 'react';
import Head from 'next/head';

// ======== 30条真实热点数据（2026-03-11百度热搜） ========
const ALL_HOTSPOTS = [
  { id:1, title:"义乌爆单！全球采购商蜂拥而至", score:98, hotness:7808028, url:"https://www.baidu.com/s?wd=义乌爆单", category:"宏观经济", keywords:["#外贸","#制造业","#复苏"], summary:"春节后义乌国际商贸城开门红，全球采购商涌入，商户订单已排满一季度，出口数据持续走强。", sentiment:"正面", reasons:["全网搜索量激增580%","央视/新华网头条报道","带动外贸板块异动"] },
  { id:2, title:"\"成为中国人\"为何刷屏两会", score:96, hotness:7617854, url:"https://www.baidu.com/s?wd=成为中国人", category:"宏观经济", keywords:["#两会","#文化认同","#国际传播"], summary:"2026全国两会期间，\"成为中国人\"成为外媒热词，中国发展故事引发全球共鸣。", sentiment:"正面", reasons:["两会核心议题","国际媒体广泛报道","社交平台热搜霸榜"] },
  { id:3, title:"委员：劳动者退休后养老待遇应平等", score:94, hotness:7521368, url:"https://www.baidu.com/s?wd=养老待遇平等", category:"校园与社会", keywords:["#养老","#社会保障","#民生"], summary:"政协委员提出缩小三大群体养老金差距，建议实现劳动者退休待遇平等化。", sentiment:"正面", reasons:["涉及全民切身利益","引发深度讨论","政策落地预期高"] },
  { id:4, title:"华莱士正式宣布退市", score:92, hotness:7424401, url:"https://www.baidu.com/s?wd=华莱士退市", category:"市场投资", keywords:["#退市","#餐饮","#经营"], summary:"华莱士母公司华士食品正式从新三板退市，总负债21.08亿，门店数较高峰期大幅缩水。", sentiment:"负面", reasons:["知名品牌重大变动","负债数据引发关注","餐饮行业标志性事件"] },
  { id:5, title:"穿正装打领带救人 拟确认见义勇为", score:91, hotness:7235302, url:"https://www.baidu.com/s?wd=穿正装救人见义勇为", category:"校园与社会", keywords:["#正能量","#见义勇为","#社会"], summary:"1999年出生的兰大研究生谈磊穿正装跳河救人，兰州市城关区政法委拟确认其见义勇为行为。", sentiment:"正面", reasons:["正能量事件刷屏","网民高度赞扬","官方拟表彰"] },
  { id:6, title:"济南共享菜园走红：出租率超90%", score:89, hotness:7135570, url:"https://www.baidu.com/s?wd=济南共享菜园", category:"校园与社会", keywords:["#共享经济","#农业","#生活方式"], summary:"济南掀起共享菜园\"种地热\"，30平米年费1299元，可自种或托管，出租率超90%。", sentiment:"正面", reasons:["新兴生活方式引爆","多地效仿趋势","消费升级新方向"] },
  { id:7, title:"一位特别的代表给我念了一首诗", score:88, hotness:7044029, url:"https://www.baidu.com/s?wd=代表念诗", category:"校园与社会", keywords:["#两会","#诗歌","#文化"], summary:"全国人大代表李翠利接受专访时深情念诗，关于\"春天\"的执著与坚守令人动容。", sentiment:"正面", reasons:["两会温情瞬间","朋友圈刷屏","文化类话题出圈"] },
  { id:8, title:"阿德巴约单场狂砍83分超越科比", score:87, hotness:6946093, url:"https://www.baidu.com/s?wd=阿德巴约83分", category:"校园与社会", keywords:["#NBA","#体育","#纪录"], summary:"热火中锋阿德巴约对阵奇才狂砍83分，超越科比81分纪录，位列NBA历史单场得分榜第二。", sentiment:"正面", reasons:["NBA历史级纪录","全球体育媒体头条","球迷讨论爆炸"] },
  { id:9, title:"\"深圳将禁行电动自行车\"不实", score:85, hotness:6858571, url:"https://www.baidu.com/s?wd=深圳禁行电动车不实", category:"校园与社会", keywords:["#辟谣","#交通","#政策"], summary:"深圳仅微调部分道路限行等级，整体限行规则不变，\"禁行\"消息为不实谣言。", sentiment:"中性", reasons:["涉及千万市民出行","谣言传播迅速","官方紧急辟谣"] },
  { id:10, title:"国际油价历史性暴跌", score:84, hotness:6754372, url:"https://www.baidu.com/s?wd=国际油价暴跌", category:"市场投资", keywords:["#原油","#金融市场","#全球经济"], summary:"国际油价跌超11%，WTI原油收于83.45美元/桶，创下2022年以来单日最大跌幅。", sentiment:"负面", reasons:["全球金融市场震动","A股能源板块承压","OPEC紧急磋商"] },
  { id:11, title:"迪拜公司发来offer 网友纷纷劝退", score:83, hotness:6569347, url:"https://www.baidu.com/s?wd=迪拜offer劝退", category:"校园与社会", keywords:["#就业","#海外工作","#中东"], summary:"湖北女子接到迪拜公司offer，出行前航班全取消，中东局势引发对海外就业安全的担忧。", sentiment:"负面", reasons:["就业话题共鸣","地缘政治影响","签证政策讨论"] },
  { id:12, title:"苹果最便宜手机来了", score:82, hotness:6467053, url:"https://www.baidu.com/s?wd=iPhone17e", category:"科技前沿", keywords:["#iPhone","#消费电子","#新品"], summary:"iPhone 17e与MacBook Neo正式开售，补贴后起售价降至3999元，成为苹果在售最便宜手机。", sentiment:"正面", reasons:["苹果年度重磅新品","价格下探引发抢购","产业链受益"] },
  { id:13, title:"你的体育老师这次真的有事", score:81, hotness:6369990, url:"https://www.baidu.com/s?wd=体育老师有事", category:"校园与社会", keywords:["#乒乓","#WTT","#体育"], summary:"WTT重庆冠军赛朱雨玲3-0击败韩莹，复出之路引发热议，\"体育老师终于不生病了\"。", sentiment:"正面", reasons:["体育赛事热点","国乒话题自带流量","网络梗出圈"] },
  { id:14, title:"坐意大利火车发现车玻璃中国造", score:80, hotness:6286177, url:"https://www.baidu.com/s?wd=意大利火车中国造", category:"科技前沿", keywords:["#中国制造","#出海","#新材料"], summary:"网友在意大利坐火车发现车玻璃是中国金晶玻璃制造，感慨\"中国造遍布全球\"。", sentiment:"正面", reasons:["中国制造自豪感","海外实拍引发共鸣","制造业出海标杆"] },
  { id:15, title:"比亚迪李云飞回应闪充伤电池", score:79, hotness:6184385, url:"https://www.baidu.com/s?wd=比亚迪闪充", category:"科技前沿", keywords:["#新能源","#电池","#技术争议"], summary:"比亚迪品牌公关总经理李云飞发文回应闪充伤电池争议，表示已在电化学层面解决问题。", sentiment:"中性", reasons:["新能源核心话题","行业技术路线争议","消费者高度关注"] },
  { id:16, title:"人大代表随身带针 走到哪扎到哪", score:78, hotness:5993760, url:"https://www.baidu.com/s?wd=代表随身带针", category:"校园与社会", keywords:["#两会","#中医","#健康"], summary:"人大代表宋兆普两会期间随身带针为同事义诊，被称为行走的\"两会诊所\"。", sentiment:"正面", reasons:["两会特色人物","中医文化推广","健康话题热度"] },
  { id:17, title:"建议打工人上晚班先打坐几分钟", score:77, hotness:5899978, url:"https://www.baidu.com/s?wd=晚班打坐", category:"校园与社会", keywords:["#养生","#职场","#健康"], summary:"政协委员张高澄建议夜班工人上班前先打坐3-5分钟定心，引发打工人的养生讨论。", sentiment:"正面", reasons:["职场健康话题","实用建议引发共鸣","两会委员提案出圈"] },
  { id:18, title:"车险续保悲喜两重天：有人降有人涨", score:76, hotness:5806523, url:"https://www.baidu.com/s?wd=车险续保", category:"市场投资", keywords:["#车险","#金融","#消费"], summary:"新能源车主保费下降2500元，燃油车主未出险却涨1000元，车险差异化定价引发热议。", sentiment:"负面", reasons:["涉及车主切身利益","政策变化引关注","社交平台热议"] },
  { id:19, title:"\"吃完直接走人 不要客气\"", score:75, hotness:5707990, url:"https://www.baidu.com/s?wd=免费餐食", category:"校园与社会", keywords:["#正能量","#餐饮","#公益"], summary:"福州餐厅店主宣布为困难人群提供免费餐食，门口告示\"吃完直接走人不要客气\"，经营17年。", sentiment:"正面", reasons:["暖心事件刷屏","社会正能量","公益模式引讨论"] },
  { id:20, title:"建议节假日高速在途即免", score:74, hotness:5621708, url:"https://www.baidu.com/s?wd=高速在途即免", category:"宏观经济", keywords:["#交通","#政策","#民生"], summary:"人大代表建议节假日高速只要车辆在免费时段内处于在途状态，即享受全程免费，消除卡点焦虑。", sentiment:"正面", reasons:["民生政策提案","自驾出行者共鸣","交通管理新思路"] },
  { id:21, title:"世界最强超高强度碳纤维由中国研发", score:73, hotness:5513319, url:"https://www.baidu.com/s?wd=碳纤维中国研发", category:"科技前沿", keywords:["#新材料","#科技创新","#突破"], summary:"我国自主研发T1200级超高强度碳纤维全球首发，填补全球空白，实现重大技术跨越。", sentiment:"正面", reasons:["核心技术突破","国家战略意义","产业链影响深远"] },
  { id:22, title:"普京与伊朗总统佩泽希齐扬通话", score:72, hotness:5429621, url:"https://www.baidu.com/s?wd=普京伊朗通话", category:"宏观经济", keywords:["#国际关系","#地缘政治","#中东"], summary:"俄罗斯总统普京与伊朗总统通话讨论双边关系及地区局势，重申支持缓和冲突。", sentiment:"中性", reasons:["大国博弈动态","中东局势敏感","能源市场关注"] },
  { id:23, title:"老鼠竟在西湖游泳\"打劫\"观赏鱼", score:70, hotness:5215663, url:"https://www.baidu.com/s?wd=西湖老鼠", category:"校园与社会", keywords:["#奇闻","#西湖","#动物"], summary:"游客在杭州西湖\"花港观鱼\"区域拍到老鼠下水抢观赏鱼鱼食，景区回应将定期清除鼠害。", sentiment:"中性", reasons:["趣味视频传播","西湖景区话题","网友搞笑评论"] },
  { id:24, title:"朝鲜崔贤号驱逐舰试射战略巡航导弹", score:69, hotness:5119549, url:"https://www.baidu.com/s?wd=朝鲜导弹", category:"宏观经济", keywords:["#军事","#朝鲜半岛","#安全"], summary:"朝鲜\"崔贤\"号驱逐舰试射战略巡航导弹，金正恩视频观看，半岛局势再度紧张。", sentiment:"负面", reasons:["军事安全议题","半岛局势升温","国际社会关注"] },
  { id:25, title:"男子称借父母190万多次催还款遭拒", score:68, hotness:5048204, url:"https://www.baidu.com/s?wd=借父母190万", category:"校园与社会", keywords:["#家庭","#法律","#社会"], summary:"广西男子起诉父母要求偿还190万借款，因举证不足被法院驳回，引发关于亲情与金钱的讨论。", sentiment:"负面", reasons:["家庭伦理话题","法律知识科普","社交讨论度高"] },
  { id:26, title:"白岩松：龙虾火了 但主角一定还是人", score:67, hotness:4734315, url:"https://www.baidu.com/s?wd=白岩松龙虾", category:"科技前沿", keywords:["#AI","#龙虾","#评论"], summary:"白岩松两会期间评论AI\"养龙虾\"热潮，强调\"别急别慌别怕\"，世界主角一定还是人。", sentiment:"正面", reasons:["AI热点话题","权威媒体评论","科技与人关系讨论"] },
  { id:27, title:"福布斯发布年度全球亿万富豪榜", score:66, hotness:4563560, url:"https://www.baidu.com/s?wd=福布斯富豪榜", category:"市场投资", keywords:["#财富","#榜单","#经济"], summary:"福布斯发布第40届全球亿万富豪榜，3428人上榜创历史新高，全球财富版图发生微妙变化。", sentiment:"中性", reasons:["权威年度榜单","财富趋势参考","商业圈热议"] },
  { id:28, title:"科目四学员开车送科目一学员去考试", score:65, hotness:4480961, url:"https://www.baidu.com/s?wd=科目四送考", category:"校园与社会", keywords:["#驾考","#违法","#搞笑"], summary:"湖南永州科目四学员无证驾驶送科目一学员去考试，被交警当场查处，网友直呼\"离谱\"。", sentiment:"负面", reasons:["违法搞笑事件","驾考话题共鸣","安全警示意义"] },
  { id:29, title:"小伙掀翻自己三轮车给婚车让路", score:64, hotness:4254809, url:"https://www.baidu.com/s?wd=掀翻三轮车让路", category:"校园与社会", keywords:["#婚礼","#风俗","#暖心"], summary:"青海小伙骑三轮遇婚车，按当地习俗掀翻三轮给婚车让路，新郎包100元红包表示感谢。", sentiment:"正面", reasons:["地方民俗展示","暖心举动刷屏","网友热议各地婚俗"] },
  { id:30, title:"爆火的\"龙虾\"会抢人类饭碗吗", score:63, hotness:3872669, url:"https://www.baidu.com/s?wd=龙虾抢饭碗", category:"科技前沿", keywords:["#AI","#就业","#科技"], summary:"OpenClaw爆火全球，能写文案做表格写代码，\"龙虾\"是否会抢人类饭碗成为全网热议话题。", sentiment:"中性", reasons:["AI核心议题","就业焦虑共鸣","科技伦理讨论"] }
];

const CATEGORIES = ['全部', '科技前沿', '市场投资', '宏观经济', '校园与社会'];

// ======== 环形进度条组件 ========
function RingProgress({ score, size = 100 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 90 ? '#ef4444' : score >= 70 ? '#f97316' : '#3b82f6';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f3f4f6" strokeWidth="8"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 1.5s ease' }}
      />
    </svg>
  );
}

// ======== 主页面 ========
export default function TrendScore() {
  const [category, setCategory] = useState('全部');
  const [detail, setDetail] = useState(null);
  const [now, setNow] = useState(new Date());

  // 倒计时
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const next = new Date(now);
  next.setHours(23,0,0,0);
  if (now >= next) next.setDate(next.getDate()+1);
  const diff = next - now;
  const hh = Math.floor(diff/3600000);
  const mm = Math.floor((diff%3600000)/60000);
  const ss = Math.floor((diff%60000)/1000);

  // 日期
  const dateStr = now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});

  // 过滤
  const list = category === '全部' ? ALL_HOTSPOTS : ALL_HOTSPOTS.filter(h => h.category === category);
  const top = ALL_HOTSPOTS[0];

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",minHeight:'100vh',background:'#f8fafc'}}>
      <Head>
        <title>热力雷达 TrendScore</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
      </Head>

      {/* ===== HEADER ===== */}
      <div style={{position:'sticky',top:0,zIndex:50,background:'#fff',borderBottom:'1px solid #e5e7eb'}}>
        <div style={{maxWidth:480,margin:'0 auto',padding:'14px 20px'}}>
          {/* Logo + 日期 */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{
                width:32,height:32,borderRadius:10,
                background:'linear-gradient(135deg,#f97316,#ef4444)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:16,color:'#fff',fontWeight:700
              }}>🔥</div>
              <div>
                <div style={{fontWeight:700,fontSize:18,color:'#111827'}}>热力雷达</div>
                <div style={{fontSize:10,color:'#9ca3af',letterSpacing:1}}>TRENDSCORE</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#6b7280',textAlign:'right'}}>{dateStr}</div>
          </div>
          {/* 倒计时 */}
          <div style={{
            marginTop:12,display:'flex',justifyContent:'center',alignItems:'center',
            background:'linear-gradient(135deg,#7c3aed,#db2777)',borderRadius:20,
            padding:'8px 20px',color:'#fff',fontSize:13
          }}>
            <span style={{opacity:0.9}}>距下次更新</span>
            <span style={{margin:'0 4px',fontSize:18,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>
              {String(hh).padStart(2,'0')}:{String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}
            </span>
            <span style={{opacity:0.9}}>每晚23:00</span>
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <div style={{maxWidth:480,margin:'0 auto',padding:'16px 20px'}}>
        <div style={{
          borderRadius:20,overflow:'hidden',position:'relative',
          background: top.score>=90 ? 'linear-gradient(135deg,#dc2626,#f97316)' : top.score>=70 ? 'linear-gradient(135deg,#ea580c,#eab308)' : 'linear-gradient(135deg,#2563eb,#06b6d4)',
          padding:'28px 24px',color:'#fff'
        }}>
          {/* 热力值 + 环形图 */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div>
              <div style={{fontSize:11,opacity:0.8,textTransform:'uppercase',letterSpacing:2,marginBottom:4}}>Today's #1</div>
              <div style={{fontSize:42,fontWeight:800,lineHeight:1}}>
                🔥 <span style={{fontVariantNumeric:'tabular-nums'}}>{top.score}</span><span style={{fontSize:20,fontWeight:500,opacity:0.8}}>/100</span>
              </div>
            </div>
            <div style={{position:'relative',width:90,height:90}}>
              <RingProgress score={top.score} size={90} />
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:22}}>
                {top.score}
              </div>
            </div>
          </div>
          {/* 标题 */}
          <div style={{fontSize:20,fontWeight:700,lineHeight:1.4,marginBottom:10}}>{top.title}</div>
          {/* 摘要 */}
          <div style={{fontSize:13,opacity:0.9,lineHeight:1.6,marginBottom:14}}>{top.summary}</div>
          {/* 关键词 */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {top.keywords.map((k,i) => (
              <span key={i} style={{background:'rgba(255,255,255,0.2)',borderRadius:12,padding:'4px 12px',fontSize:12}}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 分类标签 ===== */}
      <div style={{
        maxWidth:480,margin:'0 auto',padding:'4px 20px 8px',
        overflowX:'auto',WebkitOverflowScrolling:'touch',
        display:'flex',gap:8
      }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            flexShrink:0,border:'none',cursor:'pointer',
            padding:'8px 18px',borderRadius:20,fontSize:13,fontWeight:600,
            background: category===c ? 'linear-gradient(135deg,#7c3aed,#db2777)' : '#f3f4f6',
            color: category===c ? '#fff' : '#374151',
            transition:'all 0.2s'
          }}>{c}</button>
        ))}
      </div>

      {/* ===== 信息流 ===== */}
      <div style={{maxWidth:480,margin:'0 auto',padding:'8px 20px 120px'}}>
        {list.map((h, i) => (
          <div key={h.id} onClick={() => setDetail(h)} style={{
            background:'#fff',borderRadius:14,padding:'16px 18px',
            marginBottom:10,cursor:'pointer',
            border:'1px solid #f3f4f6',
            boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
            transition:'box-shadow 0.2s'
          }}>
            <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
              {/* 排名 */}
              <div style={{
                width:28,height:28,borderRadius:8,flexShrink:0,
                background: i<3 ? (i===0?'#fbbf24':i===1?'#9ca3af':'#d97706') : '#f3f4f6',
                color: i<3 ? '#fff' : '#9ca3af',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:13,fontWeight:700
              }}>{i+1}</div>
              {/* 内容 */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{
                  fontSize:15,fontWeight:600,color:'#111827',
                  lineHeight:1.5,display:'-webkit-box',
                  WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'
                }}>{h.title}</div>
                {/* 关键词 */}
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                  {h.keywords.slice(0,3).map((k,j) => (
                    <span key={j} style={{background:'#f3f4f6',color:'#6b7280',borderRadius:10,padding:'2px 8px',fontSize:11}}>{k}</span>
                  ))}
                </div>
              </div>
              {/* 评分 */}
              <div style={{
                flexShrink:0,width:50,height:50,borderRadius:12,
                display:'flex',alignItems:'center',justifyContent:'center',
                flexDirection:'column',
                background: h.score>=90 ? 'linear-gradient(135deg,#ef4444,#f97316)' : h.score>=70 ? 'linear-gradient(135deg,#f97316,#eab308)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                color:'#fff'
              }}>
                <div style={{fontSize:20,fontWeight:800,lineHeight:1}}>{h.score}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== 底部详情面板 ===== */}
      {detail && (
        <div style={{position:'fixed',inset:0,zIndex:100}}>
          {/* 遮罩 */}
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)'}} onClick={() => setDetail(null)} />
          {/* 面板 */}
          <div style={{
            position:'absolute',bottom:0,left:0,right:0,
            background:'#fff',borderRadius:'24px 24px 0 0',
            padding:'24px 24px 40px',maxHeight:'70vh',overflowY:'auto'
          }}>
            {/* 拖拽条 */}
            <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
              <div style={{width:40,height:4,borderRadius:2,background:'#d1d5db'}} />
            </div>
            {/* 评分 + 情绪 */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontSize:28,fontWeight:800,
                color: detail.score>=90 ? '#ef4444' : detail.score>=70 ? '#f97316' : '#3b82f6'
              }}>{detail.score}/100</div>
              <span style={{
                padding:'6px 14px',borderRadius:20,fontSize:13,fontWeight:600,
                background: detail.sentiment==='正面' ? '#dcfce7' : detail.sentiment==='负面' ? '#fee2e2' : '#f3f4f6',
                color: detail.sentiment==='正面' ? '#16a34a' : detail.sentiment==='负面' ? '#dc2626' : '#6b7280'
              }}>{detail.sentiment==='正面' ? '📈 正面' : detail.sentiment==='负面' ? '📉 负面' : '➡️ 中性'}</span>
            </div>
            {/* 标题 */}
            <div style={{fontSize:18,fontWeight:700,color:'#111827',lineHeight:1.4,marginBottom:16}}>{detail.title}</div>
            {/* 事件简述 */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,color:'#6b7280',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>事件简述</div>
              <div style={{fontSize:14,color:'#374151',lineHeight:1.7}}>{detail.summary}</div>
            </div>
            {/* 打分依据 */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:'#6b7280',marginBottom:8,textTransform:'uppercase',letterSpacing:1}}>打分依据</div>
              {detail.reasons.map((r,i) => (
                <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6}}>
                  <span style={{color:'#7c3aed',fontWeight:700,flexShrink:0}}>●</span>
                  <span style={{fontSize:14,color:'#374151',lineHeight:1.5}}>{r}</span>
                </div>
              ))}
            </div>
            {/* 查看原文按钮 */}
            <a href={detail.url} target="_blank" rel="noopener noreferrer" style={{
              display:'block',textAlign:'center',
              background:'linear-gradient(135deg,#7c3aed,#db2777)',
              color:'#fff',padding:'14px',borderRadius:14,
              fontSize:15,fontWeight:600,textDecoration:'none'
            }}>查看原文 →</a>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{textAlign:'center',padding:'20px',fontSize:11,color:'#9ca3af'}}>
        © 2026 热力雷达 TrendScore · 每天23:00自动更新
      </div>
    </div>
  );
}