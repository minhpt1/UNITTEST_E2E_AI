import React from 'react';
import CategoriesSection from './CategoriesSection';
import TagsSection from './TagsSection';
import { Category, Tag } from '../../types';

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  currentCategory?: string | null;
  currentTag?: string | null;
  onCategoryFilter?: (categorySlug: string) => void;
  onTagFilter?: (tagSlug: string) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  tags, 
  currentCategory,
  currentTag,
  onCategoryFilter,
  onTagFilter,
  className = 'blog-sidebar' 
}) => {
  return (
    <aside className={className}>
      <CategoriesSection 
        categories={categories}
        currentCategory={currentCategory}
        onCategoryFilter={onCategoryFilter}
      />
      <TagsSection 
        tags={tags}
        currentTag={currentTag}
        onTagFilter={onTagFilter}
      />
    </aside>
  );
};

export default Sidebar;