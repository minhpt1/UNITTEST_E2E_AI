import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostList from './PostList';
import { mockBlogPost } from '../../test/fixtures';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PostList Component', () => {
  it('renders list of posts', () => {
    const posts = [
      mockBlogPost,
      { ...mockBlogPost, id: '2', title: 'Second Post', slug: 'second-post' }
    ];
    
    renderWithRouter(<PostList posts={posts} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('renders empty list', () => {
    renderWithRouter(<PostList posts={[]} />);
    
    const postsList = screen.getByRole('main');
    expect(postsList).toBeInTheDocument();
    expect(postsList.children).toHaveLength(0);
  });

  it('renders single post', () => {
    renderWithRouter(<PostList posts={[mockBlogPost]} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('has correct CSS class', () => {
    renderWithRouter(<PostList posts={[mockBlogPost]} />);
    
    const postsList = screen.getByRole('main');
    expect(postsList).toHaveClass('posts-list');
  });

  it('renders posts with correct structure', () => {
    renderWithRouter(<PostList posts={[mockBlogPost]} />);
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass('post-item');
  });
});