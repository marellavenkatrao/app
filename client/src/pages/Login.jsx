import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NecLogo from '../assets/NecLogo';
import { Lock, Mail, ArrowRight, Shield, User, Building2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, demoLogin, demoAccounts } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userAccount) => {
    if (!userAccount) return;
    setError('');
    setLoading(true);
    try {
      await demoLogin(userAccount._id);
    } catch (err) {
      setError('Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const hodAccounts = demoAccounts.filter(a => a.role === 'HOD');
  const coordAccounts = demoAccounts.filter(a => a.role === 'COORDINATOR');
  const aoAccount = demoAccounts.find(a => a.role === 'AO');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* College Header */}
      <div style={{ background: '#ffffff', borderBottom: '2px solid #701a75', padding: '16px 24px', display: 'flex', justifyContent: 'center' }}>
        <NecLogo />
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 16px' }}>
        <div style={{ maxWidth: '980px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Email/Password Login Form */}
          <div className="nec-card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#701a75', background: '#fae8ff', padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase' }}>
                Secure Portal Authentication
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
                Faculty & Staff Sign In
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
                Access Seminar Hall reservations and AO hospitality requisitions.
              </p>
            </div>

            {error && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Official College Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. hod.cse@nec.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Account Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter password (default: nec@123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '8px' }}
                disabled={loading}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b' }}>
              <strong>Default Access:</strong> Password for all pre-seeded college accounts is <code>nec@123</code>.
            </div>
          </div>

          {/* Quick 1-Click Demo Login Panel */}
          <div className="nec-card" style={{ padding: '28px', background: '#ffffff' }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#701a75" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  1-Click Fast Evaluation
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Click any role to test its dedicated permissions and workflows instantly:
              </p>
            </div>

            {/* Coordinators */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#701a75', textTransform: 'uppercase', marginBottom: '6px' }}>
                Seminar Hall Coordinators
              </div>
              <div style={{ display: 'grid', gap: '6px' }}>
                {coordAccounts.map((coord) => (
                  <button
                    key={coord._id}
                    onClick={() => handleQuickLogin(coord)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', padding: '8px 12px' }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{coord.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {coord.name.includes('Tirumalarao') ? 'Block-2 Hall Coord' :
                         coord.name.includes('VenkataRao') ? 'Block-3 Hall Coord' : 'Block-4 Hall Coord'}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#fae8ff', color: '#701a75', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      Login
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Department HODs */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', marginBottom: '6px' }}>
                Department HODs
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {hodAccounts.slice(0, 4).map((hod) => (
                  <button
                    key={hod._id}
                    onClick={() => handleQuickLogin(hod)}
                    className="btn btn-secondary btn-sm"
                    style={{ textAlign: 'left', padding: '8px 10px', display: 'block' }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {hod.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {hod.department?.split(' ')[0] || 'HOD'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Administrative Officer (AO) */}
            {aoAccount && (
              <div>
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Administrative Officer (AO)
                </div>
                <button
                  onClick={() => handleQuickLogin(aoAccount)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', borderColor: '#fde68a', background: '#fffbeb' }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#92400e' }}>
                      {aoAccount.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#78350f' }}>
                      Approves Guest House & Hospitality Requisitions
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#fde047', color: '#713f12', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    Login as AO
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
