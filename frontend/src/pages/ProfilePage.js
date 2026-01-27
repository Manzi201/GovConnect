import React from 'react';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        {user && (
          <div className="profile-info">
            <div className="profile-field">
              <label>Name</label>
              <p>{user.name}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="profile-field">
              <label>Role</label>
              <p className="role-badge">{user.role}</p>
            </div>
            <div className="profile-field">
              <label>Location</label>
              <p>{user.location}</p>
            </div>
            <div className="info-box">
              <p>👤 Your profile information is displayed here. Contact support to make changes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
