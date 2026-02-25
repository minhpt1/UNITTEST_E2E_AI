import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

describe('Utility Functions', () => {
  describe('Date Utilities', () => {
    let mockDate: Date;

    beforeAll(() => {
      mockDate = new Date('2024-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it('should create Date objects consistently', () => {
      const date1 = new Date();
      const date2 = new Date();
      
      expect(date1.getTime()).toBe(date2.getTime());
      expect(date1.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should handle date comparisons', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-02');
      
      expect(date1.getTime()).toBeLessThan(date2.getTime());
      expect(date2.getTime()).toBeGreaterThan(date1.getTime());
    });
  });

  describe('String Utilities', () => {
    it('should generate slugs from titles correctly', () => {
      const testCases = [
        {
          input: 'This is a Test Post!',
          expected: 'this-is-a-test-post'
        },
        {
          input: 'JavaScript & TypeScript Tips',
          expected: 'javascript-typescript-tips'
        },
        {
          input: 'Hello World  Multiple   Spaces',
          expected: 'hello-world-multiple-spaces'
        },
        {
          input: 'Special Characters: @#$%^&*()',
          expected: 'special-characters-'
        },
        {
          input: '  Leading and Trailing Spaces  ',
          expected: '-leading-and-trailing-spaces-'
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const slug = input.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        expect(slug).toBe(expected);
      });
    });

    it('should handle empty and edge case strings', () => {
      const edgeCases = [
        { input: '', expected: '' },
        { input: '   ', expected: '-' },
        { input: '123', expected: '123' },
        { input: 'a', expected: 'a' },
        { input: 'A', expected: 'a' }
      ];

      edgeCases.forEach(({ input, expected }) => {
        const slug = input.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        expect(slug).toBe(expected);
      });
    });
  });

  describe('Array Utilities', () => {
    it('should sort arrays correctly', () => {
      const posts = [
        { createdAt: new Date('2024-01-03'), title: 'Post 3' },
        { createdAt: new Date('2024-01-01'), title: 'Post 1' },
        { createdAt: new Date('2024-01-02'), title: 'Post 2' }
      ];

      const sorted = posts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      expect(sorted[0].title).toBe('Post 3');
      expect(sorted[1].title).toBe('Post 2');
      expect(sorted[2].title).toBe('Post 1');
    });

    it('should filter arrays correctly', () => {
      const posts = [
        { status: 'published', title: 'Published 1' },
        { status: 'draft', title: 'Draft 1' },
        { status: 'published', title: 'Published 2' },
        { status: 'archived', title: 'Archived 1' }
      ];

      const publishedPosts = posts.filter(post => post.status === 'published');
      expect(publishedPosts).toHaveLength(2);
      expect(publishedPosts[0].title).toBe('Published 1');
      expect(publishedPosts[1].title).toBe('Published 2');
    });

    it('should slice arrays for pagination', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const page = 2;
      const limit = 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedItems = items.slice(startIndex, endIndex);
      
      expect(paginatedItems).toHaveLength(10);
      expect(paginatedItems[0].id).toBe(11);
      expect(paginatedItems[9].id).toBe(20);
    });
  });

  describe('Object Utilities', () => {
    it('should merge objects correctly', () => {
      const original = {
        id: '1',
        title: 'Original Title',
        content: 'Original Content',
        createdAt: new Date('2024-01-01')
      };

      const updates = {
        title: 'Updated Title',
        updatedAt: new Date('2024-01-02')
      };

      const merged = { ...original, ...updates };

      expect(merged.id).toBe('1');
      expect(merged.title).toBe('Updated Title');
      expect(merged.content).toBe('Original Content');
      expect(merged.createdAt).toEqual(new Date('2024-01-01'));
      expect(merged.updatedAt).toEqual(new Date('2024-01-02'));
    });

    it('should handle omit operations', () => {
      type OriginalType = {
        id: string;
        name: string;
        email: string;
        password: string;
      };

      type PublicType = Omit<OriginalType, 'password'>;

      const original: OriginalType = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123'
      };

      // Simulate omitting password field
      const { password, ...publicUser } = original;
      const result: PublicType = publicUser;

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('Validation Utilities', () => {
    it('should validate email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@example.org'
      ];

      const invalidEmails = [
        'invalid.email',
        '@example.com',
        'test@',
        'test@example',
        ''
      ];

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate required fields', () => {
      const validatePost = (data: any) => {
        const requiredFields = ['title', 'content', 'summary'];
        const missing = requiredFields.filter(field => !data[field]);
        return missing.length === 0 ? null : missing;
      };

      const validPost = {
        title: 'Test Post',
        content: 'Test Content',
        summary: 'Test Summary',
        optional: 'optional field'
      };

      const invalidPost = {
        title: 'Test Post',
        summary: 'Test Summary'
        // Missing content
      };

      expect(validatePost(validPost)).toBeNull();
      expect(validatePost(invalidPost)).toEqual(['content']);
    });
  });

  describe('ID Generation', () => {
    it('should generate unique IDs', () => {
      const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const ids = new Set();
      const count = 1000;
      
      for (let i = 0; i < count; i++) {
        const id = generateId();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
      
      expect(ids.size).toBe(count);
    });

    it('should generate IDs with consistent format', () => {
      const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(10);
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('HTTP Status Codes', () => {
    it('should handle different status scenarios', () => {
      const statusCodes = {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
      };

      expect(statusCodes.OK).toBe(200);
      expect(statusCodes.CREATED).toBe(201);
      expect(statusCodes.BAD_REQUEST).toBe(400);
      expect(statusCodes.NOT_FOUND).toBe(404);
      expect(statusCodes.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('Environment Variables', () => {
    it('should handle environment variable defaults', () => {
      const getPort = () => process.env.PORT || 3002;
      const getNodeEnv = () => process.env.NODE_ENV || 'development';
      
      // Test default values
      delete process.env.PORT;
      delete process.env.NODE_ENV;
      
      expect(getPort()).toBe(3002);
      expect(getNodeEnv()).toBe('development');
      
      // Test with set values
      process.env.PORT = '8080';
      process.env.NODE_ENV = 'production';
      
      expect(getPort()).toBe('8080');
      expect(getNodeEnv()).toBe('production');
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize and deserialize data correctly', () => {
      const data = {
        id: '1',
        name: 'Test',
        date: new Date('2024-01-01'),
        nested: {
          value: 42,
          list: [1, 2, 3]
        }
      };

      const serialized = JSON.stringify(data);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.id).toBe(data.id);
      expect(deserialized.name).toBe(data.name);
      expect(deserialized.nested.value).toBe(data.nested.value);
      expect(deserialized.nested.list).toEqual(data.nested.list);
      
      // Note: Date objects become strings in JSON
      expect(deserialized.date).toBe(data.date.toISOString());
    });

    it('should handle JSON parsing errors', () => {
      const invalidJson = '{"invalid": json}';
      
      expect(() => {
        JSON.parse(invalidJson);
      }).toThrow();
      
      // Safe JSON parsing
      const safeJsonParse = (str: string) => {
        try {
          return JSON.parse(str);
        } catch {
          return null;
        }
      };
      
      expect(safeJsonParse(invalidJson)).toBeNull();
      expect(safeJsonParse('{"valid": "json"}')).toEqual({ valid: 'json' });
    });
  });
});