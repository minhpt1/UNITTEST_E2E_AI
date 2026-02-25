import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostContent from './PostContent';
import { mockBlogPost } from '../../test/fixtures';

describe('PostContent Component', () => {
  it('renders post summary', () => {
    render(<PostContent post={mockBlogPost} />);
    
    expect(screen.getByText('This is a test post summary')).toBeInTheDocument();
  });

  it('renders post content with HTML formatting', () => {
    const postWithNewlines = {
      ...mockBlogPost,
      content: 'Line 1\nLine 2\nLine 3'
    };
    
    render(<PostContent post={postWithNewlines} />);
    
    const postBody = document.querySelector('.post-body');
    expect(postBody?.innerHTML).toContain('Line 1');
  });

  it('has correct CSS classes', () => {
    render(<PostContent post={mockBlogPost} />);
    
    const contentDiv = document.querySelector('.post-content');
    expect(contentDiv).toBeInTheDocument();
    
    const summaryDiv = document.querySelector('.post-summary');
    expect(summaryDiv).toBeInTheDocument();
    
    const bodyDiv = document.querySelector('.post-body');
    expect(bodyDiv).toBeInTheDocument();
  });

  it('renders summary in bold', () => {
    render(<PostContent post={mockBlogPost} />);
    
    const summaryElement = screen.getByText('This is a test post summary');
    expect(summaryElement.tagName.toLowerCase()).toBe('strong');
  });
});