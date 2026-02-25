import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialLinks from "./SocialLinks";

const mockSocialLinks = {
  twitter: "https://twitter.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  facebook: "https://facebook.com/johndoe"
};

describe("SocialLinks Component", () => {
  it("renders all provided social links", () => {
    render(<SocialLinks socialLinks={mockSocialLinks} />);

    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
  });

  it("has correct href attributes", () => {
    render(<SocialLinks socialLinks={mockSocialLinks} />);

    expect(screen.getByRole('link', { name: /twitter/i })).toHaveAttribute('href', 'https://twitter.com/johndoe');
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/johndoe');
    expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute('href', 'https://facebook.com/johndoe');
  });

  it("opens links in new tab", () => {
    render(<SocialLinks socialLinks={mockSocialLinks} />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it("renders only provided social links", () => {
    const limitedSocialLinks = {
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe"
    };
    
    render(<SocialLinks socialLinks={limitedSocialLinks} />);

    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /facebook/i })).not.toBeInTheDocument();
  });

  it("renders nothing when no social links provided", () => {
    const { container } = render(<SocialLinks socialLinks={{}} />);

    // Component still renders the wrapper but with no links
    expect(screen.getByText("Connect with me")).toBeInTheDocument();
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  it("has correct CSS classes", () => {
    render(<SocialLinks socialLinks={mockSocialLinks} />);

    const socialLinksContainer = document.querySelector('.social-links');
    expect(socialLinksContainer).toBeInTheDocument();

    const socialLinksGrid = document.querySelector('.social-links-grid');
    expect(socialLinksGrid).toBeInTheDocument();

    const socialLinks = document.querySelectorAll('.social-link');
    expect(socialLinks).toHaveLength(4);
  });

  it("renders correct icons for each platform", () => {
    render(<SocialLinks socialLinks={mockSocialLinks} />);

    const twitterIcon = document.querySelector('.fab.fa-twitter');
    const linkedinIcon = document.querySelector('.fab.fa-linkedin');
    const githubIcon = document.querySelector('.fab.fa-github');
    const facebookIcon = document.querySelector('.fab.fa-facebook');

    expect(twitterIcon).toBeInTheDocument();
    expect(linkedinIcon).toBeInTheDocument();
    expect(githubIcon).toBeInTheDocument();
    expect(facebookIcon).toBeInTheDocument();
  });

  it("handles undefined socialLinks prop", () => {
    const { container } = render(<SocialLinks socialLinks={undefined as any} />);

    expect(container.firstChild).toBeNull();
  });

  it("filters out empty string values", () => {
    const socialLinksWithEmpty = {
      twitter: "",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "",
      facebook: "https://facebook.com/johndoe"
    };
    
    render(<SocialLinks socialLinks={socialLinksWithEmpty} />);

    expect(screen.queryByRole('link', { name: /twitter/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
  });
});