import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User } from '../types';
import { 
  Loading, 
  ErrorMessage, 
  ProfileCard, 
  SocialLinks, 
  ProfileDetails 
} from '../components';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await apiService.getUserProfile();
        setUser(userData);
      } catch (err) {
        setError('Unable to load user information');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="profile">
      <div className="profile-container">
        <ProfileCard user={user} />
        <SocialLinks socialLinks={user.socialLinks} />
        <ProfileDetails user={user} />

        <div className="about-section">
          <h3>About Me</h3>
          <p>
            Welcome to my personal blog! This is where I share my thoughts,
            experiences and knowledge about technology, programming and life.
          </p>
          <p>
            I'm passionate about technology and always exploring new trends in the industry.
            Hope my posts can bring value to you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;