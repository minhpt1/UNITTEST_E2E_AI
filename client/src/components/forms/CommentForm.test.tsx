import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentForm from "./CommentForm";

describe("CommentForm Component", () => {
  const defaultProps = {
    formData: {
      authorName: "",
      authorEmail: "",
      content: "",
    },
    onInputChange: vi.fn(),
    onSubmit: vi.fn(),
    loading: false,
  };

  it("renders form elements", () => {
    render(<CommentForm {...defaultProps} />);

    expect(screen.getByText("Leave a Comment")).toBeInTheDocument();
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Comment *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit comment/i })).toBeInTheDocument();
  });

  it("handles form submission", () => {
    const mockSubmit = vi.fn();
    render(<CommentForm {...defaultProps} onSubmit={mockSubmit} />);

    const form = document.querySelector("form");
    fireEvent.submit(form!);
    expect(mockSubmit).toHaveBeenCalled();
  });

  it("disables submit button when loading", () => {
    render(<CommentForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeDisabled();
  });

  it("has correct CSS classes", () => {
    render(<CommentForm {...defaultProps} />);

    const form = document.querySelector(".comment-form");
    expect(form).toBeInTheDocument();

    const formGroups = document.querySelectorAll(".form-group");
    expect(formGroups.length).toBeGreaterThan(0);
  });

  it("handles input changes", () => {
    const mockInputChange = vi.fn();
    render(<CommentForm {...defaultProps} onInputChange={mockInputChange} />);

    const nameInput = screen.getByLabelText("Name *");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(mockInputChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: "authorName"
      })
    }));
  });
});