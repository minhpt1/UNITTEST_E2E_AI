import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import JsonDatabase from './database/JsonDatabase';

const app = express();
const PORT = process.env.PORT || 3002;
const db = new JsonDatabase();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

// Routes

// Home page - Get latest published posts
app.get('/api/home', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await db.getPublishedPosts();
    const categories = await db.getCategories();
    const tags = await db.getTags();
    
    res.json({
      latestPosts: posts.slice(0, 5),
      categories,
      tags
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile (personal page)
app.get('/api/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.getUsers();
    const user = users[0]; // Assuming single user blog
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Blog posts
app.get('/api/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, tag, page = '1', limit = '10' } = req.query;
    let posts = await db.getPublishedPosts();

    console.log('Fetched posts:', posts);
    
    // Filter by category
    if (category && typeof category === 'string') {
      posts = posts.filter(post => post.category === category);
    }
    
    // Filter by tag
    if (tag && typeof tag === 'string') {
      posts = posts.filter(post => post.tags.includes(tag));
    }
    
    // Pagination
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

// Get single post by slug
app.get('/api/posts/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const post = await db.getPostBySlug(slug);
    
    if (!post || post.status !== 'published') {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comments = await db.getCommentsByPostId(post.id);
    
    res.json({
      post,
      comments
    });
  } catch (error) {
    next(error);
  }
});

// Create new post (admin endpoint)
app.post('/api/admin/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, summary, category, tags = [], status = 'draft', featuredImage } = req.body;
    
    if (!title || !content || !summary) {
      return res.status(400).json({ error: 'Title, content, and summary are required' });
    }
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const users = await db.getUsers();
    const author = users[0];
    
    if (!author) {
      return res.status(400).json({ error: 'No author found' });
    }
    
    const post = await db.createPost({
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

// Add comment to post
app.post('/api/posts/:slug/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { authorName, authorEmail, content } = req.body;
    
    if (!authorName || !authorEmail || !content) {
      return res.status(400).json({ error: 'Author name, email, and content are required' });
    }
    
    const post = await db.getPostBySlug(slug);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = await db.createComment({
      postId: post.id,
      authorName,
      authorEmail,
      content,
    });
    
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// Get categories
app.get('/api/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get tags
app.get('/api/tags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await db.getTags();
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all route
app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await db.init();
    console.log('Database initialized');
    
    // Create default user if none exists
    const users = await db.getUsers();
    if (users.length === 0) {
      await db.createUser({
        name: 'Your Name',
        email: 'your.email@example.com',
        bio: 'Welcome to my personal blog! I write about technology, life, and everything in between.',
        socialLinks: {
          github: 'https://github.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourusername'
        }
      });
      console.log('Default user created');
    }
    
    // Create default categories if none exist
    const categories = await db.getCategories();
    if (categories.length === 0) {
      await db.createCategory({
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about programming, web development, and tech trends'
      });
      await db.createCategory({
        name: 'Personal',
        slug: 'personal',
        description: 'Personal thoughts and experiences'
      });
      console.log('Default categories created');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();