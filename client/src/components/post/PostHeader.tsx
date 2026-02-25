import React from 'react';
import { BlogPost } from '../../types';
import PostInfoPanel from './PostInfoPanel';

interface PostHeaderProps {
  post: BlogPost;
  onFormatDate?: (date: string) => string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post, onFormatDate }) => {
  const formatDate = onFormatDate || ((dateString: string) => 
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  return (
    <header className="post-header">
      <PostInfoPanel />
      <div className="post-meta">
        <span className="post-category">{post.category}</span>
        <span className="post-date">
          {formatDate(post.publishedAt || post.createdAt)}
        </span>
      </div>
      <h1 className="post-title">{post.title}</h1>
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="featured-image" 
        />
      )}
    </header>
  );
};

export default PostHeader;