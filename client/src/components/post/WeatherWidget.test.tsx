import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WeatherWidget from './WeatherWidget';

describe('WeatherWidget Component', () => {
  it('should render weather information', () => {
    render(<WeatherWidget />);
    
    expect(screen.getByText(/Hà Nội/i)).toBeInTheDocument();
    expect(screen.getByText(/°C/i)).toBeInTheDocument();
  });

  it('should display temperature', () => {
    render(<WeatherWidget />);
    
    const tempElement = screen.getByText(/\d+°C/i);
    expect(tempElement).toBeInTheDocument();
  });

  it('should display weather condition', () => {
    render(<WeatherWidget />);
    
    const conditionElement = screen.getByText(/(Nắng|Mây|Mưa|Nhiều mây)/i);
    expect(conditionElement).toBeInTheDocument();
  });

  it('should display humidity', () => {
    render(<WeatherWidget />);
    
    expect(screen.getByText(/Độ ẩm/i)).toBeInTheDocument();
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  it('should display weather icon', () => {
    const { container } = render(<WeatherWidget />);
    
    const icon = container.querySelector('.weather-icon');
    expect(icon).toBeInTheDocument();
    expect(icon?.textContent).toBeTruthy();
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<WeatherWidget />);
    
    expect(container.querySelector('.weather-widget')).toBeInTheDocument();
  });
});
