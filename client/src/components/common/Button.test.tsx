import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default variant and size', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-medium');
  });

  it('applies custom variant and size', () => {
    render(<Button variant="secondary" size="large">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'btn-secondary', 'btn-large');
  });

  it('handles onClick events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards additional props', () => {
    render(<Button type="submit" data-testid="submit-btn">Submit</Button>);
    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Loading...');
    expect(button).toBeDisabled();
  });
});