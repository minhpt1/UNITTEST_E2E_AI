import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoldPrice, PricePoint } from '../../types';

const GoldPriceChart: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<GoldPrice>({
    price: 7850000,
    currency: 'VND',
    unit: 'chỉ',
    change: 50000,
    changePercent: 0.64,
    timestamp: new Date().toISOString(),
  });

  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([
    { time: '10:00', price: 7800000 },
    { time: '10:30', price: 7820000 },
    { time: '11:00', price: 7810000 },
    { time: '11:30', price: 7830000 },
    { time: '12:00', price: 7850000 },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomChange = (Math.random() - 0.5) * 100000;
      const newPrice = currentPrice.price + randomChange;
      const change = newPrice - 7800000;
      const changePercent = (change / 7800000) * 100;

      setCurrentPrice({
        price: newPrice,
        currency: 'VND',
        unit: 'chỉ',
        change,
        changePercent,
        timestamp: new Date().toISOString(),
      });

      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setPriceHistory(prev => {
        const updated = [...prev.slice(-4), { time: timeStr, price: newPrice }];
        return updated;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentPrice.price]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(price));
  };

  const isPositive = currentPrice.changePercent >= 0;

  return (
    <div className="gold-price-chart">
      <div className="gold-price-header">
        <h3>Giá vàng</h3>
        <div className="price-info">
          <div className="current-price">
            {formatPrice(currentPrice.price)} {currentPrice.currency}/{currentPrice.unit}
          </div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {formatPrice(Math.abs(currentPrice.change))} ({currentPrice.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={priceHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin - 50000', 'dataMax + 50000']} />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatPrice(value) : ''} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={isPositive ? '#10b981' : '#ef4444'} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoldPriceChart;
