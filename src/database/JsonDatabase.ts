import fs from 'fs/promises';
import path from 'path';
import { DatabaseSchema, User, BlogPost, Category, Tag, Comment } from '../models';

class JsonDatabase {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor(dbPath: string = './data/database.json') {
    this.dbPath = path.resolve(dbPath);
    this.data = {
      users: [],
      posts: [],
      categories: [],
      tags: [],
      comments: []
    };
  }

  async init(): Promise<void> {
    try {
      await this.ensureDirectoryExists();
      await this.loadData();
    } catch (error) {
      console.log('Initializing new database...');
      await this.saveData();
    }
  }

  private async ensureDirectoryExists(): Promise<void> {
    const dir = path.dirname(this.dbPath);
    await fs.mkdir(dir, { recursive: true });
  }

  private async loadData(): Promise<void> {
    try {
      const rawData = await fs.readFile(this.dbPath, 'utf-8');
      this.data = JSON.parse(rawData);
    } catch (error) {
      console.log('No existing database found, creating new one');
    }
  }

  private async saveData(): Promise<void> {
    await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.data.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.data.users.find(user => user.id === id);
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.users.push(newUser);
    await this.saveData();
    return newUser;
  }

  // Posts
  async getPosts(): Promise<BlogPost[]> {
    return this.data.posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    return this.data.posts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  async getPostById(id: string): Promise<BlogPost | undefined> {
    return this.data.posts.find(post => post.id === id);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.data.posts.find(post => post.slug === slug);
  }

  async createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: post.status === 'published' ? new Date() : undefined
    };
    this.data.posts.push(newPost);
    await this.saveData();
    return newPost;
  }

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const postIndex = this.data.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return undefined;

    this.data.posts[postIndex] = {
      ...this.data.posts[postIndex],
      ...updates,
      updatedAt: new Date(),
      publishedAt: updates.status === 'published' && !this.data.posts[postIndex].publishedAt 
        ? new Date() 
        : this.data.posts[postIndex].publishedAt
    };
    await this.saveData();
    return this.data.posts[postIndex];
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.data.categories;
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.data.categories.push(newCategory);
    await this.saveData();
    return newCategory;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return this.data.tags;
  }

  async createTag(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag> {
    const newTag: Tag = {
      ...tag,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.data.tags.push(newTag);
    await this.saveData();
    return newTag;
  }

  // Comments
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.data.comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.data.comments.push(newComment);
    await this.saveData();
    return newComment;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default JsonDatabase;