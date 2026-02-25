import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from './PostCard';
import { mockBlogPost } from '../../test/fixtures';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PostCard Component', () => {
  it('renders post information', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post summary')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders featured image when provided', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    const image = screen.getByAltText('Test Post');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockBlogPost.featuredImage);
  });

  it('renders without featured image', () => {
    const postWithoutImage = { ...mockBlogPost, featuredImage: undefined };
    renderWithRouter(<PostCard post={postWithoutImage} />);
    
    expect(screen.queryByAltText('Test Post')).not.toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

  it('renders read more link with correct href', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    const readMoreLink = screen.getByText('Read more →');
    expect(readMoreLink).toBeInTheDocument();
    expect(readMoreLink.closest('a')).toHaveAttribute('href', '/posts/test-post');
  });

  it('renders title link with correct href', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    const titleLink = screen.getByText('Test Post').closest('a');
    expect(titleLink).toHaveAttribute('href', '/posts/test-post');
  });

  it('formats date correctly', () => {
    renderWithRouter(<PostCard post={mockBlogPost} />);
    
    expect(screen.getByText(/1\/1\/2024|2024/)).toBeInTheDocument();
  });
});