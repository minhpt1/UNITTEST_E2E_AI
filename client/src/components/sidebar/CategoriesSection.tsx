import React from 'react';
import { Category } from '../../types';

interface CategoriesSectionProps {
  categories: Category[];
  currentCategory?: string | null;
  onCategoryFilter?: (categorySlug: string) => void;
  title?: string;
  className?: string;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  currentCategory,
  onCategoryFilter,
  title = 'Categories',
  className = 'filter-section'
}) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <ul className="filter-list">
        <li>
          <button
            onClick={() => onCategoryFilter && onCategoryFilter('')}
            className={!currentCategory ? 'active' : ''}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryFilter && onCategoryFilter(category.slug)}
              className={currentCategory === category.slug ? 'active' : ''}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesSection;