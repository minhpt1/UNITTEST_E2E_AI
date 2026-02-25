import { vi } from "vitest";

export const mockApiService = {
  getHome: vi.fn(),
  getPosts: vi.fn(),
  getPostBySlug: vi.fn(),
  getUserProfile: vi.fn(),
  getCategories: vi.fn(),
  getTags: vi.fn(),
  createPost: vi.fn(),
  addComment: vi.fn(),
};

// Mock modules
vi.mock('../services/apiService', () => ({
  apiService: mockApiService,
}));

vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ slug: 'test-slug' }),
    useSearchParams: () => [
      new URLSearchParams(),
      vi.fn()
    ],
    Link: ({ children }: any) => children,
  };
});

export const mockNavigate = vi.fn();
export const mockSetSearchParams = vi.fn();