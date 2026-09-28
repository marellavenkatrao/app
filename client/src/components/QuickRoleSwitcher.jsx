import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Building2, Sparkles } from 'lucide-react';

export default function QuickRoleSwitcher() {
  const { user, demoAccounts, demoLogin } = useAuth();

  if (!demoAccounts || demoAccounts.length === 0) return null;

  // Filter key accounts for quick access
  const b2Coord = demoAccounts.find(u => u.role === 'COORDINATOR' && u.name.includes('Tirumalarao'));
  const b3Coord = demoAccounts.find(u => u.role === 'COORDINATOR' && u.name.includes('VenkataRao'));
  const b4Coord = demoAccounts.find(u => u.role === 'COORDINATOR' && u.name.includes('Sunil'));
  const hodCse = demoAccounts.find(u => u.role === 'HOD' && u.email.includes('cse'));
  const hodEce = demoAccounts.find(u => u.role === 'HOD' && u.email.includes('ece'));
  const aoAccount = demoAccounts.find(u => u.role === 'AO');

  const handleSwitch = async (account) => {
    if (!account) return;
    try {
      await demoLogin(account._id);
    } catch (err) {
      console.error('Failed to switch role', err);
    }
  };

  return (
    <div className="quick-switcher-banner no-print">
      <div className="quick-switcher-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#fde047" />
          <span style={{ fontWeight: 700, letterSpacing: '0.3px' }}>1-Click Role Switcher (Live Demo Mode):</span>
        </div>

        <div className="switcher-pills">
          {/* HOD Buttons */}
          {hodCse && (
            <button
              onClick={() => handleSwitch(hodCse)}
              className={`switcher-btn ${user?.email === hodCse.email ? 'active' : ''}`}
              title="Login as HOD Computer Science & Engineering"
            >
              <UserCheck size={13} />
              HOD CSE (Dr. K. Rajesh)
            </button>
          )}

          {hodEce && (
            <button
              onClick={() => handleSwitch(hodEce)}
              className={`switcher-btn ${user?.email === hodEce.email ? 'active' : ''}`}
              title="Login as HOD Electronics & Communication"
            >
              <UserCheck size={13} />
              HOD ECE (Dr. P. Lakshman)
            </button>
          )}

          {/* Coordinators */}
          {b2Coord && (
            <button
              onClick={() => handleSwitch(b2Coord)}
              className={`switcher-btn ${user?.email === b2Coord.email ? 'active' : ''}`}
              title="Coordinator for Block-2 Seminar Hall"
            >
              <Building2 size={13} />
              Block-2 Coord (Dr. S.N Tirumalarao)
            </button>
          )}

          {b3Coord && (
            <button
              onClick={() => handleSwitch(b3Coord)}
              className={`switcher-btn ${user?.email === b3Coord.email ? 'active' : ''}`}
              title="Coordinator for Block-3 Seminar Hall"
            >
              <Building2 size={13} />
              Block-3 Coord (Dr. M.VenkataRao)
            </button>
          )}

          {b4Coord && (
            <button
              onClick={() => handleSwitch(b4Coord)}
              className={`switcher-btn ${user?.email === b4Coord.email ? 'active' : ''}`}
              title="Coordinator for Block-4 Seminar Hall"
            >
              <Building2 size={13} />
              Block-4 Coord (Dr. S.Sunil)
            </button>
          )}

          {/* AO */}
          {aoAccount && (
            <button
              onClick={() => handleSwitch(aoAccount)}
              className={`switcher-btn ${user?.role === 'AO' ? 'active' : ''}`}
              title="Login as Administrative Officer (AO)"
              style={{ borderColor: '#fde047' }}
            >
              <ShieldCheck size={13} color={user?.role === 'AO' ? '#713f12' : '#fde047'} />
              AO Office (Sri K. Srinivasa Rao)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
