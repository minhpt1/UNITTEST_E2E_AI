import React from 'react';
import { User } from '../../types';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="profile-header">
      {user.avatar && (
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
      )}
      <div className="profile-info">
        <h1>{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        {user.bio && <p className="profile-bio">{user.bio}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;