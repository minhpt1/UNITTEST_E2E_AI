import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
    hasNext: true,
    hasPrev: false
  };

  it('renders pagination buttons', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders correct page numbers', () => {
    render(<Pagination {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles page navigation', () => {
    const mockPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={mockPageChange} />);
    
    fireEvent.click(screen.getByText('2'));
    expect(mockPageChange).toHaveBeenCalledWith(2);
    
    fireEvent.click(screen.getByText('Next'));
    expect(mockPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton.closest('button')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} hasNext={false} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('btn-primary');
    
    // Other pages should have btn-secondary
    const otherPageButton = screen.getByText('1');
    expect(otherPageButton).toHaveClass('btn-secondary');
  });

  it('updates button states for different pages', () => {
    const { rerender } = render(<Pagination {...defaultProps} currentPage={2} hasPrev={true} />);
    
    // Check that page 2 is highlighted
    expect(screen.getByText('2')).toHaveClass('btn-primary');
    expect(screen.getByText('Previous')).not.toBeDisabled();
    
    rerender(<Pagination {...defaultProps} currentPage={5} hasNext={false} hasPrev={true} />);
    
    // Check that page 5 is highlighted and Next is disabled
    expect(screen.getByText('5')).toHaveClass('btn-primary');
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('has correct CSS classes', () => {
    render(<Pagination {...defaultProps} />);
    
    const pagination = document.querySelector('.pagination');
    expect(pagination).toBeInTheDocument();
    
    // Check button classes
    const buttons = document.querySelectorAll('.btn');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check current page has primary class
    const activeButton = screen.getByText('1');
    expect(activeButton).toHaveClass('btn-primary');
    
    // Check other buttons have secondary class
    const secondaryButton = screen.getByText('2');
    expect(secondaryButton).toHaveClass('btn-secondary');
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    
    const paginationWrapper = container.querySelector('.pagination-wrapper');
    expect(paginationWrapper).not.toBeInTheDocument();
  });
});