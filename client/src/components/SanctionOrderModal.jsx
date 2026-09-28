import React from 'react';
import { X, Printer, CheckCircle, Shield, Bed, Utensils, Coffee, Car } from 'lucide-react';
import NecLogo from '../assets/NecLogo';

export default function SanctionOrderModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="#701a75" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>AO Sanction Order & Hospitality Pass</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              Print Sanction Order
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
          <div className="official-slip" style={{ border: '2px solid #1e3a8a' }}>
            {/* Letterhead */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                <NecLogo showSubtext={false} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e3a8a', letterSpacing: '1px' }}>
                (AUTONOMOUS) • OFFICE OF THE ADMINISTRATIVE OFFICER
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., A.P. - 522601
              </div>
              <div style={{ 
                marginTop: '10px', 
                background: '#1e3a8a', 
                color: '#ffffff', 
                padding: '4px 16px', 
                borderRadius: '4px',
                fontSize: '0.85rem', 
                fontWeight: 800,
                letterSpacing: '0.6px',
                display: 'inline-block'
              }}>
                EXTERNAL EXAMINER HOSPITALITY & ACCOMMODATION SANCTION PROCEEDINGS
              </div>
            </div>

            {/* Reference info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '14px' }}>
              <div><strong>Sanction Order No:</strong> <code>{request.sanctionOrderNo || 'NEC/AO/SANCT/PENDING'}</code></div>
              <div><strong>Requisition Ref:</strong> <code>{request.requisitionNo}</code></div>
            </div>

            {/* Requisition Overview */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '16px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b', width: '32%' }}>Department:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700 }}>
                    {request.department} (Requisition by: {request.hodName})
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Examination Purpose:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700, color: '#0f172a' }}>
                    {request.purpose}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Course / Lab Subject:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 600, color: '#701a75' }}>
                    {request.examSubject}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 4px', color: '#64748b' }}>Dates of Examination:</td>
                  <td style={{ padding: '6px 4px', fontWeight: 700 }}>
                    {request.examDateFrom} {request.examDateTo !== request.examDateFrom && `to ${request.examDateTo}`}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* External Examiners Block */}
            <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '6px' }}>
                Invited External Examiner(s)
              </div>
              {request.examiners?.map((ex, idx) => (
                <div key={idx} style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
                  <strong>{idx + 1}. {ex.name}</strong>, {ex.designation}, <em>{ex.institution}</em> {ex.phone && `(Mob: ${ex.phone})`}
                </div>
              ))}
            </div>

            {/* Sanctioned Arrangements Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {/* Accommodation Sanction */}
              <div style={{ border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '6px' }}>
                  <Bed size={15} />
                  <span>CAMPUS GUEST HOUSE SANCTION</span>
                </div>
                {request.accommodation?.required ? (
                  <div style={{ fontSize: '0.82rem' }}>
                    <div><strong>Allotted Room:</strong> <span style={{ color: '#15803d', fontWeight: 800 }}>{request.accommodation.allocatedRoom}</span></div>
                    <div>Room Category: {request.accommodation.roomType} ({request.accommodation.roomCount} room)</div>
                    <div>Timings: {request.accommodation.checkInTime} to {request.accommodation.checkOutTime}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No guest house stay required.</div>
                )}
              </div>

              {/* Catering Sanction */}
              <div style={{ border: '1px solid #fed7aa', background: '#fff7ed', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#9a3412', marginBottom: '6px' }}>
                  <Utensils size={15} />
                  <span>APPROVED CATERING SCHEDULE</span>
                </div>
                <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {request.food?.breakfast?.required && (
                    <div>• <strong>Breakfast:</strong> {request.food.breakfast.count} persons (Morning Tiffin)</div>
                  )}
                  {request.food?.morningTea?.required && (
                    <div>• <strong>Morning Tea:</strong> {request.food.morningTea.count} cups ({request.food.morningTea.time})</div>
                  )}
                  {request.food?.lunch?.required && (
                    <div>• <strong>Executive Lunch:</strong> {request.food.lunch.count} meals ({request.food.lunch.vegCount} Veg, {request.food.lunch.nonVegCount} Non-Veg)</div>
                  )}
                  {request.food?.eveningTea?.required && (
                    <div>• <strong>Evening Tea:</strong> {request.food.eveningTea.count} cups ({request.food.eveningTea.time})</div>
                  )}
                  {request.food?.dinner?.required && (
                    <div>• <strong>Dinner:</strong> {request.food.dinner.count} persons</div>
                  )}
                </div>
              </div>
            </div>

            {/* AO Remarks */}
            <div style={{ fontSize: '0.82rem', marginBottom: '20px', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
              <strong>AO Order Notes:</strong> <em>"{request.aoRemarks || 'Approved. Canteen in-charge and campus supervisor notified.'}"</em>
            </div>

            {/* Signatures & Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
              <div>
                <div className="official-stamp" style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}>
                  ✓ SANCTIONED BY AO
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  Copy dispatched to: Canteen In-charge & Guest House Caretaker
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  Sri K. Srinivasa Rao
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Administrative Officer (AO)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#1e3a8a', fontWeight: 700 }}>
                  Narasaropeta Engineering College
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            Print Sanction Order
          </button>
        </div>
      </div>
    </div>
  );
}
