import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostInfoPanel from './PostInfoPanel';

// Mock child components
vi.mock('./RealtimeClock', () => ({
  default: () => <div data-testid="realtime-clock">Clock</div>,
}));

vi.mock('./WeatherWidget', () => ({
  default: () => <div data-testid="weather-widget">Weather</div>,
}));

vi.mock('./GoldPriceChart', () => ({
  default: () => <div data-testid="gold-price-chart">Gold Price</div>,
}));

describe('PostInfoPanel Component', () => {
  it('should render all three widgets', () => {
    render(<PostInfoPanel />);
    
    expect(screen.getByTestId('realtime-clock')).toBeInTheDocument();
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
    expect(screen.getByTestId('gold-price-chart')).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    const { container } = render(<PostInfoPanel />);
    
    const panel = container.querySelector('.post-info-panel');
    expect(panel).toBeInTheDocument();
    expect(panel?.children.length).toBe(3);
  });

  it('should render RealtimeClock component', () => {
    render(<PostInfoPanel />);
    
    expect(screen.getByTestId('realtime-clock')).toBeInTheDocument();
  });

  it('should render WeatherWidget component', () => {
    render(<PostInfoPanel />);
    
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  it('should render GoldPriceChart component', () => {
    render(<PostInfoPanel />);
    
    expect(screen.getByTestId('gold-price-chart')).toBeInTheDocument();
  });
});
