import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchHotspots();
  }, []);

  const fetchHotspots = async () => {
    try {
      const response = await fetch('/api/hotspots');
      const data = await response.json();
      setHotspots(data.hotspots || []);
      setLastUpdated(data.lastUpdated || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hotspots:', error);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载今日热点...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>每日热点评分</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">🔥 每日热点评分</h1>
          {lastUpdated && (
            <p className="mt-2 text-sm text-gray-500">
              最后更新: {new Date(lastUpdated).toLocaleString('zh-CN')}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {hotspots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无热点数据，请稍后再试</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hotspots.map((hotspot, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <a 
                      href={hotspot.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-700 hover:text-blue-900 break-words"
                    >
                      {hotspot.title}
                    </a>
                    <p className="mt-1 text-sm text-gray-500">
                      来源: {hotspot.source}
                    </p>
                  </div>
                  <div className={`ml-4 text-right ${getScoreColor(hotspot.score)}`}>
                    <div className="text-2xl font-bold">{hotspot.score}</div>
                    <div className="text-xs text-gray-500">分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>每天23:00自动更新 • 数据来自微博、知乎、抖音、百度、小红书</p>
        </div>
      </footer>
    </div>
  );
}