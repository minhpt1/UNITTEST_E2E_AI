import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';

interface PostCardProps {
  post: BlogPost;
  onFormatDate?: (date: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onFormatDate }) => {
  const formatDate = onFormatDate || ((dateString: string) => 
    new Date(dateString).toLocaleDateString('vi-VN')
  );

  return (
    <article className="post-item">
      {post.featuredImage && (
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="post-thumbnail" 
        />
      )}
      <div className="post-info">
        <div className="post-meta">
          <span className="post-category">{post.category}</span>
          <span className="post-date">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        <h2>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="post-excerpt">{post.summary}</p>
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
        <Link to={`/posts/${post.slug}`} className="read-more">
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;