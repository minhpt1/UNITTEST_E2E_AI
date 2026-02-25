import axios from 'axios';
import {
  User,
  HomeData,
  PostsResponse,
  PostDetail,
  Category,
  Tag,
  CreatePostRequest,
  CreateCommentRequest,
  Comment
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Home
  async getHomeData(): Promise<HomeData> {
    const response = await api.get<HomeData>('/home');
    return response.data;
  },

  // Profile
  async getUserProfile(): Promise<User> {
    const response = await api.get<User>('/profile');
    return response.data;
  },

  // Posts
  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }): Promise<PostsResponse> {
    const response = await api.get<PostsResponse>('/posts', { params });
    return response.data;
  },

  async getPostBySlug(slug: string): Promise<PostDetail> {
    const response = await api.get<PostDetail>(`/posts/${slug}`);
    return response.data;
  },

  async createPost(postData: CreatePostRequest): Promise<any> {
    const response = await api.post('/admin/posts', postData);
    return response.data;
  },

  // Comments
  async addComment(slug: string, commentData: CreateCommentRequest): Promise<Comment> {
    const response = await api.post<Comment>(`/posts/${slug}/comments`, commentData);
    return response.data;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },
};

export default apiService;