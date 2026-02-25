import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Category, Tag } from "../../types";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Tech related posts",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Personal",
    slug: "personal",
    description: "Personal thoughts",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const mockTags: Tag[] = [
  {
    id: "1",
    name: "react",
    slug: "react",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "typescript",
    slug: "typescript",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "javascript",
    slug: "javascript",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("Sidebar Component", () => {
  const defaultProps = {
    categories: mockCategories,
    tags: mockTags,
    currentCategory: null,
    currentTag: null,
    onCategoryFilter: vi.fn(),
    onTagFilter: vi.fn(),
  };

  it("renders both categories and tags sections", () => {
    renderWithRouter(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  it("renders categories section with all categories", () => {
    renderWithRouter(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("renders tags section with all tags", () => {
    renderWithRouter(<Sidebar {...defaultProps} />);

    expect(screen.getByText("#react")).toBeInTheDocument();
    expect(screen.getByText("#typescript")).toBeInTheDocument();
    expect(screen.getByText("#javascript")).toBeInTheDocument();
  });

  it("handles category selection", () => {
    const mockOnCategoryFilter = vi.fn();
    renderWithRouter(
      <Sidebar {...defaultProps} onCategoryFilter={mockOnCategoryFilter} />,
    );

    fireEvent.click(screen.getByText("Technology"));
    expect(mockOnCategoryFilter).toHaveBeenCalledWith("technology");
  });

  it("handles tag selection", () => {
    const mockOnTagFilter = vi.fn();
    renderWithRouter(
      <Sidebar {...defaultProps} onTagFilter={mockOnTagFilter} />,
    );

    fireEvent.click(screen.getByText("#react"));
    expect(mockOnTagFilter).toHaveBeenCalledWith("react");
  });

  it("highlights selected category", () => {
    renderWithRouter(
      <Sidebar {...defaultProps} currentCategory="technology" />,
    );

    const technologyButton = screen.getByText("Technology").closest("button");
    expect(technologyButton).toHaveClass("active");
  });

  it("highlights selected tag", () => {
    renderWithRouter(<Sidebar {...defaultProps} currentTag="react" />);

    const reactButton = screen.getByText("#react").closest("button");
    expect(reactButton).toHaveClass("active");
  });

  it("can have both category and tag selected simultaneously", () => {
    renderWithRouter(
      <Sidebar
        {...defaultProps}
        currentCategory="technology"
        currentTag="react"
      />,
    );

    const technologyButton = screen.getByText("Technology").closest("button");
    const reactButton = screen.getByText("#react").closest("button");

    expect(technologyButton).toHaveClass("active");
    expect(reactButton).toHaveClass("active");
  });

  it("passes correct filter values to child components", () => {
    const mockCategoryFilter = vi.fn();
    const mockTagFilter = vi.fn();

    renderWithRouter(
      <Sidebar
        {...defaultProps}
        currentCategory="personal"
        currentTag="typescript"
        onCategoryFilter={mockCategoryFilter}
        onTagFilter={mockTagFilter}
      />,
    );

    // Verify the selected states are passed correctly
    const personalButton = screen.getByText("Personal").closest("button");
    const typescriptButton = screen.getByText("#typescript").closest("button");

    expect(personalButton).toHaveClass("active");
    expect(typescriptButton).toHaveClass("active");
  });
});
