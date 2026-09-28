import React, { useState, useEffect } from 'react';
import { bookingApi, hallApi } from '../services/api';
import { X, Calendar, Clock, Building2, User, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({ isOpen, onClose, preselectedHall, preselectedDate, onSuccess }) {
  const [halls, setHalls] = useState([]);
  const [formData, setFormData] = useState({
    hallId: '',
    eventName: '',
    eventType: 'Guest Lecture',
    date: preselectedDate || new Date().toISOString().split('T')[0],
    slot: 'FN',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    expectedAudience: 150,
    chiefGuest: '',
    requirements: {
      projector: true,
      soundSystem: true,
      airConditioning: true,
      podiumMic: true,
      videoRecording: false,
      specialArrangements: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHallInfo, setSelectedHallInfo] = useState(null);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await hallApi.getHalls();
        const loaded = res.data.halls || [];
        setHalls(loaded);

        if (preselectedHall) {
          const match = loaded.find(h => 
            h._id === (preselectedHall.hallId || preselectedHall._id) || 
            h.code === preselectedHall.code
          ) || preselectedHall;
          const hid = match._id || match.hallId;
          setFormData(prev => ({ ...prev, hallId: hid, date: preselectedDate || prev.date }));
          setSelectedHallInfo(match);
        } else if (loaded.length > 0) {
          setFormData(prev => ({ ...prev, hallId: loaded[0]._id, date: preselectedDate || prev.date }));
          setSelectedHallInfo(loaded[0]);
        }
      } catch (err) {
        console.error('Failed to load halls in modal', err);
      }
    };

    if (isOpen) {
      fetchHalls();
    }
  }, [isOpen, preselectedHall, preselectedDate]);

  if (!isOpen) return null;

  const handleSlotChange = (slot) => {
    let start = '09:30 AM';
    let end = '12:30 PM';
    if (slot === 'AN') {
      start = '01:30 PM';
      end = '04:30 PM';
    } else if (slot === 'FULL_DAY') {
      start = '09:30 AM';
      end = '04:30 PM';
    }
    setFormData(prev => ({ ...prev, slot, startTime: start, endTime: end }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.hallId) {
      setError('Please select a Seminar Hall (Block-2, Block-3, or Block-4)');
      return;
    }
    if (!formData.eventName.trim()) {
      setError('Please provide the Event Title');
      return;
    }

    setLoading(true);
    try {
      const res = await bookingApi.create(formData);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onSuccess) onSuccess(res.data.booking);
      onClose();
    } catch (err) {
      console.error('Booking submission error', err);
      setError(err.response?.data?.message || 'Failed to place booking request. Please check if slot is already occupied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={22} color="#701a75" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Seminar Hall Booking Requisition
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Request submission directly routes to the designated Seminar Hall Coordinator.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Hall Selection */}
            <div className="form-group">
              <label className="form-label">Select Seminar Hall & Coordinator *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {(halls.length > 0 ? halls : [
                  { _id: 'BLOCK-2', code: 'BLOCK-2', name: 'Block-2 Seminar Hall', coordinatorName: 'Dr. S.N Tirumalarao', capacity: 250 },
                  { _id: 'BLOCK-3', code: 'BLOCK-3', name: 'Block-3 Seminar Hall', coordinatorName: 'Dr. M.VenkataRao', capacity: 320 },
                  { _id: 'BLOCK-4', code: 'BLOCK-4', name: 'Block-4 Seminar Hall', coordinatorName: 'Dr. S.Sunil', capacity: 450 }
                ]).map((h) => {
                  const isSelected = formData.hallId === h._id || formData.hallId === h.code || selectedHallInfo?.code === h.code;
                  return (
                    <div
                      key={h.code}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, hallId: h._id || h.code }));
                        setSelectedHallInfo(h);
                      }}
                      style={{
                        border: isSelected ? '2px solid #701a75' : '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '12px',
                        background: isSelected ? '#faf5ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#701a75' : '#1e293b' }}>
                        {h.code} Hall
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                        Coord: <strong style={{ color: '#0f172a' }}>{h.coordinatorName || h.coordinator?.name || 'Assigned Coordinator'}</strong>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: '2px' }}>
                        Cap: {h.capacity} Pax
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event Name */}
            <div className="form-group">
              <label className="form-label">Event / Activity Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. National Level Technical Symposium / Faculty Development Program"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                required
              />
            </div>

            {/* Event Type & Audience */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Event Category</label>
                <select
                  className="form-select"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                >
                  <option value="Guest Lecture">Guest Lecture</option>
                  <option value="Workshop">Hands-on Workshop</option>
                  <option value="Conference">National / International Conference</option>
                  <option value="Faculty Development Program">Faculty Development Program (FDP)</option>
                  <option value="Student Seminar">Student Seminar / Paper Presentation</option>
                  <option value="Placement / Technical Talk">Placement / Corporate Technical Talk</option>
                  <option value="Department Association">Department Association Inauguration</option>
                  <option value="Other">Other Institutional Event</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expected Audience (Number of Persons)</label>
                <input
                  type="number"
                  className="form-input"
                  min="10"
                  max="500"
                  value={formData.expectedAudience}
                  onChange={(e) => setFormData({ ...formData, expectedAudience: e.target.value })}
                />
              </div>
            </div>

            {/* Date & Slot selection */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Date of Event *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.slot === 'FN' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSlotChange('FN')}
                  >
                    Forenoon (FN)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.slot === 'AN' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSlotChange('AN')}
                  >
                    Afternoon (AN)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.slot === 'FULL_DAY' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleSlotChange('FULL_DAY')}
                  >
                    Full Day
                  </button>
                </div>
              </div>
            </div>

            {/* Chief Guest */}
            <div className="form-group">
              <label className="form-label">Chief Guest / Resource Person (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. K. Satyanarayana, Senior Scientist, ISRO"
                value={formData.chiefGuest}
                onChange={(e) => setFormData({ ...formData, chiefGuest: e.target.value })}
              />
            </div>

            {/* Audio-Visual & Equipment Requirements */}
            <div className="form-group">
              <label className="form-label">Required Hall Facilities & Equipment</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requirements.projector}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements, projector: e.target.checked }
                    })}
                  />
                  <span>Laser Projector & Screen</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requirements.soundSystem}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements, soundSystem: e.target.checked }
                    })}
                  />
                  <span>JBL Surround Sound & Mics</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requirements.airConditioning}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements, airConditioning: e.target.checked }
                    })}
                  />
                  <span>Central Air Conditioning (AC)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.requirements.podiumMic}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: { ...formData.requirements, podiumMic: e.target.checked }
                    })}
                  />
                  <span>Podium Mic + Collar Mic</span>
                </label>
              </div>
            </div>

            {/* Special arrangements textarea */}
            <div className="form-group">
              <label className="form-label">Special Arrangements / Notes</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Additional requirements like banner display, stage flower arrangement, power extension boards, etc."
                value={formData.requirements.specialArrangements}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: { ...formData.requirements, specialArrangements: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting to Coordinator...' : 'Submit Requisition to Coordinator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
