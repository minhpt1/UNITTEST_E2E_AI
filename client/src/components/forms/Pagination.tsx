import React from 'react';
import { Button } from '../common';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  className = 'pagination'
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // Show 5 pages at most
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={className}>
      <Button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        variant="secondary"
        size="small"
      >
        Previous
      </Button>
      
      {generatePageNumbers().map(page => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? 'primary' : 'secondary'}
          size="small"
        >
          {page}
        </Button>
      ))}
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        variant="secondary"
        size="small"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;