import React, { useState, useEffect } from 'react';
import { reportApi } from '../services/api';
import SanctionOrderModal from './SanctionOrderModal';
import { 
  Utensils, 
  Bed, 
  Coffee, 
  Calendar, 
  Users, 
  Printer, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  FileCheck2,
  FileText,
  Car
} from 'lucide-react';
import { 
  exportToCSV, 
  getCurrentMonthRange, 
  getLast30DaysRange, 
  getNext30DaysRange, 
  getCurrentSemesterRange 
} from '../utils/reportUtils';

export default function HodExaminerSanctionsReport({ user }) {
  const defaultDates = getCurrentMonthRange();
  const [fromDate, setFromDate] = useState(defaultDates.fromDate);
  const [toDate, setToDate] = useState(defaultDates.toDate);
  const [status, setStatus] = useState('ALL');
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [viewingSanction, setViewingSanction] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getHodExaminerSanctions({
        fromDate,
        toDate,
        status
      });
      setReportData(res.data);
    } catch (err) {
      console.error('Failed to load examiner sanctions report', err);
      alert('Error fetching examiner sanctions report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, status]);

  const handlePreset = (type) => {
    let range;
    if (type === 'month') range = getCurrentMonthRange();
    else if (type === 'last30') range = getLast30DaysRange();
    else if (type === 'next30') range = getNext30DaysRange();
    else if (type === 'semester') range = getCurrentSemesterRange();
    
    if (range) {
      setFromDate(range.fromDate);
      setToDate(range.toDate);
    }
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.requests || !reportData.requests.length) {
      alert('No examiner sanction records to export.');
      return;
    }
    const rows = reportData.requests.map(r => ({
      'Requisition No': r.requisitionNo,
      'Sanction Order No': r.sanctionOrderNo || 'N/A',
      'Exam Subject': r.examSubject,
      'Academic Purpose': r.purpose,
      'Exam Date From': r.examDateFrom,
      'Exam Date To': r.examDateTo,
      'Examiners Count': r.examiners?.length || 0,
      'Examiner Names': r.examiners?.map(e => `${e.name} (${e.institution})`).join('; ') || '',
      'Room Allocated': r.accommodation?.allocatedRoom || 'Pending',
      'Room Count': r.accommodation?.roomCount || 0,
      'Room Type': r.accommodation?.roomType || '',
      'Executive Lunch Count': r.food?.lunch?.count || 0,
      'Breakfast Count': r.food?.breakfast?.count || 0,
      'Morning/Evening Tea Count': (r.food?.morningTea?.count || 0) + (r.food?.eveningTea?.count || 0),
      'Sanction Status': r.status,
      'AO Officer Remarks': r.aoRemarks || ''
    }));
    exportToCSV(rows, `NEC_External_Examiner_Sanctions_Report_${fromDate}_to_${toDate}`);
  };

  const summary = reportData?.summary || {
    totalRequisitions: 0,
    approvedSanctions: 0,
    pendingRequisitions: 0,
    rejectedRequisitions: 0,
    totalExaminersHosted: 0,
    totalRoomsAllocated: 0,
    cateringTotals: {
      breakfast: 0,
      lunch: 0,
      morningTea: 0,
      eveningTea: 0,
      dinner: 0
    }
  };

  const requests = reportData?.requests || [];

  return (
    <div className="report-container">
      {/* Official Print Header */}
      <div className="print-only official-print-header" style={{ display: 'none', marginBottom: '20px', borderBottom: '2px solid #701a75', paddingBottom: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#701a75', textTransform: 'uppercase' }}>
            Narasaraopeta Engineering College (Autonomous)
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#334155' }}>
            Office of Central Administration & Department of {user?.department || 'Engineering'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
            Kotappakonda Road, Yellamanda (P.O), Narasaraopet, Palnadu Dist., A.P. - 522601
          </div>
          <div style={{ margin: '12px 0 6px', padding: '6px', background: '#fffbeb', border: '1px solid #fde68a', fontWeight: 800, fontSize: '1.05rem', color: '#b45309' }}>
            EXTERNAL EXAMINER HOSPITALITY & ACCOMMODATION SANCTIONS REPORT
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569' }}>
            <strong>Period:</strong> {fromDate} to {toDate} &nbsp;|&nbsp; 
            <strong>HOD / Requestor:</strong> {user?.name} &nbsp;|&nbsp;
            <strong>Department:</strong> {user?.department}
          </div>
        </div>
      </div>

      {/* Screen Filter Bar */}
      <div className="no-print" style={{ 
        background: '#ffffff', 
        borderRadius: '16px', 
        padding: '24px', 
        border: '1px solid var(--border-color)', 
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <Utensils size={14} />
              ADMINISTRATIVE OFFICER (AO) SANCTIONS
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              EXTERNAL EXAMINER HOSPITALITY & ACCOMMODATION SANCTIONS
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
              Complete record of sanctioned guest house rooms, catering orders, and hospitality for external examiners approved by the Administrative Officer (AO).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={fetchReport}
              disabled={loading}
              title="Refresh report"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportCSV}
              title="Export report to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => window.print()}
              title="Print official report"
            >
              <Printer size={15} />
              <span>Print Sanctions Statement</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Quick Presets:</span>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handlePreset('month')}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
            >
              This Month
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handlePreset('last30')}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
            >
              Last 30 Days
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handlePreset('next30')}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
            >
              Next 30 Days
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handlePreset('semester')}
              style={{ padding: '3px 10px', fontSize: '0.75rem' }}
            >
              Current Semester
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                From Date
              </label>
              <input 
                type="date"
                className="form-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                To Date
              </label>
              <input 
                type="date"
                className="form-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Sanction Status
              </label>
              <select 
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved / Sanctioned</option>
                <option value="PENDING">Pending AO Review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fdf2f8', color: '#701a75' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>REQUISITIONS SUBMITTED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{summary.totalRequisitions}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Exam & Viva-voce</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <FileCheck2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>AO SANCTIONS APPROVED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{summary.approvedSanctions}</div>
            <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600 }}>Sanction orders issued</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <Bed size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>GUEST ROOMS SANCTIONED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1d4ed8' }}>{summary.totalRoomsAllocated} <span style={{ fontSize: '0.85rem' }}>Suites</span></div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Campus Guest House</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>EXTERNAL EXAMINERS HOSTED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{summary.totalExaminersHosted}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Professors & Evaluators</div>
          </div>
        </div>
      </div>

      {/* CATERING & HOSPITALITY METRICS BAR */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
        border: '1.5px solid #fde68a', 
        borderRadius: '12px', 
        padding: '16px 20px', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Coffee size={22} color="#b45309" />
          <div>
            <div style={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>
              Hospitality & Executive Catering Sanctions
            </div>
            <div style={{ fontSize: '0.8rem', color: '#a16207' }}>
              Catering authorized for canteen / dining hall by the Administrative Officer
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#78350f', fontWeight: 700 }}>BREAKFAST</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>{summary.cateringTotals.breakfast}</div>
          </div>
          <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#78350f', fontWeight: 700 }}>EXECUTIVE LUNCH</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>{summary.cateringTotals.lunch}</div>
          </div>
          <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#78350f', fontWeight: 700 }}>TEA & SNACKS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>{summary.cateringTotals.morningTea + summary.cateringTotals.eveningTea}</div>
          </div>
          <div style={{ background: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#78350f', fontWeight: 700 }}>DINNER</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>{summary.cateringTotals.dinner}</div>
          </div>
        </div>
      </div>

      {/* SANCTIONS TABLE */}
      <div className="nec-card">
        <div className="nec-card-header">
          <div>
            <h3 className="card-title">
              <Utensils size={20} color="#701a75" />
              <span>External Examiner Sanctions Log ({requests.length} Requisitions)</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Official accommodation room allocations and hospitality sanction orders for invited external examiners
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Utensils size={36} strokeWidth={1.5} style={{ opacity: 0.35, marginBottom: '8px' }} />
            <p style={{ fontWeight: 600 }}>No examiner hospitality sanctions found for dates {fromDate} to {toDate}.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="nec-table">
              <thead>
                <tr>
                  <th>Sanction Order / Req No</th>
                  <th>Exam Dates</th>
                  <th>Exam Subject & Purpose</th>
                  <th>External Examiners</th>
                  <th>Accommodation Sanction</th>
                  <th>Food & Refreshments</th>
                  <th>Conveyance</th>
                  <th>Status</th>
                  <th>AO Remarks</th>
                  <th className="no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r._id}>
                    <td>
                      {r.sanctionOrderNo ? (
                        <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.85rem' }}>
                          {r.sanctionOrderNo}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pending Sanction</span>
                      )}
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        Req: {r.requisitionNo}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800 }}>{r.examDateFrom}</div>
                      {r.examDateTo && r.examDateTo !== r.examDateFrom && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>to {r.examDateTo}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.examSubject}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{r.purpose}</div>
                    </td>
                    <td>
                      {r.examiners && r.examiners.map((ex, idx) => (
                        <div key={idx} style={{ marginBottom: '4px', fontSize: '0.8rem' }}>
                          <strong>{ex.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ex.designation}, {ex.institution}</div>
                        </div>
                      ))}
                    </td>
                    <td>
                      {r.accommodation?.required ? (
                        <div style={{ fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 800, color: '#1d4ed8' }}>
                            {r.accommodation.allocatedRoom || r.accommodation.roomType}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {r.accommodation.roomCount} Room(s) • Check-in: {r.accommodation.checkInTime}
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Not Required</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                        {r.food?.breakfast?.required && `• Breakfast (${r.food.breakfast.count}) `}
                        {r.food?.lunch?.required && `• Lunch (${r.food.lunch.count}) `}
                        {r.food?.morningTea?.required && `• Tea (${r.food.morningTea.count}) `}
                        {r.food?.dinner?.required && `• Dinner (${r.food.dinner.count}) `}
                      </div>
                    </td>
                    <td>
                      {r.conveyance?.pickupRequired ? (
                        <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Car size={13} /> Pickup Sanctioned
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Own</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${r.status?.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#475569', maxWidth: '200px' }}>
                      {r.aoRemarks || '—'}
                    </td>
                    <td className="no-print">
                      {r.status === 'APPROVED' ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewingSanction(r)}
                          title="Print official sanction order slip"
                        >
                          <Printer size={13} />
                          Sanction Slip
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Signatures Print View */}
      <div className="print-only" style={{ display: 'none', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '45px' }}></div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#701a75', borderTop: '1px dashed #475569', paddingTop: '4px', minWidth: '220px' }}>
              {user?.name}
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Head of Department ({user?.department})</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '45px' }}></div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e3a8a', borderTop: '1px dashed #475569', paddingTop: '4px', minWidth: '220px' }}>
              Sri K. Srinivasa Rao
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Administrative Officer (AO)</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '45px' }}></div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', borderTop: '1px dashed #475569', paddingTop: '4px', minWidth: '180px' }}>
              Principal
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>NEC Autonomous</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sanction Slip Modal */}
      <SanctionOrderModal
        isOpen={Boolean(viewingSanction)}
        onClose={() => setViewingSanction(null)}
        request={viewingSanction}
      />
    </div>
  );
}
