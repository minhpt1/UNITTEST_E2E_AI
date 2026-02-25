import React from 'react';
import RealtimeClock from './RealtimeClock';
import WeatherWidget from './WeatherWidget';
import GoldPriceChart from './GoldPriceChart';

const PostInfoPanel: React.FC = () => {
  return (
    <div className="post-info-panel">
      <RealtimeClock />
      <WeatherWidget />
      <GoldPriceChart />
    </div>
  );
};

export default PostInfoPanel;
