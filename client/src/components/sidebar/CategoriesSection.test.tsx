import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoriesSection from "./CategoriesSection";
import { Category } from "../../types";

const mockCategories: Category[] = [
  { id: "1", name: "Technology", slug: "technology", description: "Tech posts", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  { id: "2", name: "Personal", slug: "personal", description: "Personal posts", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
  { id: "3", name: "Tutorial", slug: "tutorial", description: "Tutorial posts", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
];

describe("CategoriesSection Component", () => {
  const defaultProps = {
    categories: mockCategories,
    currentCategory: null,
    onCategoryFilter: vi.fn()
  };

  it("renders all categories", () => {
    render(<CategoriesSection {...defaultProps} />);

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Tutorial")).toBeInTheDocument();
  });

  it('renders "All Categories" option', () => {
    render(<CategoriesSection {...defaultProps} />);

    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("handles category selection", () => {
    const mockOnCategoryFilter = vi.fn();
    render(<CategoriesSection {...defaultProps} onCategoryFilter={mockOnCategoryFilter} />);

    fireEvent.click(screen.getByText("Technology"));
    expect(mockOnCategoryFilter).toHaveBeenCalledWith("technology");

    fireEvent.click(screen.getByText("All"));
    expect(mockOnCategoryFilter).toHaveBeenCalledWith("");
  });

  it("highlights selected category", () => {
    render(<CategoriesSection {...defaultProps} currentCategory="technology" />);

    const techButton = screen.getByText("Technology");
    expect(techButton).toHaveClass("active");
  });

  it('highlights "All Categories" when no category selected', () => {
    render(<CategoriesSection {...defaultProps} currentCategory={null} />);

    const allButton = screen.getByText("All");
    expect(allButton).toHaveClass("active");
  });

  it("has correct CSS classes", () => {
    render(<CategoriesSection {...defaultProps} />);

    const section = document.querySelector(".filter-section");
    expect(section).toBeInTheDocument();

    const filterList = document.querySelector(".filter-list");
    expect(filterList).toBeInTheDocument();

    const listItems = document.querySelectorAll("li");
    expect(listItems).toHaveLength(4); // 3 categories + "All"
  });

  it("renders correctly when categories array is empty", () => {
    render(<CategoriesSection {...defaultProps} categories={[]} />);

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();

    // Only "All" should be present
    const listItems = document.querySelectorAll("li");
    expect(listItems).toHaveLength(1);
  });

  it("shows category names as button text", () => {
    render(<CategoriesSection {...defaultProps} />);

    // All category names should be present as button text
    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});