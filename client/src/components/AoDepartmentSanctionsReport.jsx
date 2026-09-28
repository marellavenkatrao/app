import React, { useState, useEffect } from 'react';
import { reportApi } from '../services/api';
import SanctionOrderModal from './SanctionOrderModal';
import StationaryVoucherModal from './StationaryVoucherModal';
import { 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Utensils, 
  Package, 
  Users, 
  Bed, 
  Printer, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  exportToCSV, 
  getCurrentMonthRange, 
  getLast30DaysRange, 
  getNext30DaysRange, 
  getCurrentSemesterRange 
} from '../utils/reportUtils';

export default function AoDepartmentSanctionsReport({ user }) {
  const defaultDates = getCurrentMonthRange();
  const [fromDate, setFromDate] = useState(defaultDates.fromDate);
  const [toDate, setToDate] = useState(defaultDates.toDate);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [category, setCategory] = useState('ALL'); // 'ALL' | 'EXAMINER' | 'STATIONARY'
  const [status, setStatus] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  
  // Accordion state for departments
  const [expandedDepts, setExpandedDepts] = useState({});

  // Modals for slips
  const [viewingExaminerSanction, setViewingExaminerSanction] = useState(null);
  const [viewingStationaryVoucher, setViewingStationaryVoucher] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getAoDepartmentSanctions({
        fromDate,
        toDate,
        department: selectedDept,
        category,
        status
      });
      setReportData(res.data);
      // Auto-expand all departments by default
      if (res.data?.departments) {
        const expandMap = {};
        res.data.departments.forEach(d => { expandMap[d.department] = true; });
        setExpandedDepts(expandMap);
      }
    } catch (err) {
      console.error('Failed to load AO department sanctions report', err);
      alert('Error fetching department-wise sanctions report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, selectedDept, category, status]);

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

  const toggleDeptExpand = (deptName) => {
    setExpandedDepts(prev => ({
      ...prev,
      [deptName]: !prev[deptName]
    }));
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.departments || !reportData.departments.length) {
      alert('No department sanctions data to export.');
      return;
    }
    
    const rows = [];
    reportData.departments.forEach(dept => {
      dept.unifiedSanctionsList.forEach(item => {
        rows.push({
          'Department': dept.department,
          'Sanction Type': item.typeLabel,
          'Sanction Order No': item.sanctionOrderNo,
          'Requisition No': item.requisitionNo,
          'Requestor': item.requestorName,
          'Purpose / Subject': item.subjectOrPurpose,
          'Category / Urgency': item.purposeCategory,
          'Dates': item.dates,
          'Allocated / Sanctioned Details': item.keyDetails,
          'Status': item.status,
          'AO Remarks': item.aoRemarks || ''
        });
      });
    });

    if (rows.length === 0) {
      alert('No individual sanction records matching the filter.');
      return;
    }

    exportToCSV(rows, `NEC_AO_All_Sanctions_Department_Wise_${fromDate}_to_${toDate}`);
  };

  const summary = reportData?.summary || {
    totalDepartments: 0,
    totalRequisitions: 0,
    totalSanctionsIssued: 0,
    totalPending: 0,
    totalExaminerSanctions: 0,
    totalStationerySanctions: 0,
    totalRoomsAllocated: 0,
    totalExaminersHosted: 0,
    overallApprovalRate: 0
  };

  const departments = reportData?.departments || [];

  return (
    <div className="report-container">
      {/* Official Print Header */}
      <div className="print-only official-print-header" style={{ display: 'none', marginBottom: '20px', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase' }}>
            Narasaraopeta Engineering College (Autonomous)
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 700 }}>
            Office of the Administrative Officer (Central Administration)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
            Approved by AICTE, Permanently Affiliated to JNTUK, Accredited by NAAC with 'A+' Grade
          </div>
          <div style={{ margin: '12px 0 6px', padding: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', fontWeight: 800, fontSize: '1.05rem', color: '#1e3a8a' }}>
            CONSOLIDATED DEPARTMENT-WISE SANCTIONS REPORT
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569' }}>
            <strong>Period:</strong> {fromDate} to {toDate} &nbsp;|&nbsp; 
            <strong>Category:</strong> {category === 'ALL' ? 'All Sanctions (Hospitality & Stationery)' : category} &nbsp;|&nbsp;
            <strong>Administrative Officer:</strong> {user?.name || 'Sri K. Srinivasa Rao'}
          </div>
        </div>
      </div>

      {/* Screen Filter Header */}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              <ShieldCheck size={14} />
              CENTRAL ADMINISTRATIVE OFFICER (AO) CONSOLE
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
              All Sanctions Report (Department-Wise)
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
              Consolidated audit statement of all sanctions issued across departments for External Examiner Hospitality, Guest House Accommodation, and Central Store Stationery.
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
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
                Sanction Category
              </label>
              <select 
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Sanctions (Unified)</option>
                <option value="EXAMINER">Examiner Hospitality & Rooms</option>
                <option value="STATIONARY">Central Store Stationery</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Filter Department
              </label>
              <select 
                className="form-input"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '0.85rem' }}
              >
                <option value="ALL">All Academic Departments</option>
                {departments.map(d => (
                  <option key={d.department} value={d.department}>{d.department}</option>
                ))}
              </select>
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
                <option value="APPROVED">Sanctioned / Issued Only</option>
                <option value="PENDING">Pending Review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#15803d' }}>
            <FileCheck2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>SANCTION ORDERS ISSUED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{summary.totalSanctionsIssued}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Out of {summary.totalRequisitions} Requests ({summary.overallApprovalRate}%)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Utensils size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>EXAMINER HOSPITALITY</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{summary.totalExaminerSanctions}</div>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>{summary.totalRoomsAllocated} Guest Rooms • {summary.totalExaminersHosted} Examiners</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>STATIONERY SANCTIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>{summary.totalStationerySanctions}</div>
            <div style={{ fontSize: '0.72rem', color: '#0369a1' }}>Central Store Indents</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fdf2f8', color: '#701a75' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>DEPARTMENTS SERVED</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#701a75' }}>{summary.totalDepartments}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Autonomous Branches</div>
          </div>
        </div>
      </div>

      {/* DEPARTMENT-WISE SUMMARY MATRIX */}
      <div className="nec-card" style={{ marginBottom: '24px' }}>
        <div className="nec-card-header">
          <div>
            <h3 className="card-title">
              <Building2 size={20} color="#1e3a8a" />
              <span>Department-Wise Sanctions Matrix</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Comparison of sanctions issued across departments for the selected period
            </p>
          </div>
        </div>

        {departments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
            <p>No sanctions recorded for the selected period ({fromDate} to {toDate}).</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="nec-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Requisitions</th>
                  <th>Examiner Hospitality</th>
                  <th>Stationery Sanctions</th>
                  <th>Total Sanctions Issued</th>
                  <th>Rooms Allotted</th>
                  <th>Items Sanctioned</th>
                  <th>Approval Rate</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(d => (
                  <tr key={d.department}>
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>{d.department}</td>
                    <td style={{ fontWeight: 700 }}>{d.totalRequisitions}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#92400e' }}>
                        {d.examiner.approved} Approved
                      </span>
                      {d.examiner.pending > 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#b45309', marginLeft: '4px' }}>({d.examiner.pending} pend)</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0369a1' }}>
                        {d.stationary.approved + d.stationary.issued} Sanctioned
                      </span>
                      {d.stationary.pending > 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#b45309', marginLeft: '4px' }}>({d.stationary.pending} pend)</span>
                      )}
                    </td>
                    <td>
                      <span style={{ 
                        background: '#dcfce7', 
                        color: '#15803d', 
                        padding: '3px 10px', 
                        borderRadius: '9999px', 
                        fontWeight: 800, 
                        fontSize: '0.85rem' 
                      }}>
                        {d.totalSanctionsIssued} Orders
                      </span>
                    </td>
                    <td>{d.examiner.roomsAllocated} Rooms</td>
                    <td>{d.stationary.totalItemsSanctioned} Nos</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '48px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.approvalRate}%`, height: '100%', background: '#15803d' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.78rem' }}>{d.approvalRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DEPARTMENT-WISE EXPANDABLE DETAILED LOGS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#1e3a8a" />
            <span>Department-Wise Detailed Sanctions Portfolio</span>
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Showing itemized sanction orders grouped department-wise
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {departments.map(d => {
            const isExpanded = expandedDepts[d.department] !== false;
            return (
              <div 
                key={d.department}
                className="nec-card"
                style={{ 
                  border: '1.5px solid #cbd5e1', 
                  borderRadius: '14px', 
                  overflow: 'hidden'
                }}
              >
                {/* Department Header Accordion Bar */}
                <div 
                  onClick={() => toggleDeptExpand(d.department)}
                  style={{ 
                    padding: '16px 20px', 
                    background: '#f8fafc', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#1e3a8a', color: '#ffffff', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {d.department}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {d.totalSanctionsIssued} Sanction Orders Issued • {d.totalRequisitions} Total Requisitions Submitted
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {d.examiner.approved} Hospitality
                    </span>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {d.stationary.approved + d.stationary.issued} Stationery
                    </span>
                    <div className="no-print" style={{ color: '#64748b' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Department Sanctions Content */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px' }}>
                    {d.unifiedSanctionsList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>
                        No individual sanctions recorded for this department in selected dates.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="nec-table">
                          <thead>
                            <tr>
                              <th>Sanction Order / Req No</th>
                              <th>Type</th>
                              <th>Requestor & Designation</th>
                              <th>Subject / Purpose</th>
                              <th>Key Sanction Details</th>
                              <th>Dates / Needed By</th>
                              <th>Status</th>
                              <th>AO Remarks</th>
                              <th className="no-print">Slip</th>
                            </tr>
                          </thead>
                          <tbody>
                            {d.unifiedSanctionsList.map(item => (
                              <tr key={item._id}>
                                <td>
                                  {item.sanctionOrderNo && item.sanctionOrderNo !== '—' ? (
                                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.82rem' }}>
                                      {item.sanctionOrderNo}
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Pending</span>
                                  )}
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                    {item.requisitionNo}
                                  </div>
                                </td>
                                <td>
                                  <span style={{ 
                                    background: item.categoryTag === 'Hospitality' ? '#fef3c7' : '#e0f2fe', 
                                    color: item.categoryTag === 'Hospitality' ? '#92400e' : '#0369a1', 
                                    padding: '2px 8px', 
                                    borderRadius: '4px', 
                                    fontSize: '0.72rem', 
                                    fontWeight: 800 
                                  }}>
                                    {item.categoryTag}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.requestorName}</div>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>{item.subjectOrPurpose}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.purposeCategory}</div>
                                </td>
                                <td style={{ fontSize: '0.8rem', maxWidth: '240px' }}>
                                  <span style={{ fontWeight: 600 }}>{item.keyDetails}</span>
                                </td>
                                <td style={{ fontSize: '0.78rem', color: '#334155' }}>
                                  {item.dates}
                                </td>
                                <td>
                                  <span className={`status-badge ${item.status?.toLowerCase()}`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.76rem', color: '#475569', maxWidth: '180px' }}>
                                  {item.aoRemarks || '—'}
                                </td>
                                <td className="no-print">
                                  {item.sanctionType === 'EXAMINER_HOSPITALITY' && item.status === 'APPROVED' && (
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => setViewingExaminerSanction(item.raw)}
                                      title="Print sanction order slip"
                                      style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                                    >
                                      <Printer size={12} /> Slip
                                    </button>
                                  )}
                                  {item.sanctionType === 'STATIONERY' && ['APPROVED', 'ISSUED'].includes(item.status) && (
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      onClick={() => setViewingStationaryVoucher(item.raw)}
                                      title="Print store issue voucher"
                                      style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                                    >
                                      <Printer size={12} /> Slip
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Signatures Print View */}
      <div className="print-only" style={{ display: 'none', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '45px' }}></div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', borderTop: '1px dashed #475569', paddingTop: '4px', minWidth: '180px' }}>
              Central Storekeeper / Caretaker
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '45px' }}></div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e3a8a', borderTop: '1px dashed #475569', paddingTop: '4px', minWidth: '220px' }}>
              {user?.name || 'Sri K. Srinivasa Rao'}
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

      {/* Slips modals */}
      <SanctionOrderModal
        isOpen={Boolean(viewingExaminerSanction)}
        onClose={() => setViewingExaminerSanction(null)}
        request={viewingExaminerSanction}
      />

      <StationaryVoucherModal
        isOpen={Boolean(viewingStationaryVoucher)}
        onClose={() => setViewingStationaryVoucher(null)}
        request={viewingStationaryVoucher}
      />
    </div>
  );
}
