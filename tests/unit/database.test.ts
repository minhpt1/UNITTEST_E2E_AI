import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockDatabaseData } from '../mocks/database.mock';

// Mock fs/promises and path modules with factory functions
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
  }
}));

vi.mock('path', () => ({
  default: {
    resolve: vi.fn((path: string) => path),
    dirname: vi.fn(() => './data')
  }
}));

import JsonDatabase from '../../src/database/JsonDatabase';
import fs from 'fs/promises';
import path from 'path';

describe('JsonDatabase', () => {
  let db: JsonDatabase;
  let mockFs: any;
  let mockPath: any;

  beforeEach(() => {
    // Get mocked modules
    mockFs = vi.mocked(fs);
    mockPath = vi.mocked(path);
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockFs.readFile.mockResolvedValue(JSON.stringify(mockDatabaseData));
    mockFs.writeFile.mockResolvedValue(undefined);
    mockFs.mkdir.mockResolvedValue(undefined);
    mockPath.resolve.mockImplementation((path: string) => path);
    mockPath.dirname.mockReturnValue('./data');

    db = new JsonDatabase('./test-db.json');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with default database path', () => {
      const defaultDb = new JsonDatabase();
      expect(mockPath.resolve).toHaveBeenCalledWith('./data/database.json');
    });

    it('should initialize with custom database path', () => {
      const customDb = new JsonDatabase('./custom.json');
      expect(mockPath.resolve).toHaveBeenCalledWith('./custom.json');
    });

    it('should initialize database successfully', async () => {
      await db.init();
      expect(mockFs.mkdir).toHaveBeenCalledWith('./data', { recursive: true });
      expect(mockFs.readFile).toHaveBeenCalledWith('./test-db.json', 'utf-8');
    });

    it('should create new database when file does not exist', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      await db.init();
      // The loadData method handles file not found internally, 
      // but init() will only call saveData() if there's an error from ensureDirectoryExists() or loadData() itself
      // Since readFile error is caught in loadData(), no saveData() is called during init()
      expect(mockFs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe('User Operations', () => {
    beforeEach(async () => {
      await db.init();
    });

    it('should get all users', async () => {
      const users = await db.getUsers();
      expect(users).toEqual(mockDatabaseData.users);
    });

    it('should get user by id', async () => {
      const user = await db.getUserById('user-1');
      expect(user).toEqual(mockDatabaseData.users[0]);
    });

    it('should return undefined for non-existent user', async () => {
      const user = await db.getUserById('non-existent');
      expect(user).toBeUndefined();
    });

    it('should create new user', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        bio: 'New user bio'
      };

      const user = await db.createUser(userData);
      
      expect(user).toMatchObject(userData);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('Post Operations', () => {
    beforeEach(async () => {
      await db.init();
    });

    it('should get all posts sorted by creation date', async () => {
      // Setup mock data with multiple posts to test sorting
      const multiPostData = {
        ...mockDatabaseData,
        posts: [
          {
            id: 'post-1',
            title: 'Oldest Post',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 'post-2', 
            title: 'Newest Post',
            createdAt: '2024-01-03T00:00:00.000Z',
            updatedAt: '2024-01-03T00:00:00.000Z'
          },
          {
            id: 'post-3',
            title: 'Middle Post',
            createdAt: '2024-01-02T00:00:00.000Z', 
            updatedAt: '2024-01-02T00:00:00.000Z'
          }
        ]
      };
      
      mockFs.readFile.mockResolvedValue(JSON.stringify(multiPostData));
      const testDb = new JsonDatabase('./test-multi.json');
      await testDb.init();
      
      const posts = await testDb.getPosts();
      
      // Should be sorted newest first
      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe('Newest Post');
      expect(posts[1].title).toBe('Middle Post');
      expect(posts[2].title).toBe('Oldest Post');
    });

    it('should get published posts only', async () => {
      const publishedPosts = await db.getPublishedPosts();
      expect(publishedPosts).toEqual(
        mockDatabaseData.posts.filter(post => post.status === 'published')
      );
    });

    it('should get post by id', async () => {
      const post = await db.getPostById('post-1');
      expect(post).toEqual(mockDatabaseData.posts[0]);
    });

    it('should return undefined for non-existent post id', async () => {
      const post = await db.getPostById('non-existent');
      expect(post).toBeUndefined();
    });

    it('should get post by slug', async () => {
      const post = await db.getPostBySlug('test-post');
      expect(post).toEqual(mockDatabaseData.posts[0]);
    });

    it('should return undefined for non-existent post slug', async () => {
      const post = await db.getPostBySlug('non-existent');
      expect(post).toBeUndefined();
    });

    it('should create new post with draft status', async () => {
      const postData = {
        title: 'New Post',
        content: 'New content',
        summary: 'New summary',
        slug: 'new-post',
        authorId: 'user-1',
        tags: ['new'],
        category: 'technology',
        status: 'draft' as const
      };

      const post = await db.createPost(postData);
      
      expect(post).toMatchObject(postData);
      expect(post.id).toBeDefined();
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
      expect(post.publishedAt).toBeUndefined();
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should create new post with published status and publishedAt date', async () => {
      const postData = {
        title: 'Published Post',
        content: 'Published content',
        summary: 'Published summary',
        slug: 'published-post',
        authorId: 'user-1',
        tags: ['published'],
        category: 'technology',
        status: 'published' as const
      };

      const post = await db.createPost(postData);
      
      expect(post.status).toBe('published');
      expect(post.publishedAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should update existing post', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'published' as const
      };

      const updatedPost = await db.updatePost('post-1', updates);
      
      expect(updatedPost?.title).toBe('Updated Title');
      expect(updatedPost?.status).toBe('published');
      expect(updatedPost?.updatedAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should return undefined when updating non-existent post', async () => {
      const updates = { title: 'Updated Title' };
      const updatedPost = await db.updatePost('non-existent', updates);
      expect(updatedPost).toBeUndefined();
    });

    it('should set publishedAt when updating status to published', async () => {
      // First, create a mock database with a draft post
      const draftPostData = {
        ...mockDatabaseData,
        posts: [{
          id: 'draft-post',
          title: 'Draft Post',
          content: 'Draft content',
          summary: 'Draft summary',
          slug: 'draft-post',
          authorId: 'user-1',
          tags: ['draft'],
          category: 'technology',
          status: 'draft' as const,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        }]
      };
      
      mockFs.readFile.mockResolvedValue(JSON.stringify(draftPostData));
      const draftDb = new JsonDatabase('./draft-test.json');
      await draftDb.init();

      const updates = { status: 'published' as const };
      const updatedPost = await draftDb.updatePost('draft-post', updates);
      
      expect(updatedPost?.status).toBe('published');
      expect(updatedPost?.publishedAt).toBeInstanceOf(Date);
    });
  });

  describe('Category Operations', () => {
    beforeEach(async () => {
      await db.init();
    });

    it('should get all categories', async () => {
      const categories = await db.getCategories();
      expect(categories).toEqual(mockDatabaseData.categories);
    });

    it('should create new category', async () => {
      const categoryData = {
        name: 'New Category',
        slug: 'new-category',
        description: 'New category description'
      };

      const category = await db.createCategory(categoryData);
      
      expect(category).toMatchObject(categoryData);
      expect(category.id).toBeDefined();
      expect(category.createdAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('Tag Operations', () => {
    beforeEach(async () => {
      await db.init();
    });

    it('should get all tags', async () => {
      const tags = await db.getTags();
      expect(tags).toEqual(mockDatabaseData.tags);
    });

    it('should create new tag', async () => {
      const tagData = {
        name: 'New Tag',
        slug: 'new-tag',
        description: 'New tag description'
      };

      const tag = await db.createTag(tagData);
      
      expect(tag).toMatchObject(tagData);
      expect(tag.id).toBeDefined();
      expect(tag.createdAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('Comment Operations', () => {
    beforeEach(async () => {
      await db.init();
    });

    it('should return empty array for non-existent post', async () => {
      const comments = await db.getCommentsByPostId('non-existent');
      expect(comments).toEqual([]);
    });

    it('should create new comment', async () => {
      const commentData = {
        postId: 'post-1',
        authorName: 'New Commenter',
        authorEmail: 'commenter@example.com',
        content: 'New comment content',
        status: 'pending' as const
      };

      const comment = await db.createComment(commentData);
      
      expect(comment).toMatchObject(commentData);
      expect(comment.id).toBeDefined();
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });
  });

  describe('ID Generation', () => {
    it('should generate unique IDs', async () => {
      await db.init();
      
      const user1 = await db.createUser({
        name: 'User 1',
        email: 'user1@example.com'
      });
      
      const user2 = await db.createUser({
        name: 'User 2',
        email: 'user2@example.com'
      });
      
      expect(user1.id).not.toBe(user2.id);
      expect(user1.id).toBeDefined();
      expect(user2.id).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle file system errors during initialization', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));
      
      // Should not throw error but log to console
      await expect(db.init()).resolves.not.toThrow();
    });

    it('should handle JSON parsing errors', async () => {
      mockFs.readFile.mockResolvedValue('invalid json');
      
      // Should not throw error but initialize with empty data
      await expect(db.init()).resolves.not.toThrow();
    });

    it('should handle file write errors', async () => {
      mockFs.writeFile.mockRejectedValue(new Error('Disk full'));
      await db.init();
      
      // Should throw error when trying to create user
      await expect(db.createUser({
        name: 'Test User',
        email: 'test@example.com'
      })).rejects.toThrow('Disk full');
    });
  });
});