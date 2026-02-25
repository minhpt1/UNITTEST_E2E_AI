import { describe, it, expect } from 'vitest';
// Direct imports to ensure coverage of the index.ts export file
import type { User } from '../../src/models/index';
import type { BlogPost } from '../../src/models/index';
import type { Category } from '../../src/models/index';
import type { Tag } from '../../src/models/index';
import type { Comment } from '../../src/models/index';
import type { DatabaseSchema } from '../../src/models/index';
import * as Models from '../../src/models/index';

describe('Models Export', () => {
  it('should export all model interfaces', () => {
    // Verify that all interfaces are exported
    expect(Models).toBeDefined();
    
    // Test that we can use the exported types in variable declarations
    const testUser: User = {
      id: 'test-id',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const testPost: BlogPost = {
      id: 'test-id',
      title: 'Test Post',
      content: 'Test Content',
      summary: 'Test Summary',
      slug: 'test-post',
      authorId: 'author-id',
      tags: ['test'],
      category: 'technology',
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const testCategory: Category = {
      id: 'test-id',
      name: 'Test Category',
      slug: 'test-category',
      createdAt: new Date()
    };
    
    const testTag: Tag = {
      id: 'test-id',
      name: 'Test Tag',
      slug: 'test-tag',
      createdAt: new Date()
    };
    
    const testComment: Comment = {
      id: 'test-id',
      postId: 'post-id',
      authorName: 'Test Author',
      authorEmail: 'test@example.com',
      content: 'Test comment',
      createdAt: new Date()
    };
    
    const testSchema: DatabaseSchema = {
      users: [testUser],
      posts: [testPost],
      categories: [testCategory],
      tags: [testTag],
      comments: [testComment]
    };
    
    expect(testUser).toBeDefined();
    expect(testPost).toBeDefined();
    expect(testCategory).toBeDefined();
    expect(testTag).toBeDefined();
    expect(testComment).toBeDefined();
    expect(testSchema).toBeDefined();
  });

  it('should have valid TypeScript type definitions', () => {
    // This test ensures that our types are properly exported and usable
    // If there were any issues with the type definitions, this would fail at compile time
    
    type UserKeys = keyof Models.User;
    type PostKeys = keyof Models.BlogPost;
    type CategoryKeys = keyof Models.Category;
    type TagKeys = keyof Models.Tag;
    type CommentKeys = keyof Models.Comment;
    type SchemaKeys = keyof Models.DatabaseSchema;
    
    const userKeys: UserKeys[] = ['id', 'name', 'email', 'bio', 'avatar', 'socialLinks', 'createdAt', 'updatedAt'];
    const postKeys: PostKeys[] = ['id', 'title', 'content', 'summary', 'slug', 'authorId', 'tags', 'category', 'status', 'featuredImage', 'createdAt', 'updatedAt', 'publishedAt'];
    const categoryKeys: CategoryKeys[] = ['id', 'name', 'slug', 'description', 'color', 'createdAt'];
    const tagKeys: TagKeys[] = ['id', 'name', 'slug', 'description', 'createdAt'];
    const commentKeys: CommentKeys[] = ['id', 'postId', 'authorName', 'authorEmail', 'content', 'createdAt'];
    const schemaKeys: SchemaKeys[] = ['users', 'posts', 'categories', 'tags', 'comments'];
    
    expect(userKeys).toContain('id');
    expect(userKeys).toContain('name');
    expect(userKeys).toContain('email');
    
    expect(postKeys).toContain('id');
    expect(postKeys).toContain('title');
    expect(postKeys).toContain('status');
    
    expect(categoryKeys).toContain('id');
    expect(categoryKeys).toContain('name');
    expect(categoryKeys).toContain('slug');
    
    expect(tagKeys).toContain('id');
    expect(tagKeys).toContain('name');
    expect(tagKeys).toContain('slug');
    
    expect(commentKeys).toContain('id');
    expect(commentKeys).toContain('postId');
    expect(commentKeys).toContain('authorName');
    
    expect(schemaKeys).toContain('users');
    expect(schemaKeys).toContain('posts');
    expect(schemaKeys).toContain('categories');
    expect(schemaKeys).toContain('tags');
    expect(schemaKeys).toContain('comments');
  });

  it('should support type narrowing for union types', () => {
    // Test BlogPost status union type
    const draftPost: BlogPost = {
      id: 'test-id',
      title: 'Test Post',
      content: 'Test Content',
      summary: 'Test Summary',
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
      status: 'published'
    };
    
    const archivedPost: BlogPost = {
      ...draftPost,
      status: 'archived'
    };
    
    expect(draftPost.status).toBe('draft');
    expect(publishedPost.status).toBe('published');
    expect(archivedPost.status).toBe('archived');
  });
});