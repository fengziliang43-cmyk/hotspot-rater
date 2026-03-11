// 模拟热点数据，包含分类、情绪倾向和打分依据
export const mockHotspots = [
  {
    id: 1,
    title: "义乌爆单！全球采购商蜂拥而至",
    score: 98,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 7808028,
    url: "https://www.baidu.com/s?wd=义乌爆单",
    category: "市场投资",
    keywords: ["#外贸", "#制造业", "#经济复苏"],
    summary: "经过春节假期的短暂休整，义乌国际商贸城一开市全球的采购商就蜂拥而至，有的商户假期期间就已蓄满了第一季度的生产订单。",
    sentiment: "正面",
    scoringReasons: ["全网搜索量激增500%", "引发核心讨论", "影响产业链"]
  },
  {
    id: 2,
    title: "\"成为中国人\"为何刷屏两会",
    score: 94,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 7617854,
    url: "https://www.baidu.com/s?wd=成为中国人",
    category: "宏观经济",
    keywords: ["#两会", "#文化认同", "#国际影响"],
    summary: "2026年全国两会在北京召开，会场内外，热词刷屏——\"成为中国人\"(Becoming Chinese)。来自两会现场的外媒声音，与线上如火如荼的风潮...",
    sentiment: "正面",
    scoringReasons: ["两会热点话题", "国际媒体关注", "社交讨论度高"]
  },
  {
    id: 3,
    title: "委员：劳动者退休后养老待遇应平等",
    score: 93,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 7521368,
    url: "https://www.baidu.com/s?wd=养老待遇",
    category: "校园与社会",
    keywords: ["#养老", "#社会保障", "#政策建议"],
    summary: "全国政协委员周世虹提出：机关事业单位、企业职工和城乡居民这三大群体退休人员的养老金待遇差距较大，劳动者退休后的养老待遇应...",
    sentiment: "中性",
    scoringReasons: ["民生热点", "政策讨论", "社会关注度高"]
  },
  {
    id: 4,
    title: "华莱士正式宣布退市",
    score: 92,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 7424401,
    url: "https://www.baidu.com/s?wd=华莱士退市",
    category: "市场投资",
    keywords: ["#餐饮", "#退市", "#企业经营"],
    summary: "2026年2月12日，华莱士母公司华士食品正式从新三板退市，官方称旨在降低运营成本。退市背后，公司总负债达21.08亿元...",
    sentiment: "负面",
    scoringReasons: ["企业重大变动", "财务数据异常", "行业影响"]
  },
  {
    id: 5,
    title: "阿德巴约单场狂砍83分超越科比",
    score: 90,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 6946093,
    url: "https://www.baidu.com/s?wd=阿德巴约83分",
    category: "校园与社会",
    keywords: ["#NBA", "#体育", "#纪录"],
    summary: "3月11日，热火队中锋阿德巴约在对阵奇才的比赛中狂砍83分，超越科比·布莱恩特2006年的81分纪录，位列NBA历史单场得分榜第二位。",
    sentiment: "正面",
    scoringReasons: ["体育纪录突破", "历史意义", "粉丝热议"]
  },
  {
    id: 6,
    title: "世界最强超高强度碳纤维由中国研发",
    score: 88,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 5513319,
    url: "https://www.baidu.com/s?wd=碳纤维研发",
    category: "科技前沿",
    keywords: ["#新材料", "#科技创新", "#中国制造"],
    summary: "3月11日，我国自主研发的T1200级超高强度碳纤维全球首发。这一突破填补了全球相关领域的空白，标志着我国在超高强度碳纤维生产领域实现了重大跨越。",
    sentiment: "正面",
    scoringReasons: ["技术突破", "国家战略", "产业影响"]
  },
  {
    id: 7,
    title: "苹果最便宜手机来了",
    score: 85,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 6467053,
    url: "https://www.baidu.com/s?wd=苹果最便宜手机",
    category: "科技前沿",
    keywords: ["#iPhone", "#消费电子", "#新品发布"],
    summary: "3月11日，iPhone 17e与MacBook Neo正式开售。iPhone 17e支持参与国家补贴活动，补贴后起售价降至3999元，成为苹果在售...",
    sentiment: "正面",
    scoringReasons: ["新品发布", "价格策略", "市场期待"]
  },
  {
    id: 8,
    title: "济南共享菜园走红：出租率超90%",
    score: 82,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 7135570,
    url: "https://www.baidu.com/s?wd=共享菜园",
    category: "校园与社会",
    keywords: ["#共享经济", "#农业", "#生活方式"],
    summary: "近日，济南掀起共享菜园\"种地热\"，单包一块30平米的地1年收费1299元，市民可以根据需求选择自己种植或托管。据悉，共享菜园出租率超90%。",
    sentiment: "正面",
    scoringReasons: ["新兴商业模式", "生活趋势", "用户参与度高"]
  },
  {
    id: 9,
    title: "国际油价历史性暴跌",
    score: 80,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 6754372,
    url: "https://www.baidu.com/s?wd=国际油价暴跌",
    category: "市场投资",
    keywords: ["#原油", "#金融市场", "#全球经济"],
    summary: "3月10日，国际油价跌超11％，创下2022年以来单日最大跌幅。WTI原油期货价格下跌11.32美元，跌幅11.9%，收于83.45美元/桶...",
    sentiment: "负面",
    scoringReasons: ["市场剧烈波动", "经济影响", "投资者关注"]
  },
  {
    id: 10,
    title: "福布斯发布年度全球亿万富豪榜",
    score: 78,
    platform: "baidu",
    platformName: "百度热搜",
    hotness: 4563560,
    url: "https://www.baidu.com/s?wd=福布斯富豪榜",
    category: "市场投资",
    keywords: ["#财富", "#富豪", "#经济指标"],
    summary: "当地时间3月10日，《福布斯》发布第40届年度《全球亿万富豪榜》。今年共有3428人登上榜单，比去年增加400人，创下1987年榜单设立以来的新高。",
    sentiment: "中性",
    scoringReasons: ["权威榜单", "财富趋势", "商业关注"]
  }
];

// 补充到30条数据
for (let i = 11; i <= 30; i++) {
  mockHotspots.push({
    id: i,
    title: `热点话题示例 ${i}`,
    score: Math.floor(Math.random() * 30) + 70, // 70-100分
    platform: "baidu",
    platformName: "百度热搜",
    hotness: Math.floor(Math.random() * 5000000) + 1000000,
    url: `https://www.baidu.com/s?wd=热点${i}`,
    category: ["科技前沿", "市场投资", "宏观经济", "校园与社会"][Math.floor(Math.random() * 4)],
    keywords: [`#关键词${i}`, "#热门话题", "#趋势"],
    summary: `这是热点话题 ${i} 的简要描述，展示了当前的热门趋势和讨论焦点。`,
    sentiment: ["正面", "负面", "中性"][Math.floor(Math.random() * 3)],
    scoringReasons: ["搜索量激增", "社交讨论", "媒体报道"]
  });
}

export default mockHotspots;