import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostHeader from './PostHeader';
import { mockBlogPost } from '../../test/fixtures';

// Mock PostInfoPanel to isolate PostHeader tests
vi.mock('./PostInfoPanel', () => ({
  default: () => <div data-testid="post-info-panel">Info Panel</div>,
}));

describe('PostHeader Component', () => {
  const mockFormatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('vi-VN');

  it('renders post title', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Post');
  });

  it('renders post meta information', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });

  it('renders featured image when provided', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    const image = screen.getByAltText('Test Post');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockBlogPost.featuredImage);
    expect(image).toHaveClass('featured-image');
  });

  it('does not render image when not provided', () => {
    const postWithoutImage = { ...mockBlogPost, featuredImage: undefined };
    render(<PostHeader post={postWithoutImage} onFormatDate={mockFormatDate} />);
    
    expect(screen.queryByAltText('Test Post')).not.toBeInTheDocument();
  });

  it('uses publishedAt date when available', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });

  it('falls back to createdAt when publishedAt is not available', () => {
    const postWithoutPublishedAt = { ...mockBlogPost, publishedAt: undefined };
    render(<PostHeader post={postWithoutPublishedAt} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('post-header');
    
    expect(screen.getByText('Technology')).toHaveClass('post-category');
    expect(screen.getByText('1/1/2024')).toHaveClass('post-date');
    expect(screen.getByRole('heading')).toHaveClass('post-title');
  });

  it('renders PostInfoPanel', () => {
    render(<PostHeader post={mockBlogPost} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByTestId('post-info-panel')).toBeInTheDocument();
  });
});