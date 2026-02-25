import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { CreatePostRequest, Category } from '../types';
import { PostForm, TagsInput } from '../components';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await apiService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.summary || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const postData = {
        ...formData,
        tags: formData.tags || []
      };
      
      await apiService.createPost(postData);
      alert('Post created successfully!');
      navigate('/blog');
    } catch (err) {
      setError('An error occurred while creating the post');
      console.error('Error creating post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  return (
    <div className="create-post">
      <div className="create-post-container">
        <h1>Create New Post</h1>
        
        <PostForm
          formData={formData}
          categories={categories}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          onCancel={handleCancel}
        />

        <TagsInput
          tags={formData.tags || []}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
    </div>
  );
};

export default CreatePost;