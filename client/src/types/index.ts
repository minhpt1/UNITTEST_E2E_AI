export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  role?: 'admin' | 'editor' | 'subscriber' | 'author';
  avatar?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeData {
  latestPosts: BlogPost[];
  categories: Category[];
  tags: Tag[];
}

export interface PostsResponse {
  posts: BlogPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostDetail {
  post: BlogPost;
  comments: Comment[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published';
  featuredImage?: string;
}

export interface CreateCommentRequest {
  authorName: string;
  authorEmail: string;
  content: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  icon: string;
}

export interface GoldPrice {
  price: number;
  currency: string;
  unit: string;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface PricePoint {
  time: string;
  price: number;
}