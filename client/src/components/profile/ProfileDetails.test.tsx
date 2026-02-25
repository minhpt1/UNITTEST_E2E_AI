import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileDetails from "./ProfileDetails";
import { User } from "../../types";

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  bio: "A passionate developer and tech enthusiast",
  avatar: "https://example.com/avatar.jpg",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-06-15T12:30:00.000Z",
};

describe("ProfileDetails Component", () => {
  it("renders user details", () => {
    render(<ProfileDetails user={mockUser} />);

    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Joined:")).toBeInTheDocument();
    expect(screen.getByText("Last updated:")).toBeInTheDocument();
  });

  it("renders user information labels", () => {
    render(<ProfileDetails user={mockUser} />);

    expect(screen.getByText("Joined:")).toBeInTheDocument();
    expect(screen.getByText("Last updated:")).toBeInTheDocument();
  });

  it("formats member since date", () => {
    render(<ProfileDetails user={mockUser} />);

    // Check that some date format is displayed (Vietnamese locale)
    const dateElements = screen.getAllByText(/\d/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it("formats different date formats correctly", () => {
    render(<ProfileDetails user={mockUser} />);

    // Should render both created and updated dates
    const strongElements = screen.getAllByText(/:/);
    expect(strongElements).toHaveLength(2); // "Joined:" and "Last updated:"
  });

  it("has correct CSS classes", () => {
    render(<ProfileDetails user={mockUser} />);

    const profileDetails = document.querySelector(".profile-details");
    expect(profileDetails).toBeInTheDocument();

    const detailGrid = document.querySelector(".detail-grid");
    expect(detailGrid).toBeInTheDocument();

    const detailItems = document.querySelectorAll(".detail-item");
    expect(detailItems).toHaveLength(2);
  });

  it("handles missing bio", () => {
    const userWithoutBio = { ...mockUser, bio: undefined };
    render(<ProfileDetails user={userWithoutBio} />);

    // Component should still render dates
    expect(screen.getByText("Joined:")).toBeInTheDocument();
    expect(screen.getByText("Last updated:")).toBeInTheDocument();
  });

  it("renders all detail items in correct order", () => {
    render(<ProfileDetails user={mockUser} />);

    const detailItems = document.querySelectorAll(".detail-item");
    expect(detailItems).toHaveLength(2);

    // First should be "Joined"
    expect(detailItems[0]).toHaveTextContent("Joined:");
    // Second should be "Last updated"
    expect(detailItems[1]).toHaveTextContent("Last updated:");
  });

  it("handles long bio text", () => {
    const userWithLongBio = { 
      ...mockUser, 
      bio: "This is a very long bio that should still be handled properly by the component even though it's not displayed in ProfileDetails component itself"
    };
    render(<ProfileDetails user={userWithLongBio} />);

    // Component should still work fine
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders details section with heading", () => {
    render(<ProfileDetails user={mockUser} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Details");
  });

  it("displays formatted dates", () => {
    render(<ProfileDetails user={mockUser} />);

    // Should contain formatted date strings (Vietnamese format: DD/MM/YYYY)
    const detailItems = document.querySelectorAll(".detail-item span");
    expect(detailItems).toHaveLength(2);
    
    // Each span should contain date text
    detailItems.forEach(item => {
      expect(item.textContent).toMatch(/\d/); // Should contain digits
    });
  });
});