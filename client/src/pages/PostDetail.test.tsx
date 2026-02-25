import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostDetail from './PostDetail';
import { apiService } from '../services/apiService';

// Mock the apiService
vi.mock('../services/apiService', () => ({
  apiService: {
    getPostBySlug: vi.fn(),
  },
}));

const mockedApiService = vi.mocked(apiService);

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ slug: 'test-post' })),
  };
});

// Mock components
vi.mock('../components', () => ({
  Loading: () => <div>Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div>{message}</div>,
  PostHeader: ({ post }: { post: any }) => <div>Header: {post.title}</div>,
  PostContent: ({ post }: { post: any }) => <div>Content: {post.content}</div>,
  PostFooter: ({ post }: { post: any }) => <div>Footer: {post.tags?.join(', ')}</div>,
  CommentForm: () => <div>Comment Form</div>,
  CommentsList: ({ comments }: { comments: any[] }) => <div>Comments: {comments.length}</div>,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PostDetail Component', () => {
  it('renders post detail page successfully', async () => {
    const mockPostDetail = {
      post: {
        id: '1',
        title: 'Test Post',
        content: 'Test content',
        summary: 'This is a test post summary',
        slug: 'test-post',
        authorId: '1',
        tags: ['react', 'typescript'],
        category: 'Technology',
        status: 'published' as const,
        featuredImage: 'https://example.com/test-image.jpg',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        publishedAt: '2024-01-01T00:00:00Z'
      },
      comments: [
        {
          id: '1',
          postId: '1',
          authorName: 'John Doe',
          authorEmail: 'john@example.com',
          content: 'Test comment',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
    
    mockedApiService.getPostBySlug.mockResolvedValue(mockPostDetail);
    
    renderWithRouter(<PostDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Header: Test Post')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    mockedApiService.getPostBySlug.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<PostDetail />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});