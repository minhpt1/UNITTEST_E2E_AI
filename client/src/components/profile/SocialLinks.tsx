import React from 'react';
import { User } from '../../types';

interface SocialLinksProps {
  socialLinks: User['socialLinks'];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks }) => {
  if (!socialLinks) return null;

  return (
    <div className="social-links">
      <h3>Connect with me</h3>
      <div className="social-links-grid">
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        )}
        {socialLinks.twitter && (
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link twitter"
          >
            <i className="fab fa-twitter"></i> Twitter
          </a>
        )}
        {socialLinks.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link facebook"
          >
            <i className="fab fa-facebook"></i> Facebook
          </a>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;