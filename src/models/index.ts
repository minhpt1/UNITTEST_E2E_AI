export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  authorId: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: Date;
}

export interface DatabaseSchema {
  users: User[];
  posts: BlogPost[];
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
}