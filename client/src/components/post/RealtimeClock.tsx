import React, { useState, useEffect } from 'react';

const RealtimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="realtime-clock">
      <div className="clock-date">{formatDate(currentTime)}</div>
      <div className="clock-time">{formatTime(currentTime)}</div>
    </div>
  );
};

export default RealtimeClock;
