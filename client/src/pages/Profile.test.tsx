import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import { apiService } from '../services/apiService';

// Mock the apiService
vi.mock('../services/apiService', () => ({
  apiService: {
    getUserProfile: vi.fn(),
  },
}));

const mockedApiService = vi.mocked(apiService);

// Mock React Router hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({ id: '1' })),
  };
});

// Mock components
vi.mock('../components', () => ({
  Loading: () => <div>Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div>{message}</div>,
  ProfileCard: ({ user }: { user: any }) => <div>Profile: {user.name}</div>,
  ProfileDetails: ({ user }: { user: any }) => <div>Details: {user.email}</div>,
  SocialLinks: ({ socialLinks }: { socialLinks: any }) => <div>Social Links</div>,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Profile Component', () => {
  it('renders profile page successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Test bio',
      role: 'author' as const,
      avatar: 'https://example.com/avatar.jpg',
      socialLinks: {
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        twitter: 'https://twitter.com/johndoe',
        facebook: 'https://facebook.com/johndoe'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    };
    
    mockedApiService.getUserProfile.mockResolvedValue(mockUser);
    
    renderWithRouter(<Profile />);
    
    await waitFor(() => {
      expect(screen.getByText('Profile: John Doe')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    mockedApiService.getUserProfile.mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter(<Profile />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});