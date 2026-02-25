import React from 'react';
import { WeatherData } from '../../types';

const WeatherWidget: React.FC = () => {
  // Mock weather data for Hanoi
  const weather: WeatherData = {
    location: 'Hà Nội, Việt Nam',
    temperature: 28,
    condition: 'Nắng',
    humidity: 65,
    icon: '☀️',
  };

  return (
    <div className="weather-widget">
      <div className="weather-location">{weather.location}</div>
      <div className="weather-main">
        <span className="weather-icon">{weather.icon}</span>
        <span className="weather-temp">{weather.temperature}°C</span>
      </div>
      <div className="weather-condition">{weather.condition}</div>
      <div className="weather-humidity">
        Độ ẩm: <span>{weather.humidity}%</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
