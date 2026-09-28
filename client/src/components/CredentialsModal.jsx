import React from 'react';
import { X, Key, Shield, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CredentialsModal({ isOpen, onClose }) {
  const [copiedEmail, setCopiedEmail] = useState('');

  if (!isOpen) return null;

  const credentials = [
    {
      category: 'Seminar Hall Coordinators',
      list: [
        { name: 'Dr. S.N Tirumalarao', role: 'Coordinator: Block-2 Seminar Hall', email: 'tirumalarao.b2@nec.edu.in', dept: 'CSE' },
        { name: 'Dr. S.VenkataRao', role: 'Coordinator: Block-3 Seminar Hall', email: 'venkatarao.b3@nec.edu.in', dept: 'ECE' },
        { name: 'Dr. S.Sunil', role: 'Coordinator: Block-4 Seminar Hall', email: 'sunil.b4@nec.edu.in', dept: 'MECH' }
      ]
    },
    {
      category: 'Department HODs (Heads of Department)',
      list: [
        { name: 'Dr. K. Rajesh', role: 'HOD Computer Science & Engg', email: 'hod.cse@nec.edu.in', dept: 'CSE' },
        { name: 'Dr. P. Lakshman', role: 'HOD Electronics & Communication', email: 'hod.ece@nec.edu.in', dept: 'ECE' },
        { name: 'Dr. V. Suresh', role: 'HOD Electrical & Electronics', email: 'hod.eee@nec.edu.in', dept: 'EEE' },
        { name: 'Dr. N. Ramesh', role: 'HOD Mechanical Engineering', email: 'hod.mech@nec.edu.in', dept: 'MECH' }
      ]
    },
    {
      category: 'Administrative Officer (AO)',
      list: [
        { name: 'Sri K. Srinivasa Rao', role: 'Administrative Officer (AO)', email: 'ao@nec.edu.in', dept: 'Admin Office' }
      ]
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={22} color="#701a75" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Portal Access Credentials</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Pre-configured login accounts for Coordinators, HODs, and Administrative Officer.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <div style={{
            background: '#faf5ff',
            border: '1px solid #f0abfc',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontWeight: 700, color: '#701a75' }}>Default Password for All Accounts: </span>
              <code style={{ background: '#fdf4ff', border: '1px solid #e879f9', padding: '3px 8px', borderRadius: '5px', fontWeight: 700, fontSize: '0.92rem' }}>nec@123</code>
            </div>
            <button
              onClick={() => copyToClipboard('nec@123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
            >
              {copiedEmail === 'nec@123' ? <Check size={13} color="#15803d" /> : <Copy size={13} />}
              {copiedEmail === 'nec@123' ? 'Copied' : 'Copy Password'}
            </button>
          </div>

          {credentials.map((cat, idx) => (
            <div key={idx} style={{ marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1e293b',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '6px',
                marginBottom: '10px'
              }}>
                {cat.category}
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {cat.list.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.role}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ fontSize: '0.82rem', color: '#334155', background: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        {item.email}
                      </code>
                      <button
                        onClick={() => copyToClipboard(item.email)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}
                        title="Copy Email"
                      >
                        {copiedEmail === item.email ? <Check size={16} color="#15803d" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
