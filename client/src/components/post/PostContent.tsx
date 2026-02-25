import React from 'react';
import { BlogPost } from '../../types';

interface PostContentProps {
  post: BlogPost;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  return (
    <div className="post-content">
      <div className="post-summary">
        <strong>{post.summary}</strong>
      </div>
      <div 
        className="post-body"
        dangerouslySetInnerHTML={{ 
          __html: post.content.replace(/\n/g, '<br/>') 
        }}
      />
    </div>
  );
};

export default PostContent;