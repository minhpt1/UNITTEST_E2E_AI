import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RealtimeClock from './RealtimeClock';

describe('RealtimeClock Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-25T10:30:45'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render current date and time', () => {
    render(<RealtimeClock />);
    
    expect(screen.getByText(/25 tháng 2, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/10:30:45/i)).toBeInTheDocument();
  });

  it('should update time every second', () => {
    const { container } = render(<RealtimeClock />);
    
    const initialTimeText = container.querySelector('.clock-time')?.textContent;
    expect(initialTimeText).toBeTruthy();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    const updatedTimeText = container.querySelector('.clock-time')?.textContent;
    expect(updatedTimeText).toBeTruthy();
    expect(updatedTimeText).not.toBe(initialTimeText);
  });

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<RealtimeClock />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should format date in Vietnamese', () => {
    render(<RealtimeClock />);
    
    const dateElement = screen.getByText(/tháng/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('should display time with seconds', () => {
    render(<RealtimeClock />);
    
    const timeText = screen.getByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timeText).toBeInTheDocument();
  });
});
