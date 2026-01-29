import React, { useState, useEffect } from 'react';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Badge as RoleIcon,
  Shield as ShieldIcon,
  Phone as PhoneIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { authAPI } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setProfile(response.data.user);
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading-state glass">Loading profile...</div>;

  return (
    <div className="profile-page cultural-bg">
      <div className="container-narrow">
        <div className="profile-header-card glass fade-in-up">
          <div className="profile-avatar-large">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt={profile.name} />
            ) : (
              <PersonIcon sx={{ fontSize: 80, color: 'white' }} />
            )}
            <button className="edit-avatar-btn"><EditIcon fontSize="small" /></button>
          </div>
          <div className="profile-core-info">
            <h1>{profile?.name}</h1>
            <span className="profile-role-tag">
              <ShieldIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {profile?.role}
            </span>
          </div>
        </div>

        <div className="profile-details-grid fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="details-card-v2 glass">
            <h3>Account Information</h3>
            <div className="info-row">
              <div className="info-label">
                <EmailIcon fontSize="small" /> Email Address
              </div>
              <div className="info-value">{profile?.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <PhoneIcon fontSize="small" /> Phone Number
              </div>
              <div className="info-value">{profile?.phone || 'Not provided'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <LocationIcon fontSize="small" /> Primary Location
              </div>
              <div className="info-value">{profile?.location}</div>
            </div>
          </div>

          <div className="details-card-v2 glass">
            <h3>Professional Identity</h3>
            <div className="info-row">
              <div className="info-label">
                <RoleIcon fontSize="small" /> Designation
              </div>
              <div className="info-value">{profile?.designation || (profile?.role === 'citizen' ? 'Citizen' : 'Government Officer')}</div>
            </div>
            {profile?.institution && (
              <div className="info-row">
                <div className="info-label">
                  <RoleIcon fontSize="small" /> Institution
                </div>
                <div className="info-value">{profile.institution}</div>
              </div>
            )}
            <div className="info-row">
              <div className="info-label">
                <BadgeIcon fontSize="small" /> Account ID
              </div>
              <div className="info-value">{profile?.id ? profile.id.substring(0, 8) : '********'}...</div>
            </div>
          </div>
        </div>

        <div className="profile-actions-bar fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button className="btn-premium btn-primary">Edit Profile</button>
          <button className="btn-premium btn-outline">Security Settings</button>
        </div>
      </div>
    </div>
  );
}

// Minimal BadgeIcon since I didn't import it
function BadgeIcon({ fontSize, style }) {
  return <RoleIcon fontSize={fontSize} style={style} />;
}
