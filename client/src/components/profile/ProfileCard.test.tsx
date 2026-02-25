import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileCard from "./ProfileCard";
import { User } from "../../types";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  bio: "A passionate developer and tech enthusiast",
  avatar: "https://example.com/avatar.jpg",
  socialLinks: {
    twitter: "https://twitter.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("ProfileCard Component", () => {
  it("renders user information", () => {
    render(<ProfileCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("A passionate developer and tech enthusiast"),
    ).toBeInTheDocument();
  });

  it("renders user avatar", () => {
    render(<ProfileCard user={mockUser} />);

    const avatar = screen.getByAltText("John Doe") as HTMLImageElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toBe("https://example.com/avatar.jpg");
  });

  it("does not render avatar when no avatar provided", () => {
    const userWithoutAvatar = { ...mockUser, avatar: undefined };
    render(<ProfileCard user={userWithoutAvatar} />);

    const avatar = screen.queryByAltText("John Doe");
    expect(avatar).not.toBeInTheDocument();
  });

  it("renders basic profile structure", () => {
    render(<ProfileCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("A passionate developer and tech enthusiast")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe")).toBeInTheDocument();
  });

  it("displays user email correctly", () => {
    render(<ProfileCard user={mockUser} />);

    const email = screen.getByText("john@example.com");
    expect(email).toHaveClass("profile-email");
  });

  it("has correct CSS classes", () => {
    render(<ProfileCard user={mockUser} />);

    const profileHeader = document.querySelector(".profile-header");
    expect(profileHeader).toBeInTheDocument();

    const avatar = document.querySelector(".profile-avatar");
    expect(avatar).toBeInTheDocument();

    const info = document.querySelector(".profile-info");
    expect(info).toBeInTheDocument();

    const email = document.querySelector(".profile-email");
    expect(email).toBeInTheDocument();

    const bio = document.querySelector(".profile-bio");
    expect(bio).toBeInTheDocument();
  });

  it("handles empty social links gracefully", () => {
    const userWithoutSocial = { ...mockUser, socialLinks: {} };
    render(<ProfileCard user={userWithoutSocial} />);

    // Component still renders basic info even without social links
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("handles missing bio", () => {
    const userWithoutBio = { ...mockUser, bio: undefined };
    render(<ProfileCard user={userWithoutBio} />);

    const bio = screen.queryByText("A passionate developer and tech enthusiast");
    expect(bio).not.toBeInTheDocument();
    
    // Should still render name and email
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders name as heading", () => {
    render(<ProfileCard user={mockUser} />);

    const nameHeading = screen.getByRole("heading", { level: 1 });
    expect(nameHeading).toHaveTextContent("John Doe");
  });
});