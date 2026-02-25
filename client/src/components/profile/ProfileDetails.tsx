import React from 'react';
import { User } from '../../types';

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="profile-details">
      <h3>Details</h3>
      <div className="detail-grid">
        <div className="detail-item">
          <strong>Joined:</strong>
          <span>{formatDate(user.createdAt)}</span>
        </div>
        <div className="detail-item">
          <strong>Last updated:</strong>
          <span>{formatDate(user.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;