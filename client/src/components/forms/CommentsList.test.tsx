import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentsList from './CommentsList';
import { Comment } from '../../types';

const mockComments: Comment[] = [
  {
      id: '1',
      content: 'This is a test comment',
      authorName: 'John Doe',
      authorEmail: 'john@example.com',
      createdAt: '2024-01-15T10:00:00.000Z',
      postId: '',
      updatedAt: ''
  },
  {
      id: '2',
      content: 'Another test comment',
      authorName: 'Jane Smith',
      authorEmail: 'jane@example.com',
      createdAt: '2024-01-15T11:00:00.000Z',
      postId: '',
      updatedAt: ''
  }
];

describe('CommentsList Component', () => {
  const mockFormatDate = (date: string) => new Date(date).toLocaleDateString();

  it('renders list of comments', () => {
    render(<CommentsList comments={mockComments} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('Another test comment')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows message when no comments', () => {
    render(<CommentsList comments={[]} onFormatDate={mockFormatDate} />);
    
    expect(screen.getByText('No comments yet.')).toBeInTheDocument();
  });

  it('formats comment dates correctly', () => {
    render(<CommentsList comments={mockComments} onFormatDate={mockFormatDate} />);
    
    // Check for date formatting (this may vary based on locale)
    const dateElements = document.querySelectorAll('.comment-date');
    expect(dateElements).toHaveLength(2);
    expect(dateElements[0]).toHaveTextContent(new Date('2024-01-15T10:00:00.000Z').toLocaleDateString());
  });

  it('has correct CSS classes', () => {
    render(<CommentsList comments={mockComments} onFormatDate={mockFormatDate} />);
    
    const commentsList = document.querySelector('.comments-list');
    expect(commentsList).toBeInTheDocument();
    
    const commentItems = document.querySelectorAll('.comment');
    expect(commentItems).toHaveLength(2);
    
    const authors = document.querySelectorAll('.comment-author');
    expect(authors).toHaveLength(2);
    
    const dates = document.querySelectorAll('.comment-date');
    expect(dates).toHaveLength(2);
    
    const contents = document.querySelectorAll('.comment-content');
    expect(contents).toHaveLength(2);
  });

  it('renders comments in correct order', () => {
    render(<CommentsList comments={mockComments} onFormatDate={mockFormatDate} />);
    
    const commentItems = document.querySelectorAll('.comment');
    expect(commentItems[0]).toHaveTextContent('This is a test comment');
    expect(commentItems[1]).toHaveTextContent('Another test comment');
  });
});