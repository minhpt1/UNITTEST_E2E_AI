import React from 'react';
import { Comment } from '../../types';

interface CommentsListProps {
  comments: Comment[];
  onFormatDate: (date: string) => string;
  className?: string;
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onFormatDate,
  className = 'comments-list'
}) => {
  return (
    <div className={className}>
      <h3>Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <strong className="comment-author">{comment.authorName}</strong>
              <span className="comment-date">
                {onFormatDate(comment.createdAt)}
              </span>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentsList;