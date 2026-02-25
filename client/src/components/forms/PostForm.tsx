import React from 'react';
import { CreatePostRequest, Category } from '../../types';

interface PostFormProps {
  formData: CreatePostRequest;
  categories: Category[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({
  formData,
  categories,
  onInputChange,
  onSubmit,
  submitting,
  error,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="post-form" noValidate>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder="Enter post title..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="summary">Summary *</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={onInputChange}
          placeholder="Brief summary of the post content..."
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={onInputChange}
          placeholder="Detailed content of the post..."
          rows={10}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={onInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onInputChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="featuredImage">Featured Image (URL)</label>
        <input
          type="url"
          id="featuredImage"
          name="featuredImage"
          value={formData.featuredImage}
          onChange={onInputChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
        >
          {submitting ? 'Creating...' : 'Create Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;