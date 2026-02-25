import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import JsonDatabase from '../../src/database/JsonDatabase';

// Create a simplified version of the server for testing
function createTestApp(): Express {
  const app = express();
  const mockDb = {
    init: vi.fn(),
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    getPosts: vi.fn(),
    getPublishedPosts: vi.fn(),
    getPostById: vi.fn(),
    getPostBySlug: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    getCategories: vi.fn(),
    createCategory: vi.fn(),
    getTags: vi.fn(),
    createTag: vi.fn(),
    getCommentsByPostId: vi.fn(),
    createComment: vi.fn()
  };

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Error handler
  const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };

  // Routes
  app.get('/api/home', async (req, res, next) => {
    try {
      const posts = await mockDb.getPublishedPosts();
      const categories = await mockDb.getCategories();
      const tags = await mockDb.getTags();
      
      res.json({
        latestPosts: posts.slice(0, 5),
        categories,
        tags
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/profile', async (req, res, next) => {
    try {
      const users = await mockDb.getUsers();
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/posts', async (req, res, next) => {
    try {
      const { category, tag, page = '1', limit = '10' } = req.query;
      let posts = await mockDb.getPublishedPosts();
      
      if (category && typeof category === 'string') {
        posts = posts.filter((post: any) => post.category === category);
      }
      
      if (tag && typeof tag === 'string') {
        posts = posts.filter((post: any) => post.tags.includes(tag));
      }
      
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;
      
      const paginatedPosts = posts.slice(startIndex, endIndex);
      
      res.json({
        posts: paginatedPosts,
        totalPosts: posts.length,
        currentPage: pageNum,
        totalPages: Math.ceil(posts.length / limitNum),
        hasNext: endIndex < posts.length,
        hasPrev: pageNum > 1
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/posts/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const post = await mockDb.getPostBySlug(slug);
      
      if (!post || post.status !== 'published') {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const comments = await mockDb.getCommentsByPostId(post.id);
      
      res.json({
        post,
        comments
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/admin/posts', async (req, res, next) => {
    try {
      const { title, content, summary, category, tags = [], status = 'draft', featuredImage } = req.body;
      
      if (!title || !content || !summary) {
        return res.status(400).json({ error: 'Title, content, and summary are required' });
      }
      
      const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      const users = await mockDb.getUsers();
      const author = users[0];
      
      if (!author) {
        return res.status(400).json({ error: 'No author found' });
      }
      
      const post = await mockDb.createPost({
        title,
        content,
        summary,
        slug,
        authorId: author.id,
        category,
        tags,
        status,
        featuredImage
      });
      
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/posts/:slug/comments', async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { authorName, authorEmail, content } = req.body;
      
      if (!authorName || !authorEmail || !content) {
        return res.status(400).json({ error: 'Author name, email, and content are required' });
      }
      
      const post = await mockDb.getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const comment = await mockDb.createComment({
        postId: post.id,
        authorName,
        authorEmail,
        content,
        status: 'pending'
      });
      
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/categories', async (req, res, next) => {
    try {
      const categories = await mockDb.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/tags', async (req, res, next) => {
    try {
      const tags = await mockDb.getTags();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  app.get('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);

  // Expose mockDb for testing
  (app as any).mockDb = mockDb;

  return app;
}

describe('API Routes', () => {
  let app: Express;
  let mockDb: any;

  beforeEach(() => {
    app = createTestApp();
    mockDb = (app as any).mockDb;
    
    // Setup default mock responses
    mockDb.getPublishedPosts.mockResolvedValue([
      {
        id: 'post-1',
        title: 'Test Post',
        slug: 'test-post',
        summary: 'Test summary',
        status: 'published',
        category: 'technology',
        tags: ['test'],
        authorId: 'user-1'
      }
    ]);
    
    mockDb.getCategories.mockResolvedValue([
      { id: 'cat-1', name: 'Technology', slug: 'technology' }
    ]);
    
    mockDb.getTags.mockResolvedValue([
      { id: 'tag-1', name: 'Test', slug: 'test' }
    ]);
    
    mockDb.getUsers.mockResolvedValue([
      { id: 'user-1', name: 'Test User', email: 'test@example.com' }
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/home', () => {
    it('should return homepage data successfully', async () => {
      const response = await request(app)
        .get('/api/home')
        .expect(200);

      expect(response.body).toHaveProperty('latestPosts');
      expect(response.body).toHaveProperty('categories');
      expect(response.body).toHaveProperty('tags');
      expect(mockDb.getPublishedPosts).toHaveBeenCalled();
      expect(mockDb.getCategories).toHaveBeenCalled();
      expect(mockDb.getTags).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockDb.getPublishedPosts.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/api/home')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/profile', () => {
    it('should return user profile successfully', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(mockDb.getUsers).toHaveBeenCalled();
    });

    it('should return 404 when no user found', async () => {
      mockDb.getUsers.mockResolvedValue([]);
      
      const response = await request(app)
        .get('/api/profile')
        .expect(404);

      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('GET /api/posts', () => {
    it('should return paginated posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('totalPosts');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('hasNext');
      expect(response.body).toHaveProperty('hasPrev');
      expect(mockDb.getPublishedPosts).toHaveBeenCalled();
    });

    it('should filter posts by category', async () => {
      const posts = [
        { id: '1', category: 'technology', tags: [] },
        { id: '2', category: 'personal', tags: [] }
      ];
      mockDb.getPublishedPosts.mockResolvedValue(posts);

      const response = await request(app)
        .get('/api/posts?category=technology')
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      expect(response.body.posts[0].category).toBe('technology');
    });

    it('should filter posts by tag', async () => {
      const posts = [
        { id: '1', category: 'technology', tags: ['javascript', 'react'] },
        { id: '2', category: 'technology', tags: ['python'] }
      ];
      mockDb.getPublishedPosts.mockResolvedValue(posts);

      const response = await request(app)
        .get('/api/posts?tag=javascript')
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      expect(response.body.posts[0].tags).toContain('javascript');
    });

    it('should handle pagination parameters', async () => {
      const posts = Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }));
      mockDb.getPublishedPosts.mockResolvedValue(posts);

      const response = await request(app)
        .get('/api/posts?page=2&limit=5')
        .expect(200);

      expect(response.body.currentPage).toBe(2);
      expect(response.body.posts).toHaveLength(5);
      expect(response.body.totalPosts).toBe(15);
      expect(response.body.totalPages).toBe(3);
      expect(response.body.hasNext).toBe(true);
      expect(response.body.hasPrev).toBe(true);
    });
  });

  describe('GET /api/posts/:slug', () => {
    it('should return post with comments', async () => {
      const post = {
        id: 'post-1',
        slug: 'test-post',
        status: 'published',
        title: 'Test Post'
      };
      const comments = [
        { id: 'comment-1', postId: 'post-1', content: 'Great post!' }
      ];
      
      mockDb.getPostBySlug.mockResolvedValue(post);
      mockDb.getCommentsByPostId.mockResolvedValue(comments);

      const response = await request(app)
        .get('/api/posts/test-post')
        .expect(200);

      expect(response.body).toHaveProperty('post');
      expect(response.body).toHaveProperty('comments');
      expect(mockDb.getPostBySlug).toHaveBeenCalledWith('test-post');
      expect(mockDb.getCommentsByPostId).toHaveBeenCalledWith('post-1');
    });

    it('should return 404 for non-existent post', async () => {
      mockDb.getPostBySlug.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/posts/non-existent')
        .expect(404);

      expect(response.body).toEqual({ error: 'Post not found' });
    });

    it('should return 404 for unpublished post', async () => {
      const post = { id: 'post-1', slug: 'draft-post', status: 'draft' };
      mockDb.getPostBySlug.mockResolvedValue(post);

      const response = await request(app)
        .get('/api/posts/draft-post')
        .expect(404);

      expect(response.body).toEqual({ error: 'Post not found' });
    });
  });

  describe('POST /api/admin/posts', () => {
    it('should create new post successfully', async () => {
      const newPost = {
        id: 'new-post-1',
        title: 'New Post',
        content: 'New content',
        summary: 'New summary',
        slug: 'new-post'
      };
      
      mockDb.createPost.mockResolvedValue(newPost);

      const response = await request(app)
        .post('/api/admin/posts')
        .send({
          title: 'New Post',
          content: 'New content',
          summary: 'New summary',
          category: 'technology'
        })
        .expect(201);

      expect(response.body).toEqual(newPost);
      expect(mockDb.createPost).toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/admin/posts')
        .send({
          title: 'New Post'
          // Missing content and summary
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Title, content, and summary are required'
      });
    });

    it('should return 400 when no author found', async () => {
      mockDb.getUsers.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/admin/posts')
        .send({
          title: 'New Post',
          content: 'New content',
          summary: 'New summary'
        })
        .expect(400);

      expect(response.body).toEqual({ error: 'No author found' });
    });

    it('should generate slug from title', async () => {
      const response = await request(app)
        .post('/api/admin/posts')
        .send({
          title: 'This is a Test Post!',
          content: 'Test content',
          summary: 'Test summary'
        })
        .expect(201);

      expect(mockDb.createPost).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'this-is-a-test-post'
        })
      );
    });
  });

  describe('POST /api/posts/:slug/comments', () => {
    it('should create comment successfully', async () => {
      const post = { id: 'post-1', slug: 'test-post' };
      const newComment = {
        id: 'comment-1',
        postId: 'post-1',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great post!'
      };
      
      mockDb.getPostBySlug.mockResolvedValue(post);
      mockDb.createComment.mockResolvedValue(newComment);

      const response = await request(app)
        .post('/api/posts/test-post/comments')
        .send({
          authorName: 'John Doe',
          authorEmail: 'john@example.com',
          content: 'Great post!'
        })
        .expect(201);

      expect(response.body).toEqual(newComment);
      expect(mockDb.createComment).toHaveBeenCalledWith({
        postId: 'post-1',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great post!',
        status: 'pending'
      });
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/posts/test-post/comments')
        .send({
          authorName: 'John Doe'
          // Missing authorEmail and content
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'Author name, email, and content are required'
      });
    });

    it('should return 404 for non-existent post', async () => {
      mockDb.getPostBySlug.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/posts/non-existent/comments')
        .send({
          authorName: 'John Doe',
          authorEmail: 'john@example.com',
          content: 'Great post!'
        })
        .expect(404);

      expect(response.body).toEqual({ error: 'Post not found' });
    });
  });

  describe('GET /api/categories', () => {
    it('should return categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(mockDb.getCategories).toHaveBeenCalled();
    });
  });

  describe('GET /api/tags', () => {
    it('should return tags', async () => {
      const response = await request(app)
        .get('/api/tags')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(mockDb.getTags).toHaveBeenCalled();
    });
  });

  describe('GET /health', () => {
    it('should return health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET * (catch all route)', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toEqual({ error: 'Route not found' });
    });
  });

  describe('Error handling', () => {
    it('should handle internal server errors', async () => {
      mockDb.getPublishedPosts.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/home')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Internal server error');
      expect(response.body).toHaveProperty('message');
    });
  });
});