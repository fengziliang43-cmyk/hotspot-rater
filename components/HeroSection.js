import React from 'react';

export default function HeroSection({ hotspot }) {
  if (!hotspot) return null;

  const getBackgroundColor = (score) => {
    if (score >= 90) return 'from-red-500 to-orange-500';
    if (score >= 70) return 'from-orange-400 to-yellow-400';
    return 'from-blue-400 to-indigo-500';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-blue-500';
  };

  // 简单的摘要生成（实际项目中应该由AI生成）
  const generateSummary = (title) => {
    const techKeywords = ['AI', '科技', '半导体', '芯片', '模型', '算法', '数据'];
    const marketKeywords = ['股市', '投资', '财报', '金融', '经济', '市场', '价格'];
    const socialKeywords = ['政策', '社会', '校园', '教育', '民生', '两会', '政府'];
    
    if (techKeywords.some(kw => title.includes(kw))) {
      return '科技领域重大突破，引发产业链关注';
    } else if (marketKeywords.some(kw => title.includes(kw))) {
      return '市场资金流向发生显著变化';
    } else if (socialKeywords.some(kw => title.includes(kw))) {
      return '社会关注度高，政策影响深远';
    } else {
      return '全网热议话题，影响力持续发酵';
    }
  };

  return (
    <div className={`relative rounded-2xl p-6 mb-6 bg-gradient-to-br ${getBackgroundColor(hotspot.score)} text-white overflow-hidden`}>
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
              {hotspot.platformName}
            </span>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">🔥 {hotspot.score}/100</div>
            <div className="text-sm opacity-90">热力值</div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 leading-tight">{hotspot.title}</h2>
        <p className="text-lg opacity-90 mb-4">{generateSummary(hotspot.title)}</p>
        
        {/* 环形进度条 */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - hotspot.score / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{hotspot.score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}