import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import HeroSection from '../components/HeroSection';
import CategoryTabs from '../components/CategoryTabs';
import DetailPanel from '../components/DetailPanel';
import CountdownTimer from '../components/CountdownTimer';
import { mockHotspots } from '../lib/mock-data';

export default function TrendScore() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // 获取当前日期格式化
  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 过滤热点数据
  const filteredHotspots = selectedCategory === '全部' 
    ? mockHotspots 
    : mockHotspots.filter(hotspot => hotspot.category === selectedCategory);

  // 获取最高分热点（用于Hero区域）
  const topHotspot = mockHotspots.reduce((max, current) => 
    current.score > max.score ? current : max, mockHotspots[0]);

  // 更新当前时间（用于倒计时）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>热力雷达 TrendScore</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🔥</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">热力雷达</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
            </div>
          </div>
          
          {/* 倒计时器 */}
          <div className="mt-4 text-center">
            <CountdownTimer targetHour={23} currentTime={currentTime} />
          </div>
        </div>
      </header>

      {/* 今日焦点区 */}
      <HeroSection hotspot={topHotspot} />

      {/* 分类滑动标签 */}
      <div className="px-4 py-4 bg-white">
        <CategoryTabs 
          categories={['全部', '科技前沿', '市场投资', '宏观经济', '校园与社会']}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* 热点信息流 */}
      <main className="max-w-4xl mx-auto px-4 pb-24">
        <div className="space-y-4">
          {filteredHotspots.map((hotspot, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 leading-relaxed break-words">
                    {hotspot.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hotspot.keywords?.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className={`px-3 py-2 rounded-lg font-bold text-white text-lg ${
                    hotspot.score >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    hotspot.score >= 70 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}>
                    {hotspot.score}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 底部详情面板 */}
      {selectedHotspot && (
        <DetailPanel 
          hotspot={selectedHotspot} 
          onClose={() => setSelectedHotspot(null)} 
        />
      )}
    </div>
  );
}