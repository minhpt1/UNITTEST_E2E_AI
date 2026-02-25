import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { apiService } from "./apiService";

// Mock axios
vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

// Get the mocked axios instance (cast as any to avoid strict AxiosResponse type checking)
const mockAxiosInstance = axios.create({}) as any;

describe("apiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── getHomeData ───────────────────────────────────────────────────────────
  describe("getHomeData", () => {
    it("calls GET /home and returns data", async () => {
      const mockData = {
        latestPosts: [
          {
            id: "1",
            title: "Post 1",
            content: "Content",
            summary: "Summary",
            slug: "post-1",
            authorId: "1",
            tags: ["react"],
            category: "Tech",
            status: "published" as const,
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ],
        categories: [],
        tags: [],
      };

      vi.mocked(mockAxiosInstance.get).mockResolvedValue({ data: mockData });

      const result = await apiService.getHomeData();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/home");
      expect(result).toEqual(mockData);
    });

    it("throws error when request fails", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Network Error"),
      );

      await expect(apiService.getHomeData()).rejects.toThrow("Network Error");
    });
  });

  // ─── getUserProfile ────────────────────────────────────────────────────────
  describe("getUserProfile", () => {
    it("calls GET /profile and returns user data", async () => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        bio: "A developer",
        role: "author" as const,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      vi.mocked(mockAxiosInstance.get).mockResolvedValue({ data: mockUser });

      const result = await apiService.getUserProfile();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/profile");
      expect(result).toEqual(mockUser);
    });

    it("throws error when request fails", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Unauthorized"),
      );

      await expect(apiService.getUserProfile()).rejects.toThrow("Unauthorized");
    });
  });

  // ─── getPosts ──────────────────────────────────────────────────────────────
  describe("getPosts", () => {
    const mockPostsResponse = {
      posts: [
        {
          id: "1",
          title: "Test Post",
          content: "Content",
          summary: "Summary",
          slug: "test-post",
          authorId: "1",
          tags: ["js"],
          category: "Tech",
          status: "published" as const,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ],
      totalPosts: 1,
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    };

    it("calls GET /posts without params", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostsResponse,
      });

      const result = await apiService.getPosts();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts", {
        params: undefined,
      });
      expect(result).toEqual(mockPostsResponse);
    });

    it("calls GET /posts with pagination params", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostsResponse,
      });

      await apiService.getPosts({ page: 2, limit: 5 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts", {
        params: { page: 2, limit: 5 },
      });
    });

    it("calls GET /posts with category filter", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostsResponse,
      });

      await apiService.getPosts({ category: "technology" });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts", {
        params: { category: "technology" },
      });
    });

    it("calls GET /posts with tag filter", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostsResponse,
      });

      await apiService.getPosts({ tag: "react" });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts", {
        params: { tag: "react" },
      });
    });

    it("calls GET /posts with multiple params", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostsResponse,
      });

      await apiService.getPosts({
        page: 1,
        limit: 10,
        category: "tech",
        tag: "react",
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts", {
        params: { page: 1, limit: 10, category: "tech", tag: "react" },
      });
    });

    it("throws error when request fails", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Server Error"),
      );

      await expect(apiService.getPosts()).rejects.toThrow("Server Error");
    });
  });

  // ─── getPostBySlug ─────────────────────────────────────────────────────────
  describe("getPostBySlug", () => {
    const mockPostDetail = {
      post: {
        id: "1",
        title: "Test Post",
        content: "Content",
        summary: "Summary",
        slug: "test-post",
        authorId: "1",
        tags: ["react"],
        category: "Tech",
        status: "published" as const,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      comments: [],
    };

    it("calls GET /posts/:slug with correct slug", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostDetail,
      });

      const result = await apiService.getPostBySlug("test-post");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/posts/test-post");
      expect(result).toEqual(mockPostDetail);
    });

    it("calls GET /posts/:slug with different slug", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockPostDetail,
      });

      await apiService.getPostBySlug("my-first-blog-post");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/posts/my-first-blog-post",
      );
    });

    it("throws error when post not found", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Not Found"),
      );

      await expect(apiService.getPostBySlug("nonexistent")).rejects.toThrow(
        "Not Found",
      );
    });
  });

  // ─── createPost ────────────────────────────────────────────────────────────
  describe("createPost", () => {
    const mockPostData = {
      title: "New Post",
      content: "Post content",
      summary: "Post summary",
      category: "Technology",
      tags: ["react", "typescript"],
      status: "draft" as const,
    };

    it("calls POST /admin/posts with post data", async () => {
      const mockResponse = { id: "1", ...mockPostData };
      vi.mocked(mockAxiosInstance.post).mockResolvedValue({
        data: mockResponse,
      });

      const result = await apiService.createPost(mockPostData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/admin/posts",
        mockPostData,
      );
      expect(result).toEqual(mockResponse);
    });

    it("calls POST /admin/posts without optional fields", async () => {
      const minimalData = {
        title: "Minimal Post",
        content: "Content",
        summary: "Summary",
        category: "Tech",
      };
      const mockResponse = { id: "2", ...minimalData };
      vi.mocked(mockAxiosInstance.post).mockResolvedValue({
        data: mockResponse,
      });

      await apiService.createPost(minimalData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/admin/posts",
        minimalData,
      );
    });

    it("throws error when creation fails", async () => {
      vi.mocked(mockAxiosInstance.post).mockRejectedValue(
        new Error("Forbidden"),
      );

      await expect(apiService.createPost(mockPostData)).rejects.toThrow(
        "Forbidden",
      );
    });
  });

  // ─── addComment ────────────────────────────────────────────────────────────
  describe("addComment", () => {
    const mockCommentData = {
      authorName: "Jane Doe",
      authorEmail: "jane@example.com",
      content: "Great post!",
    };

    const mockComment = {
      id: "1",
      postId: "1",
      ...mockCommentData,
      status: "pending" as const,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    it("calls POST /posts/:slug/comments with correct slug and data", async () => {
      vi.mocked(mockAxiosInstance.post).mockResolvedValue({
        data: mockComment,
      });

      const result = await apiService.addComment("my-post", mockCommentData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/posts/my-post/comments",
        mockCommentData,
      );
      expect(result).toEqual(mockComment);
    });

    it("calls POST /posts/:slug/comments with different slug", async () => {
      vi.mocked(mockAxiosInstance.post).mockResolvedValue({
        data: mockComment,
      });

      await apiService.addComment("another-post", mockCommentData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/posts/another-post/comments",
        mockCommentData,
      );
    });

    it("throws error when comment submission fails", async () => {
      vi.mocked(mockAxiosInstance.post).mockRejectedValue(
        new Error("Bad Request"),
      );

      await expect(
        apiService.addComment("my-post", mockCommentData),
      ).rejects.toThrow("Bad Request");
    });
  });

  // ─── getCategories ─────────────────────────────────────────────────────────
  describe("getCategories", () => {
    it("calls GET /categories and returns list", async () => {
      const mockCategories = [
        {
          id: "1",
          name: "Technology",
          slug: "technology",
          description: "Tech posts",
          color: "#007ACC",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Personal",
          slug: "personal",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      vi.mocked(mockAxiosInstance.get).mockResolvedValue({
        data: mockCategories,
      });

      const result = await apiService.getCategories();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/categories");
      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(2);
    });

    it("returns empty array when no categories exist", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({ data: [] });

      const result = await apiService.getCategories();

      expect(result).toEqual([]);
    });

    it("throws error when request fails", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Server Error"),
      );

      await expect(apiService.getCategories()).rejects.toThrow("Server Error");
    });
  });

  // ─── getTags ───────────────────────────────────────────────────────────────
  describe("getTags", () => {
    it("calls GET /tags and returns list", async () => {
      const mockTags = [
        {
          id: "1",
          name: "React",
          slug: "react",
          description: "React framework",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "TypeScript",
          slug: "typescript",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      vi.mocked(mockAxiosInstance.get).mockResolvedValue({ data: mockTags });

      const result = await apiService.getTags();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/tags");
      expect(result).toEqual(mockTags);
      expect(result).toHaveLength(2);
    });

    it("returns empty array when no tags exist", async () => {
      vi.mocked(mockAxiosInstance.get).mockResolvedValue({ data: [] });

      const result = await apiService.getTags();

      expect(result).toEqual([]);
    });

    it("throws error when request fails", async () => {
      vi.mocked(mockAxiosInstance.get).mockRejectedValue(
        new Error("Server Error"),
      );

      await expect(apiService.getTags()).rejects.toThrow("Server Error");
    });
  });
});
