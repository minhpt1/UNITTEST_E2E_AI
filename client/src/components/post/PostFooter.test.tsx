import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostFooter from './PostFooter';
import { mockBlogPost } from '../../test/fixtures';

describe('PostFooter Component', () => {
  it('renders post tags', () => {
    render(<PostFooter post={mockBlogPost} />);
    
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
  });

  it('renders all tags from post', () => {
    const postWithManyTags = {
      ...mockBlogPost,
      tags: ['react', 'typescript', 'javascript', 'testing', 'vitest']
    };
    
    render(<PostFooter post={postWithManyTags} />);
    
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#javascript')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
    expect(screen.getByText('#vitest')).toBeInTheDocument();
  });

  it('renders empty when no tags', () => {
    const postWithoutTags = { ...mockBlogPost, tags: [] };
    render(<PostFooter post={postWithoutTags} />);
    
    const tagsDiv = document.querySelector('.post-tags');
    expect(tagsDiv).toBeInTheDocument();
    expect(tagsDiv?.children).toHaveLength(0);
  });

  it('has correct CSS classes', () => {
    render(<PostFooter post={mockBlogPost} />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('post-footer');
    
    const tagsDiv = document.querySelector('.post-tags');
    expect(tagsDiv).toBeInTheDocument();
    
    const tagElements = document.querySelectorAll('.tag');
    expect(tagElements).toHaveLength(2);
  });
});