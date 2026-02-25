import { describe, it, expect } from 'vitest';
import { User, BlogPost, Category, Tag, Comment, DatabaseSchema } from '../../src/models';

describe('Models', () => {
  describe('User interface', () => {
    it('should have required properties', () => {
      const user: User = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should accept optional properties', () => {
      const user: User = {
        id: 'test-id',
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Test bio',
        avatar: 'avatar.jpg',
        socialLinks: {
          github: 'https://github.com/test',
          linkedin: 'https://linkedin.com/test',
          twitter: 'https://twitter.com/test',
          facebook: 'https://facebook.com/test'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(user.bio).toBeDefined();
      expect(user.avatar).toBeDefined();
      expect(user.socialLinks).toBeDefined();
      expect(user.socialLinks?.github).toBeDefined();
    });
  });

  describe('BlogPost interface', () => {
    it('should have required properties', () => {
      const post: BlogPost = {
        id: 'test-id',
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        slug: 'test-post',
        authorId: 'author-id',
        tags: ['tag1', 'tag2'],
        category: 'technology',
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.content).toBeDefined();
      expect(post.summary).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.authorId).toBeDefined();
      expect(post.tags).toBeDefined();
      expect(post.category).toBeDefined();
      expect(post.status).toBeDefined();
      expect(post.createdAt).toBeDefined();
      expect(post.updatedAt).toBeDefined();
    });

    it('should accept valid status values', () => {
      const draftPost: BlogPost = {
        id: 'test-id',
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        slug: 'test-post',
        authorId: 'author-id',
        tags: [],
        category: 'technology',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const publishedPost: BlogPost = {
        ...draftPost,
        status: 'published',
        publishedAt: new Date()
      };

      const archivedPost: BlogPost = {
        ...draftPost,
        status: 'archived'
      };

      expect(draftPost.status).toBe('draft');
      expect(publishedPost.status).toBe('published');
      expect(archivedPost.status).toBe('archived');
    });

    it('should accept optional properties', () => {
      const post: BlogPost = {
        id: 'test-id',
        title: 'Test Post',
        content: 'Test content',
        summary: 'Test summary',
        slug: 'test-post',
        authorId: 'author-id',
        tags: [],
        category: 'technology',
        status: 'published',
        featuredImage: 'image.jpg',
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(post.featuredImage).toBeDefined();
      expect(post.publishedAt).toBeDefined();
    });
  });

  describe('Category interface', () => {
    it('should have required properties', () => {
      const category: Category = {
        id: 'test-id',
        name: 'Technology',
        slug: 'technology',
        createdAt: new Date()
      };

      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.slug).toBeDefined();
      expect(category.createdAt).toBeDefined();
    });

    it('should accept optional properties', () => {
      const category: Category = {
        id: 'test-id',
        name: 'Technology',
        slug: 'technology',
        description: 'Tech category',
        color: '#blue',
        createdAt: new Date()
      };

      expect(category.description).toBeDefined();
      expect(category.color).toBeDefined();
    });
  });

  describe('Tag interface', () => {
    it('should have required properties', () => {
      const tag: Tag = {
        id: 'test-id',
        name: 'JavaScript',
        slug: 'javascript',
        createdAt: new Date()
      };

      expect(tag.id).toBeDefined();
      expect(tag.name).toBeDefined();
      expect(tag.slug).toBeDefined();
      expect(tag.createdAt).toBeDefined();
    });

    it('should accept optional properties', () => {
      const tag: Tag = {
        id: 'test-id',
        name: 'JavaScript',
        slug: 'javascript',
        description: 'JS related posts',
        createdAt: new Date()
      };

      expect(tag.description).toBeDefined();
    });
  });

  describe('Comment interface', () => {
    it('should have required properties', () => {
      const comment: Comment = {
        id: 'test-id',
        postId: 'post-id',
        authorName: 'John Doe',
        authorEmail: 'john@example.com',
        content: 'Great post!',
        createdAt: new Date()
      };

      expect(comment.id).toBeDefined();
      expect(comment.postId).toBeDefined();
      expect(comment.authorName).toBeDefined();
      expect(comment.authorEmail).toBeDefined();
      expect(comment.content).toBeDefined();
      expect(comment.createdAt).toBeDefined();
    });
  });

  describe('DatabaseSchema interface', () => {
    it('should have all required collections', () => {
      const schema: DatabaseSchema = {
        users: [],
        posts: [],
        categories: [],
        tags: [],
        comments: []
      };

      expect(schema.users).toBeDefined();
      expect(schema.posts).toBeDefined();
      expect(schema.categories).toBeDefined();
      expect(schema.tags).toBeDefined();
      expect(schema.comments).toBeDefined();
      expect(Array.isArray(schema.users)).toBe(true);
      expect(Array.isArray(schema.posts)).toBe(true);
      expect(Array.isArray(schema.categories)).toBe(true);
      expect(Array.isArray(schema.tags)).toBe(true);
      expect(Array.isArray(schema.comments)).toBe(true);
    });
  });
});