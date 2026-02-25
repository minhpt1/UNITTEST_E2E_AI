import React from 'react';
import { CreateCommentRequest } from '../../types';
import { Button } from '../common';

interface CommentFormProps {
  formData: CreateCommentRequest;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  className?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  loading = false,
  className = 'comment-form'
}) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      <h3>Leave a Comment</h3>
      <div className="form-group">
        <label htmlFor="authorName">Name *</label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          value={formData.authorName}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="authorEmail">Email *</label>
        <input
          type="email"
          id="authorEmail"
          name="authorEmail"
          value={formData.authorEmail}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Comment *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={onInputChange}
          rows={4}
          required
        />
      </div>
      <Button type="submit" loading={loading}>
        Submit Comment
      </Button>
    </form>
  );
};

export default CommentForm;