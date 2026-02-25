import { vi } from 'vitest';

// Mock data for testing (using string dates to match JSON serialization)
export const mockDatabaseData = {
  users: [
    {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      bio: 'Test bio',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Test Post',
      content: 'Test content',
      summary: 'Test summary',
      slug: 'test-post',
      authorId: 'user-1',
      tags: ['test'],
      category: 'technology',
      status: 'published' as const,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  categories: [
    {
      id: 'cat-1',
      name: 'Technology',
      slug: 'technology',
      description: 'Tech posts',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  tags: [
    {
      id: 'tag-1',
      name: 'Test',
      slug: 'test',
      description: 'Test tag',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ],
  comments: [
    {
      id: 'comment-1',
      postId: 'post-1',
      authorName: 'Commenter',
      authorEmail: 'commenter@example.com',
      content: 'Test comment',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ]
};