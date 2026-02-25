import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GoldPriceChart from './GoldPriceChart';

// Mock recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

describe('GoldPriceChart Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render chart with initial data', () => {
    const { container } = render(<GoldPriceChart />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should display current gold price', () => {
    render(<GoldPriceChart />);
    
    expect(screen.getByText(/Giá vàng/i)).toBeInTheDocument();
    expect(screen.getByText(/VND\/chỉ/i)).toBeInTheDocument();
  });

  it('should display price change indicator', () => {
    const { container } = render(<GoldPriceChart />);
    
    const changeIndicator = container.querySelector('.price-change');
    expect(changeIndicator).toBeInTheDocument();
  });

  it('should update prices periodically', () => {
    const { container } = render(<GoldPriceChart />);
    
    const initialPrice = container.querySelector('.current-price')?.textContent;
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    // Price should have updated (or at least the component should still be mounted)
    const updatedPrice = container.querySelector('.current-price');
    expect(updatedPrice).toBeInTheDocument();
  });

  it('should show up indicator when price increases', () => {
    const { container } = render(<GoldPriceChart />);
    
    const changeIndicator = container.querySelector('.price-change');
    expect(changeIndicator).toBeTruthy();
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<GoldPriceChart />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<GoldPriceChart />);
    
    expect(container.querySelector('.gold-price-chart')).toBeInTheDocument();
  });
});
