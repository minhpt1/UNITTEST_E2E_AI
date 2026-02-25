import React from 'react';
import { Tag } from '../../types';

interface TagsSectionProps {
  tags: Tag[];
  currentTag?: string | null;
  onTagFilter?: (tagSlug: string) => void;
  title?: string;
  className?: string;
}

const TagsSection: React.FC<TagsSectionProps> = ({ 
  tags, 
  currentTag,
  onTagFilter,
  title = 'Tags',
  className = 'filter-section'
}) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <div className="tags-filter">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagFilter && onTagFilter(tag.slug)}
            className={`tag-button ${
              currentTag === tag.slug ? 'active' : ''
            }`}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;