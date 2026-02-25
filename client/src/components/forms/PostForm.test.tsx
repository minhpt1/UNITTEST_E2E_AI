import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostForm from './PostForm';

const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Tech posts', createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' },
  { id: '2', name: 'Personal', slug: 'personal', description: 'Personal posts', createdAt: '2023-01-01T00:00:00.000Z', updatedAt: '2023-01-01T00:00:00.000Z' }
];

describe('PostForm Component', () => {
  const defaultProps = {
    formData: {
      title: '',
      content: '',
      summary: '',
      category: '',
      tags: [],
      status: 'draft' as 'draft' | 'published',
      featuredImage: ''
    },
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    submitting: false,
    error: null,
    categories: mockCategories
  };

  it('renders all form fields', () => {
    render(<PostForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter post title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Detailed content of the post...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Brief summary of the post content...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com/image.jpg')).toBeInTheDocument();
    expect(screen.getByText('Select category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockSubmit = vi.fn();
    const formData = {
      title: 'Test Post Title',
      content: 'This is test content',
      summary: 'Test summary',
      category: 'Technology',
      tags: [],
      status: 'draft' as 'draft' | 'published',
      featuredImage: ''
    };
    
    render(<PostForm {...defaultProps} formData={formData} onSubmit={mockSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Create Post' }));
    
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('handles input changes', () => {
    const mockInputChange = vi.fn();
    render(<PostForm {...defaultProps} onInputChange={mockInputChange} />);
    
    const titleInput = screen.getByPlaceholderText('Enter post title...');
    
    fireEvent.change(titleInput, {
      target: { value: 'My Awesome Blog Post!' }
    });
    
    expect(mockInputChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: 'title'
      })
    }));
  });

  it('handles category selection', () => {
    const mockInputChange = vi.fn();
    render(<PostForm {...defaultProps} onInputChange={mockInputChange} />);
    
    const categorySelect = screen.getByLabelText('Category *');
    fireEvent.change(categorySelect, { target: { value: 'Technology' } });
    
    expect(mockInputChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: 'category'
      })
    }));
  });

  it('disables submit button when loading', () => {
    render(<PostForm {...defaultProps} submitting={true} />);
    
    const submitButton = screen.getByRole('button', { name: 'Creating...' });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Creating...');
  });

  it('shows error message when provided', () => {
    const errorMessage = 'Something went wrong';
    render(<PostForm {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveClass('error-message');
  });

  it('pre-fills form when editing post', () => {
    const existingPostFormData = {
      title: 'Existing Post',
      content: 'Existing content',
      summary: 'Existing summary',
      category: 'Personal',
      tags: ['react', 'typescript'],
      status: 'published' as 'draft' | 'published',
      featuredImage: 'https://example.com/image.jpg'
    };
    
    render(<PostForm {...defaultProps} formData={existingPostFormData} />);
    
    expect(screen.getByDisplayValue('Existing Post')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing content')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing summary')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Personal')).toBeInTheDocument();
    // Check that status select has the right value by getting the select element
    const statusSelect = screen.getByLabelText('Status');
    expect(statusSelect).toHaveValue('published');
    expect(screen.getByDisplayValue('https://example.com/image.jpg')).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<PostForm {...defaultProps} />);
    
    const form = document.querySelector('form');
    expect(form).toHaveClass('post-form');
    
    const formGroups = document.querySelectorAll('.form-group');
    expect(formGroups.length).toBeGreaterThan(0);
    
    const buttons = document.querySelectorAll('.btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0]).toHaveClass('btn-secondary');
    expect(buttons[1]).toHaveClass('btn-primary');
  });
});