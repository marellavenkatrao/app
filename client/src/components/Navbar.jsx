import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NecLogo from '../assets/NecLogo';
import CredentialsModal from './CredentialsModal';
import { LogOut, KeyRound, User, Calendar, Coffee, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [showCreds, setShowCreds] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* College Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <NecLogo />
        </div>

        {/* Right action items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCreds(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <KeyRound size={15} color="#701a75" />
            <span>All Credentials</span>
          </button>

          {user && (
            <div className="user-profile-badge">
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#701a75', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user.name.charAt(0)}
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.1 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {user.department || user.designation}
                </div>
              </div>

              <span className={`role-tag ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
          )}

          {user && (
            <button 
              onClick={logout} 
              className="btn btn-secondary btn-sm"
              title="Sign Out"
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      <CredentialsModal isOpen={showCreds} onClose={() => setShowCreds(false)} />
    </nav>
  );
}
