import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders loading message', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<Loading />);
    const loadingElement = screen.getByText('Loading...');
    expect(loadingElement).toHaveClass('loading');
  });

  it('renders with custom message', () => {
    render(<Loading message="Loading posts..." />);
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Loading className="custom-loading" />);
    const loadingElement = screen.getByText('Loading...');
    expect(loadingElement).toHaveClass('custom-loading');
  });
});