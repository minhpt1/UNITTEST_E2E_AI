import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TagsInput from "./TagsInput";

describe("TagsInput Component", () => {
  const defaultProps = {
    tags: ["react", "typescript"],
    tagInput: "",
    onTagInputChange: vi.fn(),
    onAddTag: vi.fn(),
    onRemoveTag: vi.fn(),
  };

  it("renders existing tags", () => {
    render(<TagsInput {...defaultProps} />);

    expect(screen.getByText("#react")).toBeInTheDocument();
    expect(screen.getByText("#typescript")).toBeInTheDocument();
  });

  it("adds new tag on Enter key", () => {
    const mockOnAddTag = vi.fn();
    const mockOnTagInputChange = vi.fn();
    render(
      <TagsInput
        {...defaultProps}
        tagInput="javascript"
        onAddTag={mockOnAddTag}
        onTagInputChange={mockOnTagInputChange}
      />,
    );

    const input = screen.getByPlaceholderText("Enter tag and press Enter");
    fireEvent.change(input, { target: { value: "javascript" } });
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    expect(mockOnAddTag).toHaveBeenCalled();
  });

  it("removes tag when clicking remove button", () => {
    const mockOnRemoveTag = vi.fn();
    render(<TagsInput {...defaultProps} onRemoveTag={mockOnRemoveTag} />);

    const removeButtons = screen.getAllByText("×");
    fireEvent.click(removeButtons[0]);

    expect(mockOnRemoveTag).toHaveBeenCalledWith("react");
  });

  it("renders input with current value", () => {
    render(<TagsInput {...defaultProps} tagInput="javascript" />);

    const input = screen.getByPlaceholderText(
      "Enter tag and press Enter",
    ) as HTMLInputElement;
    expect(input.value).toBe("javascript");
  });

  it("handles empty tags array", () => {
    render(<TagsInput {...{ ...defaultProps, tags: [] }} />);
    expect(
      screen.getByPlaceholderText("Enter tag and press Enter"),
    ).toBeInTheDocument();
  });
});
