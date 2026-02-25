import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { apiService } from '../services/apiService';

// Mock the apiService
vi.mock('../services/apiService', () => ({
  apiService: {
    getHomeData: vi.fn(),
  },
}));

const mockedApiService = vi.mocked(apiService);

// Mock components
vi.mock('../components', () => ({
  Loading: () => <div>Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div>{message}</div>,
  PostList: ({ posts }: { posts: any[] }) => <div>{posts.map(p => <div key={p.id}>{p.title}</div>)}</div>,
  Sidebar: () => <div>Sidebar</div>,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  it('renders home page successfully', async () => {
    const mockHomeData = {
      latestPosts: [
        {
          id: '1',
          title: 'Latest Post 1',
          content: 'This is the content for latest post 1',
          summary: 'Summary for latest post 1',
          slug: 'latest-post-1',
          authorId: '1',
          tags: ['react', 'typescript'],
          category: 'Technology',
          status: 'published' as const,
          featuredImage: 'https://example.com/image1.jpg',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
          publishedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          title: 'Latest Post 2',
          content: 'This is the content for latest post 2',
          summary: 'Summary for latest post 2',
          slug: 'latest-post-2',
          authorId: '1',
          tags: ['javascript', 'web'],
          category: 'Development',
          status: 'published' as const,
          featuredImage: 'https://example.com/image2.jpg',
          createdAt: '2024-01-03T00:00:00Z',
          updatedAt: '2024-01-04T00:00:00Z',
          publishedAt: '2024-01-03T00:00:00Z'
        }
      ],
      categories: [
        {
          id: '1',
          name: 'Technology',
          slug: 'technology',
          description: 'Technology related posts',
          color: '#007ACC',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Development',
          slug: 'development',
          description: 'Development tutorials',
          color: '#FF6B35',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      tags: [
        {
          id: '1',
          name: 'React',
          slug: 'react',
          description: 'React framework posts',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'TypeScript',
          slug: 'typescript',
          description: 'TypeScript related content',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]
    };
    
    mockedApiService.getHomeData.mockResolvedValue(mockHomeData);
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome to My Blog')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    mockedApiService.getHomeData.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    mockedApiService.getHomeData.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<Home />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Unable to load/)).toBeInTheDocument();
    });
  });
});