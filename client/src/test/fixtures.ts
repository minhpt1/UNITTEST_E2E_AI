import { User, BlogPost, Category, Tag, Comment, CreatePostRequest } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'A passionate developer',
  role: 'author',
  socialLinks: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

export const mockBlogPost: BlogPost = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  summary: 'This is a test post summary',
  content: 'This is the test post content',
  category: 'Technology',
  tags: ['react', 'typescript'],
  status: 'published',
  featuredImage: 'https://example.com/image.jpg',
  authorId: '1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  publishedAt: '2024-01-01T00:00:00Z',
};

export const mockCategory: Category = {
  id: '1',
  name: 'Technology',
  slug: 'technology',
  description: 'Technology related posts',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

export const mockTag: Tag = {
  id: '1',
  name: 'react',
  slug: 'react',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

export const mockComment: Comment = {
  id: '1',
  postId: '1',
  authorName: 'Jane Doe',
  authorEmail: 'jane@example.com',
  content: 'Great post!',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

export const mockCreatePostRequest: CreatePostRequest = {
  title: 'New Post',
  summary: 'New post summary',
  content: 'New post content',
  category: 'Technology',
  tags: ['react'],
  status: 'draft',
  featuredImage: 'https://example.com/image.jpg',
};