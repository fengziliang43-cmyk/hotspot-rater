import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function HotspotRater() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 客户端直接抓取百度热搜数据
    fetchBaiduHotspots();
  }, []);

  const fetchBaiduHotspots = async () => {
    try {
      setLoading(true);
      
      // 使用 CORS 代理来绕过跨域限制
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = 'https://top.baidu.com/board?tab=realtime';
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      const html = await response.text();
      
      // 解析 HTML 获取热点数据
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const hotspotElements = doc.querySelectorAll('.category-wrap .item-wrap');
      const hotspotsData = [];
      
      hotspotElements.forEach((element, index) => {
        if (index >= 30) return; // 只取前30个
        
        const titleElement = element.querySelector('.c-single-text-ellipsis');
        const hotnessElement = element.querySelector('.hot-index');
        const linkElement = element.querySelector('a');
        
        if (titleElement && hotnessElement && linkElement) {
          const title = titleElement.textContent.trim();
          const hotnessText = hotnessElement.textContent.trim();
          const hotness = parseInt(hotnessText.replace(/,/g, '')) || 0;
          const url = linkElement.href;
          
          // 计算评分 (0-100)
          const score = Math.min(100, Math.round(Math.log10(hotness + 1) * 15));
          
          hotspotsData.push({
            id: index,
            title,
            url,
            hotness,
            score,
            platform: 'baidu',
            platformName: '百度热搜'
          });
        }
      });
      
      setHotspots(hotspotsData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch hotspots:', err);
      setError('获取热点数据失败，请稍后再试');
      setLoading(false);
      
      // 显示模拟数据作为备选
      const mockData = [
        { id: 1, title: '义乌爆单！全球采购商蜂拥而至', url: 'https://www.baidu.com/s?wd=义乌爆单', hotness: 7808028, score: 95, platform: 'baidu', platformName: '百度热搜' },
        { id: 2, title: '"成为中国人"为何刷屏两会', url: 'https://www.baidu.com/s?wd=成为中国人', hotness: 7617854, score: 94, platform: 'baidu', platformName: '百度热搜' },
        { id: 3, title: '委员：劳动者退休后养老待遇应平等', url: 'https://www.baidu.com/s?wd=养老待遇', hotness: 7521368, score: 94, platform: 'baidu', platformName: '百度热搜' },
        { id: 4, title: '华莱士正式宣布退市', url: 'https://www.baidu.com/s?wd=华莱士退市', hotness: 7424401, score: 93, platformName: '百度热搜' },
        { id: 5, title: '阿德巴约单场狂砍83分超越科比', url: 'https://www.baidu.com/s?wd=阿德巴约83分', hotness: 6946093, score: 92, platform: 'baidu', platformName: '百度热搜' }
      ];
      setHotspots(mockData);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>🔥 每日热点评分</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="每日自动更新的热点话题评分系统" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔥 每日热点评分</h1>
          <p className="text-gray-600">每天23:00自动更新 • 数据来自百度热搜</p>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">正在获取最新热点数据...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">{error}</p>
            <p className="text-yellow-600 mt-2">显示模拟数据供参考</p>
          </div>
        ) : hotspots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">暂无热点数据，请稍后再试</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hotspots.map((hotspot) => (
              <div 
                key={hotspot.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <a 
                      href={hotspot.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {hotspot.title}
                      </h3>
                    </a>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-3">热度: {formatNumber(hotspot.hotness)}</span>
                      <span>来源: {hotspot.platformName}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{hotspot.score}</div>
                      <div className="text-xs text-gray-500">评分</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>点击热点标题可跳转到原始链接</p>
          <p className="mt-2">数据每24小时更新一次</p>
        </footer>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}