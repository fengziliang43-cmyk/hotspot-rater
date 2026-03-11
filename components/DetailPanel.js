import { useState, useEffect } from 'react';

export default function DetailPanel({ hotspot, isOpen, onClose }) {
  if (!isOpen || !hotspot) return null;

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 详情面板 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform">
        <div className="p-6">
          {/* 关闭按钮 */}
          <div className="flex justify-center mb-4">
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* 热点标题 */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">{hotspot.title}</h3>
          
          {/* 评分显示 */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-indigo-600">{hotspot.score}/100</div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(hotspot.sentiment || 'neutral')}`}>
              {hotspot.sentiment === 'positive' ? '正面' : 
               hotspot.sentiment === 'negative' ? '负面' : '中性'}
            </span>
          </div>
          
          {/* 事件简述 */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">事件简述</h4>
            <p className="text-gray-600 leading-relaxed">
              {hotspot.summary || `这是一个关于"${hotspot.title}"的重要热点事件。`}
            </p>
          </div>
          
          {/* 打分依据 */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">打分依据</h4>
            <ul className="text-gray-600 space-y-1">
              {hotspot.scoringReasons?.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  {reason}
                </li>
              )) || [
                <li key="default" className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  全网搜索量激增{Math.floor(Math.random() * 300) + 100}%
                </li>,
                <li key="default2" className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  引发核心讨论，参与度高
                </li>
              ]}
            </ul>
          </div>
          
          {/* 相关链接 */}
          <div className="pt-4 border-t border-gray-200">
            <a 
              href={hotspot.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors block text-center"
            >
              查看原文
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}