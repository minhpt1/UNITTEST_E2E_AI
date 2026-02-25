import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Blog from "./Blog";
import { apiService } from "../services/apiService";

// Mock the apiService
vi.mock("../services/apiService", () => ({
  apiService: {
    getPosts: vi.fn(),
    getCategories: vi.fn(),
    getTags: vi.fn(),
  },
}));

// Mock React Router hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
  };
});

// Mock components
vi.mock("../components", () => ({
  Loading: () => <div>Loading...</div>,
  ErrorMessage: ({ message }: { message: string }) => <div>{message}</div>,
  PostList: ({ posts }: { posts: any[] }) => (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  ),
  Sidebar: () => <div>Sidebar</div>,
  Pagination: () => <div>Pagination</div>,
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockedApiService = vi.mocked(apiService);

describe("Blog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to prevent error output in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it("shows loading state initially", () => {
    mockedApiService.getPosts.mockImplementation(() => new Promise(() => {}));
    mockedApiService.getCategories.mockImplementation(
      () => new Promise(() => {}),
    );
    mockedApiService.getTags.mockImplementation(() => new Promise(() => {}));

    renderWithRouter(<Blog />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state on fetch failure", async () => {
    mockedApiService.getPosts.mockRejectedValue(new Error("API Error"));
    mockedApiService.getCategories.mockResolvedValue([]);
    mockedApiService.getTags.mockResolvedValue([]);

    renderWithRouter(<Blog />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load blog data")).toBeInTheDocument();
    });
  });

  it("renders blog content after successful fetch", async () => {
    const mockResponse = {
      posts: [
        {
          id: "1",
          title: "Test Post",
          content: "This is test content",
          summary: "Test summary",
          slug: "test-post",
          authorId: "1",
          tags: ["react", "typescript"],
          category: "Technology",
          status: "published" as const,
          featuredImage: "https://example.com/image.jpg",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
          publishedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          title: "Second Post",
          content: "This is second post content",
          summary: "Second post summary",
          slug: "second-post",
          authorId: "1",
          tags: ["javascript", "web"],
          category: "Development",
          status: "published" as const,
          featuredImage: "https://example.com/image2.jpg",
          createdAt: "2024-01-03T00:00:00Z",
          updatedAt: "2024-01-04T00:00:00Z",
          publishedAt: "2024-01-03T00:00:00Z",
        },
      ],
      totalPosts: 2,
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    mockedApiService.getPosts.mockResolvedValue(mockResponse);
    mockedApiService.getCategories.mockResolvedValue([]);
    mockedApiService.getTags.mockResolvedValue([]);

    renderWithRouter(<Blog />);

    await waitFor(() => {
      expect(screen.getByText("Golb")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("renders no posts message when no posts found", async () => {
    const emptyResponse = {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
      currentPage: 1,
      hasNext: false,
      hasPrev: false,
    };

    mockedApiService.getPosts.mockResolvedValue(emptyResponse);
    mockedApiService.getCategories.mockResolvedValue([]);
    mockedApiService.getTags.mockResolvedValue([]);

    renderWithRouter(<Blog />);

    await waitFor(() => {
      expect(screen.getByText("No posts found.")).toBeInTheDocument();
    });
  });

  it("renders sidebar component", async () => {
    const mockResponse = {
      posts: [
        {
          id: "1",
          title: "Test Post",
          content: "Test content",
          summary: "Test summary",
          slug: "test-post",
          authorId: "1",
          tags: ["react"],
          category: "Technology",
          status: "published" as const,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          publishedAt: "2024-01-01T00:00:00Z",
        },
      ],
      totalPosts: 1,
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    mockedApiService.getPosts.mockResolvedValue(mockResponse);
    mockedApiService.getCategories.mockResolvedValue([]);
    mockedApiService.getTags.mockResolvedValue([]);

    renderWithRouter(<Blog />);

    await waitFor(() => {
      expect(screen.getByText("Sidebar")).toBeInTheDocument();
    });
  });
});
