import React from 'react';
import { X, Printer, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import NecLogo from '../assets/NecLogo';

export default function StationaryVoucherModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div className="modal-header no-print" style={{ 
          background: '#f8fafc', 
          borderBottom: '1px solid #e2e8f0', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#1e3a8a" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Official Stationery Sanction & Store Issue Order
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="modal-body" style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="official-slip" style={{ border: '2px solid #1e3a8a', padding: '24px', borderRadius: '12px', background: '#ffffff' }}>
            
            {/* College Letterhead */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <NecLogo showSubtext={false} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '1px' }}>
                (AUTONOMOUS) • CENTRAL ADMINISTRATION & STORES
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                Approved by AICTE, New Delhi • Permanently Affiliated to JNTUK, Kakinada • Accredited by NAAC with 'A+' Grade
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., Andhra Pradesh - 522601
              </div>

              <div style={{ 
                marginTop: '12px', 
                background: '#1e3a8a', 
                color: '#ffffff', 
                padding: '6px 20px', 
                borderRadius: '6px',
                fontSize: '0.88rem', 
                fontWeight: 800,
                letterSpacing: '0.8px',
                display: 'inline-block'
              }}>
                DEPARTMENTAL STATIONERY REQUISITION & SANCTION PROCEEDINGS
              </div>
            </div>

            {/* Reference info */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '10px', 
              fontSize: '0.82rem', 
              marginBottom: '16px',
              padding: '10px 14px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <div>
                <strong>Sanction Order No:</strong>{' '}
                <code style={{ color: '#1e3a8a', fontWeight: 800 }}>{request.sanctionOrderNo || 'NEC/AO/STAT/PENDING'}</code>
              </div>
              <div>
                <strong>Indent Ref:</strong>{' '}
                <code style={{ color: '#701a75', fontWeight: 800 }}>{request.requisitionNo}</code>
              </div>
              <div>
                <strong>Date:</strong>{' '}
                <span>{request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN') : 'Today'}</span>
              </div>
            </div>

            {/* Indent Header Data */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '18px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b', width: '28%' }}>Requesting Department:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700, color: '#0f172a' }}>
                    {request.department}
                  </td>
                  <td style={{ padding: '6px 4px', color: '#64748b', width: '20%' }}>Initiated By:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 600 }}>
                    {request.requestorName} ({request.requestorDesignation})
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Purpose / Justification:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700, color: '#701a75' }}>
                    {request.purpose}
                  </td>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Urgency Level:</td>
                  <td style={{ padding: '6px 4px' }}>
                    <span style={{ 
                      fontWeight: 800, 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      color: request.urgency === 'EXAM_CRITICAL' ? '#991b1b' : request.urgency === 'URGENT' ? '#92400e' : '#166534',
                      background: request.urgency === 'EXAM_CRITICAL' ? '#fee2e2' : request.urgency === 'URGENT' ? '#fef3c7' : '#dcfce7'
                    }}>
                      {request.urgency}
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Required By Date:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 600 }}>
                    {request.requiredByDate}
                  </td>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Requisition Status:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 800, color: request.status === 'APPROVED' ? '#15803d' : '#b45309' }}>
                    {request.status}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Itemized Table */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                Itemized Stationery Sanction Schedule:
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', border: '1px solid #cbd5e1' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #94a3b8' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '45px' }}>S.No</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Item Description & Specification</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '120px' }}>Category</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '90px' }}>Indented Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', width: '105px', background: '#e0e7ff', color: '#1e3a8a' }}>
                      Sanctioned Qty
                    </th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', width: '95px' }}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {request.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.itemName}</div>
                        {item.specification && (
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.specification}</div>
                        )}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#475569', fontSize: '0.76rem' }}>{item.category}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                        {item.quantityRequested}
                      </td>
                      <td style={{ 
                        padding: '8px 10px', 
                        textAlign: 'center', 
                        fontWeight: 800, 
                        color: '#1e3a8a',
                        background: '#eff6ff'
                      }}>
                        {item.quantitySanctioned !== null && item.quantitySanctioned !== undefined 
                          ? item.quantitySanctioned 
                          : (request.status === 'APPROVED' ? item.quantityRequested : '—')}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#475569', fontSize: '0.78rem' }}>{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Department Remarks */}
            {request.generalRemarks && (
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', marginBottom: '14px' }}>
                <strong style={{ color: '#475569' }}>Department Notes / Justification:</strong> {request.generalRemarks}
              </div>
            )}

            {/* AO Sanction Endorsement & Store Directions */}
            <div style={{ 
              background: '#eff6ff', 
              border: '1.5px solid #93c5fd', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              fontSize: '0.82rem', 
              marginBottom: '26px' 
            }}>
              <div style={{ fontWeight: 800, color: '#1e3a8a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={15} color="#2563eb" />
                ADMINISTRATIVE OFFICER (AO) SANCTION & STORE DISPATCH INSTRUCTIONS:
              </div>
              <div style={{ color: '#1e3a8a', fontWeight: 600 }}>
                {request.aoRemarks || 'Sanctioned from Central Store inventory. Authorized departmental staff may collect items upon production of this voucher.'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#3b82f6', marginTop: '4px' }}>
                Store Location: Central Store, Room 104, Ground Floor, Administrative Block • Hours: 09:30 AM to 04:30 PM
              </div>
            </div>

            {/* Signature Blocks */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '16px', 
              textAlign: 'center', 
              fontSize: '0.78rem',
              paddingTop: '20px',
              borderTop: '1px dashed #cbd5e1'
            }}>
              <div>
                <div style={{ minHeight: '45px' }}></div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 700 }}>
                  Head of the Department
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {request.department}
                </div>
              </div>

              <div>
                <div style={{ minHeight: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ 
                    border: '1.5px solid #15803d', 
                    color: '#15803d', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.68rem', 
                    fontWeight: 800,
                    transform: 'rotate(-4deg)'
                  }}>
                    SANCTIONED & VERIFIED
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 700 }}>
                  Administrative Officer (AO)
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Central Administration, NEC
                </div>
              </div>

              <div>
                <div style={{ minHeight: '45px' }}></div>
                <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px', fontWeight: 700 }}>
                  Store Incharge / Receiver
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Issue Date & Signature
                </div>
              </div>
            </div>

            {/* Autonomous Security Footer */}
            <div style={{ 
              textAlign: 'center', 
              fontSize: '0.68rem', 
              color: '#94a3b8', 
              marginTop: '20px', 
              borderTop: '1px solid #f1f5f9', 
              paddingTop: '8px' 
            }}>
              Computer-generated official indenture document • Narasaropeta Engineering College (Autonomous) • Verification: {request.requisitionNo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
