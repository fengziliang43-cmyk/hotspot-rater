import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextUpdate = new Date();
      nextUpdate.setHours(23, 0, 0, 0); // 23:00:00
      
      if (now >= nextUpdate) {
        // 如果已经过了23点，设置为明天23点
        nextUpdate.setDate(nextUpdate.getDate() + 1);
      }
      
      const difference = nextUpdate - now;
      
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-timer">
      <span className="countdown-text">距下次更新：</span>
      <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
      <span className="countdown-unit">时</span>
      <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
      <span className="countdown-unit">分</span>
      <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
      <span className="countdown-unit">秒</span>
    </div>
  );
}