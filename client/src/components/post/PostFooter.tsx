import React from 'react';
import { BlogPost } from '../../types';

interface PostFooterProps {
  post: BlogPost;
}

const PostFooter: React.FC<PostFooterProps> = ({ post }) => {
  return (
    <footer className="post-footer">
      <div className="post-tags">
        {post.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
    </footer>
  );
};

export default PostFooter;