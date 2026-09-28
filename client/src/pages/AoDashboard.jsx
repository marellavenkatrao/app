import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { examinerApi, bookingApi, stationaryApi } from '../services/api';
import SanctionOrderModal from '../components/SanctionOrderModal';
import StationaryVoucherModal from '../components/StationaryVoucherModal';
import AoDepartmentSanctionsReport from '../components/AoDepartmentSanctionsReport';
import { 
  ShieldCheck, 
  Utensils, 
  Bed, 
  Coffee, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer, 
  Check, 
  X, 
  Calendar, 
  Users, 
  Building2,
  AlertCircle,
  Package,
  Layers,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AoDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [stationaryRequests, setStationaryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('examiners'); // 'examiners' | 'stationary' | 'hallOverview'
  
  // Custom room allocation and remarks state per request
  const [roomAllocations, setRoomAllocations] = useState({});
  const [aoRemarksMap, setAoRemarksMap] = useState({});
  const [viewingSanction, setViewingSanction] = useState(null);

  // Stationery sanction state
  const [statRemarksMap, setStatRemarksMap] = useState({});
  const [sanctionedQtyMap, setSanctionedQtyMap] = useState({});
  const [viewingStationaryVoucher, setViewingStationaryVoucher] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, bookingsRes, statRes] = await Promise.all([
        examinerApi.getAll(),
        bookingApi.getAll(),
        stationaryApi.getAll()
      ]);
      setRequests(reqRes.data.requests || []);
      setAllBookings(bookingsRes.data.bookings || []);
      setStationaryRequests(statRes.data.requests || []);
    } catch (err) {
      console.error('Failed to load AO data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoading(requestId);
    try {
      const allocatedRoom = roomAllocations[requestId] || 'Room 201 - Executive Suite, Campus Guest House';
      const aoRemarks = aoRemarksMap[requestId] || (newStatus === 'APPROVED' ? 'Sanctioned. Catering supervisor and guest house caretaker instructed.' : 'Unable to sanction due to schedule.');

      await examinerApi.updateStatus(requestId, newStatus, aoRemarks, allocatedRoom);

      if (newStatus === 'APPROVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update AO requisition status');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const approvedRequests = requests.filter(r => r.status === 'APPROVED');
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED');

  const pendingStationary = stationaryRequests.filter(r => r.status === 'PENDING');
  const sanctionedStationary = stationaryRequests.filter(r => ['APPROVED', 'ISSUED'].includes(r.status));

  const handleUpdateStationaryStatus = async (requestId, newStatus) => {
    setActionLoading(requestId);
    try {
      const aoRemarks = statRemarksMap[requestId] || (
        newStatus === 'APPROVED' ? 'Sanctioned from Central Store. Collect from Storekeeper (Room 104, Admin Block).' :
        newStatus === 'ISSUED' ? 'Items issued from store inventory to department representative.' :
        'Unable to sanction due to inventory schedule.'
      );

      const requestObj = stationaryRequests.find(r => r._id === requestId);
      let itemsSanctioned = undefined;
      if (requestObj && requestObj.items) {
        itemsSanctioned = requestObj.items.map((item, idx) => {
          const customQty = sanctionedQtyMap[requestId]?.[item._id] ?? item.quantityRequested;
          return {
            _id: item._id,
            index: idx,
            quantitySanctioned: Number(customQty)
          };
        });
      }

      await stationaryApi.updateStatus(requestId, newStatus, aoRemarks, itemsSanctioned);

      if (['APPROVED', 'ISSUED'].includes(newStatus)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stationery requisition status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      {/* AO Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', 
        borderRadius: '16px', 
        padding: '24px 28px', 
        color: '#ffffff', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#fde047', color: '#713f12', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              ADMINISTRATIVE OFFICER (AO) CONSOLE
            </span>
            <span style={{ opacity: 0.9, fontSize: '0.86rem' }}>Central Administration</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '6px' }}>
            {user?.name || 'Sri K. Srinivasa Rao'}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', maxWidth: '680px', marginTop: '4px' }}>
            Sanction campus guest house accommodation and executive hospitality (breakfast, morning tea, executive lunch, and evening tea) for invited external examiners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>Pending AO Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde047' }}>
              {pendingRequests.length} Requisitions
            </div>
          </div>

          <button
            className="btn"
            onClick={() => setActiveTab('deptSanctionsReport')}
            style={{ 
              background: activeTab === 'deptSanctionsReport' ? '#ffffff' : '#fde047', 
              color: activeTab === 'deptSanctionsReport' ? '#1e3a8a' : '#713f12', 
              fontWeight: 800, 
              border: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}
          >
            <ShieldCheck size={16} />
            Department-Wise Sanctions Report
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>PENDING AO REQUISITIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{pendingRequests.length}</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Needs room & catering sanction</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#15803d' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>SANCTIONED ORDERS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803d' }}>{approvedRequests.length}</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Dispatched to catering & guest house</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff', color: '#3730a3' }}>
            <Bed size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>COLLEGE SEMINAR SCHEDULE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{allBookings.length} Events</div>
            <div style={{ fontSize: '0.74rem', color: '#475569' }}>Across Block-2, 3 & 4</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>STATIONERY INDENTS (AO)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>{pendingStationary.length} Pending</div>
            <div style={{ fontSize: '0.74rem', color: '#0369a1', fontWeight: 600 }}>{sanctionedStationary.length} Sanctioned / Issued</div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="tabs-nav no-print" style={{ marginTop: '10px', flexWrap: 'wrap' }}>
        <button
          className={`tab-btn ${activeTab === 'examiners' ? 'active' : ''}`}
          onClick={() => setActiveTab('examiners')}
        >
          <Utensils size={18} />
          External Examiner Hospitality & Accommodation ({requests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'stationary' ? 'active' : ''}`}
          onClick={() => setActiveTab('stationary')}
        >
          <Package size={18} />
          Department Stationery Requisitions ({stationaryRequests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'hallOverview' ? 'active' : ''}`}
          onClick={() => setActiveTab('hallOverview')}
        >
          <Building2 size={18} />
          Campus Seminar Halls Central Schedule ({allBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'deptSanctionsReport' ? 'active' : ''}`}
          onClick={() => setActiveTab('deptSanctionsReport')}
          style={{ fontWeight: activeTab === 'deptSanctionsReport' ? 800 : 600 }}
        >
          <ShieldCheck size={18} />
          🏢 Department-Wise Sanctions Report (From & To Dates)
        </button>
      </div>

      {/* TAB 1: External Examiner Requisitions to AO */}
      {activeTab === 'examiners' && (
        <div>
          {/* PENDING ACTIONS HIGHLIGHT */}
          {pendingRequests.length > 0 && (
            <div className="nec-card" style={{ border: '2px solid #3b82f6', background: '#f8faff', marginBottom: '28px' }}>
              <div className="nec-card-header" style={{ borderColor: '#dbeafe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={22} color="#1e40af" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e3a8a' }}>
                      Requisitions Awaiting AO Sanction & Room Allocation ({pendingRequests.length})
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#3b82f6' }}>
                      Allocate campus guest house room numbers and authorize breakfast, morning tea, executive lunch, and evening tea arrangements.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '18px' }}>
                {pendingRequests.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
                          {r.requisitionNo}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                          {r.examSubject}
                        </h3>
                        <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>
                          {r.purpose} • Requested by <strong>{r.hodName}</strong> ({r.department})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 800, color: '#1e3a8a' }}>
                          <Calendar size={16} />
                          <span>{r.examDateFrom} {r.examDateTo !== r.examDateFrom && `to ${r.examDateTo}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* External Examiners list */}
                    <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Invited External Examiners:
                      </div>
                      {r.examiners?.map((ex, i) => (
                        <div key={i} style={{ fontSize: '0.84rem' }}>
                          <strong>{ex.name}</strong> ({ex.designation}), <em>{ex.institution}</em> {ex.phone && `• Ph: ${ex.phone}`}
                        </div>
                      ))}
                    </div>

                    {/* Requirements Breakdown (Accommodation + Refreshments) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                      {/* Accommodation Box */}
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>
                          <Bed size={16} />
                          <span>Guest House Accommodation</span>
                        </div>
                        {r.accommodation?.required ? (
                          <div style={{ fontSize: '0.82rem', color: '#1e293b' }}>
                            <div>Requested: <strong>{r.accommodation.roomType}</strong> ({r.accommodation.roomCount} room)</div>
                            <div>Timings: {r.accommodation.checkInTime} to {r.accommodation.checkOutTime}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>No stay requested.</div>
                        )}
                      </div>

                      {/* Catering Box */}
                      <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 800, color: '#9a3412', marginBottom: '4px' }}>
                          <Utensils size={16} />
                          <span>Hospitality & Refreshment Schedule</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.4 }}>
                          {r.food?.breakfast?.required && <div>• <strong>Breakfast:</strong> {r.food.breakfast.count} pax</div>}
                          {r.food?.morningTea?.required && <div>• <strong>Morning Tea:</strong> {r.food.morningTea.count} cups ({r.food.morningTea.time})</div>}
                          {r.food?.lunch?.required && (
                            <div style={{ fontWeight: 700, color: '#c2410c' }}>
                              • <strong>Executive Lunch:</strong> {r.food.lunch.count} meals ({r.food.lunch.vegCount} Veg, {r.food.lunch.nonVegCount} Non-Veg)
                            </div>
                          )}
                          {r.food?.eveningTea?.required && <div>• <strong>Evening Tea:</strong> {r.food.eveningTea.count} cups ({r.food.eveningTea.time})</div>}
                        </div>
                      </div>
                    </div>

                    {/* AO Allocation & Sanction Inputs */}
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '12px' }}>
                      <div className="form-grid-2" style={{ marginBottom: '10px' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>
                            Allocate Campus Guest House Room Number *
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Room 201 - Executive Suite, Guest House"
                            value={roomAllocations[r._id] || 'Room 201 - Executive Suite, Campus Guest House'}
                            onChange={(e) => setRoomAllocations({ ...roomAllocations, [r._id]: e.target.value })}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>

                        <div>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: '#1e3a8a' }}>
                            AO Sanction Order Remarks & Notes
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Approved. Canteen supervisor informed for executive lunch arrangements."
                            value={aoRemarksMap[r._id] || ''}
                            onChange={(e) => setAoRemarksMap({ ...aoRemarksMap, [r._id]: e.target.value })}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateStatus(r._id, 'REJECTED')}
                          disabled={actionLoading === r._id}
                        >
                          <X size={15} />
                          Reject Requisition
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => handleUpdateStatus(r._id, 'APPROVED')}
                          disabled={actionLoading === r._id}
                        >
                          <Check size={16} />
                          Sanction & Issue Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL EXAMINER REQUISITIONS TABLE */}
          <div className="nec-card">
            <div className="nec-card-header">
              <h3 className="card-title">
                <Utensils size={20} color="#701a75" />
                <span>Sanctioned & Archived External Examiner Requisitions</span>
              </h3>
            </div>

            <div className="table-responsive">
              <table className="nec-table">
                <thead>
                  <tr>
                    <th>Requisition No</th>
                    <th>Sanction Order</th>
                    <th>Department & HOD</th>
                    <th>Course Subject</th>
                    <th>Examiner(s)</th>
                    <th>Dates</th>
                    <th>Allotted Room</th>
                    <th>Hospitality</th>
                    <th>Status</th>
                    <th>Print Order</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td><code>{r.requisitionNo}</code></td>
                      <td>
                        {r.sanctionOrderNo ? (
                          <strong style={{ color: '#15803d', fontSize: '0.82rem' }}>{r.sanctionOrderNo}</strong>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Pending</span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{r.department}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{r.hodName}</div>
                      </td>
                      <td>{r.examSubject}</td>
                      <td>
                        {r.examiners?.map((ex, idx) => (
                          <div key={idx} style={{ fontSize: '0.8rem' }}>
                            <strong>{ex.name}</strong>
                          </div>
                        ))}
                      </td>
                      <td>{r.examDateFrom}</td>
                      <td>
                        {r.accommodation?.required ? (
                          <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 600 }}>
                            {r.accommodation.allocatedRoom}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.78rem' }}>
                        {r.food?.lunch?.required && <span>✓ Lunch ({r.food.lunch.count}) • </span>}
                        {r.food?.breakfast?.required && <span>✓ Breakfast • </span>}
                        {r.food?.morningTea?.required && <span>✓ Tea</span>}
                      </td>
                      <td>
                        <span className={`status-badge ${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.status === 'APPROVED' ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewingSanction(r)}
                            title="Print Sanction Order"
                          >
                            <Printer size={13} />
                            Sanction Slip
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Awaiting</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Central Seminar Halls Overview */}
      {activeTab === 'hallOverview' && (
        <div className="nec-card">
          <div className="nec-card-header">
            <div>
              <h3 className="card-title">
                <Building2 size={20} color="#701a75" />
                <span>Campus Seminar Halls Central Reservation Log</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Oversight of Block-2, Block-3, and Block-4 seminar hall usage across all academic departments.
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="nec-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Seminar Hall</th>
                  <th>Designated Coordinator</th>
                  <th>Department</th>
                  <th>Event Name</th>
                  <th>Date & Slot</th>
                  <th>Audience</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((b) => (
                  <tr key={b._id}>
                    <td><code>{b.bookingId}</code></td>
                    <td style={{ fontWeight: 800, color: '#701a75' }}>{b.hallName}</td>
                    <td>{b.coordinator?.name || b.coordinatorName || 'Assigned Coordinator'}</td>
                    <td>{b.department}</td>
                    <td>{b.eventName}</td>
                    <td>
                      <div>{b.date}</div>
                      <div style={{ fontSize: '0.74rem', color: '#1e40af' }}>{b.slot}</div>
                    </td>
                    <td>{b.expectedAudience}</td>
                    <td>
                      <span className={`status-badge ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Department Stationery Requisitions (AO Console) */}
      {activeTab === 'stationary' && (
        <div>
          {/* PENDING STATIONERY SANCTIONS */}
          {pendingStationary.length > 0 && (
            <div className="nec-card" style={{ border: '2px solid #0284c7', background: '#f0f9ff', marginBottom: '28px' }}>
              <div className="nec-card-header" style={{ borderColor: '#bae6fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={22} color="#0369a1" />
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0369a1' }}>
                      Stationery Indents Awaiting AO Sanction ({pendingStationary.length})
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#0284c7' }}>
                      Review department items, approve quantities from Central Store inventory, and issue official Store Sanction Orders.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {pendingStationary.map((req) => (
                  <div
                    key={req._id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: '4px' }}>
                            {req.requisitionNo}
                          </span>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 800, 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            color: req.urgency === 'EXAM_CRITICAL' ? '#991b1b' : req.urgency === 'URGENT' ? '#92400e' : '#166534',
                            background: req.urgency === 'EXAM_CRITICAL' ? '#fee2e2' : req.urgency === 'URGENT' ? '#fef3c7' : '#dcfce7'
                          }}>
                            {req.urgency} PRIORITY
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                          {req.department}
                        </h3>
                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                          Purpose: <strong style={{ color: '#701a75' }}>{req.purpose}</strong> • Initiated by: <strong>{req.requestorName}</strong> ({req.requestorDesignation})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 800, color: '#0369a1' }}>
                          <Calendar size={16} />
                          <span>Required By: {req.requiredByDate}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                          Submitted: {new Date(req.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Department Remarks */}
                    {req.generalRemarks && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '0.82rem' }}>
                        <strong style={{ color: '#475569' }}>Department Justification:</strong> {req.generalRemarks}
                      </div>
                    )}

                    {/* Itemized Requisition & AO Quantity Sanction Schedule */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Requested Stationery Items & Sanction Allocation:
                      </div>

                      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Item & Specifications</th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', width: '140px' }}>Category</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center', width: '110px' }}>Requested Qty</th>
                              <th style={{ padding: '8px 12px', textAlign: 'center', width: '140px', background: '#eff6ff', color: '#1e3a8a' }}>
                                Sanctioned Qty
                              </th>
                              <th style={{ padding: '8px 12px', textAlign: 'left', width: '110px' }}>Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {req.items?.map((item, idx) => {
                              const currentSanctioned = sanctionedQtyMap[req._id]?.[item._id] ?? item.quantityRequested;
                              return (
                                <tr key={item._id || idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                  <td style={{ padding: '8px 12px' }}>
                                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.itemName}</div>
                                    {item.specification && (
                                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.specification}</div>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 12px', color: '#475569', fontSize: '0.78rem' }}>{item.category}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700 }}>
                                    {item.quantityRequested}
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'center', background: '#f8faff' }}>
                                    <input 
                                      type="number"
                                      min="0"
                                      max={item.quantityRequested * 2}
                                      value={currentSanctioned}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setSanctionedQtyMap(prev => ({
                                          ...prev,
                                          [req._id]: {
                                            ...(prev[req._id] || {}),
                                            [item._id]: val
                                          }
                                        }));
                                      }}
                                      style={{
                                        width: '70px',
                                        textAlign: 'center',
                                        padding: '4px',
                                        fontWeight: 800,
                                        border: '1.5px solid #3b82f6',
                                        borderRadius: '6px',
                                        color: '#1e3a8a',
                                        background: '#ffffff'
                                      }}
                                    />
                                  </td>
                                  <td style={{ padding: '8px 12px', color: '#475569' }}>{item.unit}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* AO Instructions to Central Store */}
                    <div style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e3a8a' }}>
                        Administrative Officer (AO) Sanction Remarks & Storekeeper Instructions:
                      </label>
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="e.g. Sanctioned from Central Store inventory. Authorized departmental attender may collect from Room 104."
                        value={statRemarksMap[req._id] ?? 'Sanctioned from Central Store. Collect from Storekeeper (Room 104, Admin Block).'}
                        onChange={(e) => setStatRemarksMap(prev => ({ ...prev, [req._id]: e.target.value }))}
                        style={{ fontSize: '0.85rem', fontWeight: 600 }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={actionLoading === req._id}
                        onClick={() => handleUpdateStationaryStatus(req._id, 'REJECTED')}
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                      >
                        <X size={15} />
                        Reject Requisition
                      </button>

                      <button
                        className="btn btn-sm"
                        disabled={actionLoading === req._id}
                        onClick={() => handleUpdateStationaryStatus(req._id, 'APPROVED')}
                        style={{
                          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px'
                        }}
                      >
                        <Check size={16} />
                        Sanction & Generate Store Order
                      </button>

                      <button
                        className="btn btn-sm"
                        disabled={actionLoading === req._id}
                        onClick={() => handleUpdateStationaryStatus(req._id, 'ISSUED')}
                        style={{
                          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px'
                        }}
                      >
                        <Send size={15} />
                        Sanction & Mark as Store Dispatched
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL STATIONERY REQUISITIONS HISTORY */}
          <div className="nec-card">
            <div className="nec-card-header">
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Central Store Stationery Sanctions & Proceedings Log ({stationaryRequests.length})
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Official records of stationery indent requisitions, stock sanctions, and store issuance vouchers across all departments.
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="nec-table">
                <thead>
                  <tr>
                    <th>Indent & Sanction No</th>
                    <th>Department</th>
                    <th>Purpose & Urgency</th>
                    <th>Stationery Items</th>
                    <th>Required By</th>
                    <th>Status</th>
                    <th>AO Action Details</th>
                    <th>Official Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {stationaryRequests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <code style={{ fontWeight: 800, color: '#1e3a8a' }}>{req.requisitionNo}</code>
                        {req.sanctionOrderNo && (
                          <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                            {req.sanctionOrderNo}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.department}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>By: {req.requestorName}</div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{req.purpose}</div>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 800, 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          color: req.urgency === 'EXAM_CRITICAL' ? '#991b1b' : req.urgency === 'URGENT' ? '#92400e' : '#166534',
                          background: req.urgency === 'EXAM_CRITICAL' ? '#fee2e2' : req.urgency === 'URGENT' ? '#fef3c7' : '#dcfce7'
                        }}>
                          {req.urgency}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.78rem' }}>
                          {req.items?.slice(0, 2).map((it, idx) => (
                            <div key={idx}>
                              <strong>{it.itemName}</strong>: {it.quantitySanctioned ?? it.quantityRequested} {it.unit}
                            </div>
                          ))}
                          {req.items?.length > 2 && (
                            <span style={{ fontSize: '0.7rem', color: '#2563eb' }}>
                              +{req.items.length - 2} more items
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{req.requiredByDate}</div>
                      </td>

                      <td>
                        <span className={`status-badge ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>

                      <td>
                        {req.aoRemarks ? (
                          <div style={{ fontSize: '0.74rem', color: '#475569', maxWidth: '180px' }}>
                            {req.aoRemarks}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Awaiting Action</span>
                        )}
                      </td>

                      <td>
                        {['APPROVED', 'ISSUED'].includes(req.status) ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewingStationaryVoucher(req)}
                            title="Print Store Issue Slip"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
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
          </div>
        </div>
      )}

      {/* TAB 4: Department-Wise Sanctions Report */}
      {activeTab === 'deptSanctionsReport' && (
        <div style={{ marginTop: '16px' }}>
          <AoDepartmentSanctionsReport user={user} />
        </div>
      )}

      <SanctionOrderModal
        isOpen={Boolean(viewingSanction)}
        onClose={() => setViewingSanction(null)}
        request={viewingSanction}
      />

      <StationaryVoucherModal
        isOpen={Boolean(viewingStationaryVoucher)}
        onClose={() => setViewingStationaryVoucher(null)}
        request={viewingStationaryVoucher}
      />
    </div>
  );
}
