import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagsSection from './TagsSection';
import { Tag } from '../../types';

const mockTags: Tag[] = [
  { id: '1', name: 'react', slug: 'react', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { id: '2', name: 'typescript', slug: 'typescript', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { id: '3', name: 'javascript', slug: 'javascript', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { id: '4', name: 'node', slug: 'node', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
  { id: '5', name: 'mongodb', slug: 'mongodb', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }
];

describe('TagsSection Component', () => {
  const defaultProps = {
    tags: mockTags,
    currentTag: null,
    onTagFilter: vi.fn()
  };

  it('renders all tags', () => {
    render(<TagsSection {...defaultProps} />);
    
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#typescript')).toBeInTheDocument();
    expect(screen.getByText('#javascript')).toBeInTheDocument();
    expect(screen.getByText('#node')).toBeInTheDocument();
    expect(screen.getByText('#mongodb')).toBeInTheDocument();
  });

  it('renders tags section with title', () => {
    render(<TagsSection {...defaultProps} />);
    
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('handles tag selection', () => {
    const mockOnTagFilter = vi.fn();
    render(<TagsSection {...defaultProps} onTagFilter={mockOnTagFilter} />);
    
    fireEvent.click(screen.getByText('#react'));
    expect(mockOnTagFilter).toHaveBeenCalledWith('react');
    
    fireEvent.click(screen.getByText('#typescript'));
    expect(mockOnTagFilter).toHaveBeenCalledWith('typescript');
  });

  it('highlights selected tag', () => {
    render(<TagsSection {...defaultProps} currentTag="react" />);
    
    const reactButton = screen.getByText('#react').closest('button');
    expect(reactButton).toHaveClass('active');
  });

  it('shows no active tag when currentTag is null', () => {
    render(<TagsSection {...defaultProps} currentTag={null} />);
    
    const tagButtons = screen.getAllByText(/^#/);
    tagButtons.forEach(button => {
      expect(button).not.toHaveClass('active');
    });
  });

  it('has correct CSS classes', () => {
    render(<TagsSection {...defaultProps} />);
    
    const section = document.querySelector('.filter-section');
    expect(section).toBeInTheDocument();
    
    const tagsFilter = document.querySelector('.tags-filter');
    expect(tagsFilter).toBeInTheDocument();
    
    const tagButtons = document.querySelectorAll('.tag-button');
    expect(tagButtons).toHaveLength(5); // 5 tags only
  });

  it('renders correctly when tags array is empty', () => {
    render(<TagsSection {...defaultProps} tags={[]} />);
    
    expect(screen.getByText('Tags')).toBeInTheDocument();
    
    // No tags should be present
    const tagButtons = document.querySelectorAll('.tag-button');
    expect(tagButtons).toHaveLength(0);
  });

  it('formats tag names with hash prefix', () => {
    render(<TagsSection {...defaultProps} />);
    
    // All tag names should have # prefix in display
    mockTags.forEach(tag => {
      expect(screen.getByText(`#${tag.name}`)).toBeInTheDocument();
    });
  });

  it('passes correct tag value to onTagFilter', () => {
    const mockOnTagFilter = vi.fn();
    render(<TagsSection {...defaultProps} onTagFilter={mockOnTagFilter} />);
    
    // Click on a tag with # prefix display
    fireEvent.click(screen.getByText('#typescript'));
    
    // Should pass the tag name without # prefix
    expect(mockOnTagFilter).toHaveBeenCalledWith('typescript');
  });

  it('renders tags in order', () => {
    render(<TagsSection {...defaultProps} />);
    
    const tagButtons = document.querySelectorAll('.tag-button');
    const tagTexts = Array.from(tagButtons).map(button => button.textContent?.trim());
    
    expect(tagTexts).toEqual(['#react', '#typescript', '#javascript', '#node', '#mongodb']);
  });
});