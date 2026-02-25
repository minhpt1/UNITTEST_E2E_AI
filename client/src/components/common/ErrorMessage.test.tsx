import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<ErrorMessage message="Error" />);
    const errorElement = screen.getByText('Error');
    expect(errorElement).toHaveClass('error');
  });

  it('renders with custom className', () => {
    render(<ErrorMessage message="Custom error" className="custom-error" />);
    const errorElement = screen.getByText('Custom error');
    expect(errorElement).toHaveClass('custom-error');
  });

  it('renders with different error messages', () => {
    const { rerender } = render(<ErrorMessage message="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();

    rerender(<ErrorMessage message="Validation error" />);
    expect(screen.getByText('Validation error')).toBeInTheDocument();
  });
});