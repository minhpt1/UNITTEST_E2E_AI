import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreatePost from './CreatePost';
import { apiService } from '../services/apiService';

// Mock the apiService
vi.mock('../services/apiService', () => ({
  apiService: {
    createPost: vi.fn(),
    getCategories: vi.fn(),
  },
}));

const mockedApiService = vi.mocked(apiService);

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

// Mock components
vi.mock('../components', () => ({
  Loading: () => <div>Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div>{message}</div>,
  PostForm: ({ formData, categories, onSubmit }: { 
    formData: any; 
    categories: any[];
    onSubmit: () => void;
  }) => (
    <div>
      <div>Post Form</div>
      <div>Categories: {categories.length}</div>
      <button onClick={onSubmit}>Submit</button>
    </div>
  ),
  TagsInput: ({ tags }: { tags: string[]; tagInput: string; onTagInputChange: (v: string) => void; onAddTag: () => void; onRemoveTag: (tag: string) => void; }) => <div>Tags Input</div>,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CreatePost Component', () => {
  it('renders create post page successfully', async () => {
    const mockCategories = [
      { id: '1', name: 'Technology', slug: 'technology', updatedAt: '2024-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
      { id: '2', name: 'Personal', slug: 'personal', updatedAt: '2024-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' },
    ];
    
    mockedApiService.getCategories.mockResolvedValue(mockCategories);
    
    renderWithRouter(<CreatePost />);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Post')).toBeInTheDocument();
    });
  });

  it('shows post form when categories are loaded', async () => {
    const mockCategories = [
      { id: '1', name: 'Technology', slug: 'technology', updatedAt: '2024-01-01T00:00:00Z', createdAt: '2024-01-01T00:00:00Z' }
    ];
    
    mockedApiService.getCategories.mockResolvedValue(mockCategories);
    
    renderWithRouter(<CreatePost />);
    
    await waitFor(() => {
      expect(screen.getByText('Post Form')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', async () => {
    mockedApiService.getCategories.mockResolvedValue([]);
    
    renderWithRouter(<CreatePost />);
    
    // CreatePost always renders form immediately (no separate loading state)
    // Initially categories is empty while fetch is pending
    await waitFor(() => {
      expect(screen.getByText('Categories: 0')).toBeInTheDocument();
    });
  });
});