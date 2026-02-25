import React from 'react';
import PostCard from './PostCard';
import { BlogPost } from '../../types';

interface PostListProps {
  posts: BlogPost[];
  onFormatDate?: (date: string) => string;
  className?: string;
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  onFormatDate, 
  className = 'posts-list' 
}) => {
  return (
    <main className={className}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onFormatDate={onFormatDate} />
      ))}
    </main>
  );
};

export default PostList;