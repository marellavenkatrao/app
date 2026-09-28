import React, { useState } from 'react';
import { examinerApi } from '../services/api';
import { X, Utensils, Bed, Coffee, UserPlus, Trash2, Calendar, Shield, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HospitalityModal({ isOpen, onClose, onSuccess }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    purpose: 'End Semester Practical / Lab Examination',
    examSubject: '',
    examDateFrom: tomorrow,
    examDateTo: tomorrow,
    examiners: [
      { name: '', designation: 'Associate Professor', institution: '', phone: '', email: '' }
    ],
    accommodation: {
      required: true,
      roomCount: 1,
      roomType: 'Executive AC Guest Suite',
      checkInDate: tomorrow,
      checkInTime: '08:00 AM',
      checkOutDate: tomorrow,
      checkOutTime: '06:00 PM'
    },
    food: {
      breakfast: {
        required: true,
        count: 2,
        notes: 'South Indian Tiffin & Filter Coffee'
      },
      morningTea: {
        required: true,
        count: 4,
        time: '11:00 AM',
        withSnacks: true
      },
      lunch: {
        required: true,
        count: 4,
        mealType: 'Special Executive Meals',
        vegCount: 3,
        nonVegCount: 1,
        notes: 'Executive lunch at Guest House Dining Hall'
      },
      eveningTea: {
        required: true,
        count: 4,
        time: '04:00 PM',
        withSnacks: true
      },
      dinner: {
        required: false,
        count: 0,
        notes: ''
      }
    },
    conveyance: {
      pickupRequired: false,
      pickupLocation: '',
      pickupTime: '',
      dropRequired: false
    },
    specialInstructions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Add another examiner row
  const addExaminer = () => {
    setFormData(prev => ({
      ...prev,
      examiners: [...prev.examiners, { name: '', designation: 'Professor', institution: '', phone: '', email: '' }]
    }));
  };

  const removeExaminer = (index) => {
    if (formData.examiners.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      examiners: prev.examiners.filter((_, i) => i !== index)
    }));
  };

  const updateExaminer = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.examiners];
      updated[index][field] = value;
      return { ...prev, examiners: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.examSubject.trim()) {
      setError('Please specify the Examination Subject or Lab Course Code');
      return;
    }
    if (!formData.examiners[0].name.trim() || !formData.examiners[0].institution.trim()) {
      setError('Please provide the External Examiner name and institution');
      return;
    }

    setLoading(true);
    try {
      const res = await examinerApi.create(formData);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      if (onSuccess) onSuccess(res.data.request);
      onClose();
    } catch (err) {
      console.error('Failed to submit hospitality requisition', err);
      setError(err.response?.data?.message || 'Error submitting requisition to AO.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '10px', color: '#92400e' }}>
              <Shield size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                External Examiner Requisition to AO
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Submit accommodation, breakfast, tea, and lunch arrangements directly to the Administrative Officer.
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
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            {/* Exam Purpose & Subject */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Examination Purpose *</label>
                <select
                  className="form-select"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <option value="End Semester Practical / Lab Examination">End Semester Practical / Lab Examination</option>
                  <option value="B.Tech Final Project Viva-Voce">B.Tech Final Project Viva-Voce</option>
                  <option value="M.Tech Dissertation Evaluation">M.Tech Dissertation Evaluation</option>
                  <option value="Ph.D. Comprehensive Viva">Ph.D. Comprehensive Viva</option>
                  <option value="Autonomous Academic Council / BoS Meeting">Autonomous BoS / Academic Council Meeting</option>
                  <option value="NBA / NAAC External Audit">NBA / NAAC External Audit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Lab Code & Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Web Development & Cloud Lab (20CS508)"
                  value={formData.examSubject}
                  onChange={(e) => setFormData({ ...formData, examSubject: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Exam Dates */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Exam Date From *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.examDateFrom}
                  onChange={(e) => setFormData({ ...formData, examDateFrom: e.target.value, examDateTo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Exam Date To</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.examDateTo}
                  onChange={(e) => setFormData({ ...formData, examDateTo: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* External Examiners List */}
            <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>
                  External Examiner(s) Information
                </span>
                <button
                  type="button"
                  onClick={addExaminer}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <UserPlus size={13} />
                  Add Examiner
                </button>
              </div>

              {formData.examiners.map((ex, index) => (
                <div key={index} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#701a75' }}>
                      Examiner #{index + 1}
                    </span>
                    {formData.examiners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExaminer(index)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="form-grid-2" style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Examiner Full Name (with Dr./Prof.) *"
                      value={ex.name}
                      onChange={(e) => updateExaminer(index, 'name', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Designation (e.g. Professor)"
                      value={ex.designation}
                      onChange={(e) => updateExaminer(index, 'designation', e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Parent College / University / Organization *"
                      value={ex.institution}
                      onChange={(e) => updateExaminer(index, 'institution', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contact Mobile Number"
                      value={ex.phone}
                      onChange={(e) => updateExaminer(index, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Accommodation Section */}
            <div className="form-group" style={{ border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bed size={18} color="#1e40af" />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e3a8a' }}>
                    Campus Guest House Accommodation
                  </span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                  <input
                    type="checkbox"
                    checked={formData.accommodation.required}
                    onChange={(e) => setFormData({
                      ...formData,
                      accommodation: { ...formData.accommodation, required: e.target.checked }
                    })}
                  />
                  <span>Accommodation Required</span>
                </label>
              </div>

              {formData.accommodation.required && (
                <div className="form-grid-3">
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Room Preference</label>
                    <select
                      className="form-select"
                      value={formData.accommodation.roomType}
                      onChange={(e) => setFormData({
                        ...formData,
                        accommodation: { ...formData.accommodation, roomType: e.target.value }
                      })}
                    >
                      <option value="Executive AC Guest Suite">Executive AC Guest Suite</option>
                      <option value="Deluxe AC Room">Deluxe AC Room</option>
                      <option value="Standard Guest Room">Standard Guest Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Rooms Count</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      max="10"
                      value={formData.accommodation.roomCount}
                      onChange={(e) => setFormData({
                        ...formData,
                        accommodation: { ...formData.accommodation, roomCount: Number(e.target.value) }
                      })}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Check-in & Check-out</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="In: 08:00 AM"
                        value={formData.accommodation.checkInTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          accommodation: { ...formData.accommodation, checkInTime: e.target.value }
                        })}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Out: 06:00 PM"
                        value={formData.accommodation.checkOutTime}
                        onChange={(e) => setFormData({
                          ...formData,
                          accommodation: { ...formData.accommodation, checkOutTime: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Food, Breakfast, Tea & Lunch Section */}
            <div className="form-group" style={{ border: '1px solid #fed7aa', background: '#fff7ed', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Utensils size={18} color="#c2410c" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#9a3412' }}>
                  Hospitality, Breakfast, Tea & Lunch Arrangements
                </span>
              </div>

              {/* Breakfast */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fed7aa' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.food.breakfast.required}
                    onChange={(e) => setFormData({
                      ...formData,
                      food: {
                        ...formData.food,
                        breakfast: { ...formData.food.breakfast, required: e.target.checked }
                      }
                    })}
                  />
                  <span>1. Morning Breakfast (South Indian Tiffin & Coffee)</span>
                </label>
                {formData.food.breakfast.required && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Persons:</span>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '70px', padding: '4px 8px' }}
                      min="1"
                      value={formData.food.breakfast.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        food: {
                          ...formData.food,
                          breakfast: { ...formData.food.breakfast, count: Number(e.target.value) }
                        }
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Morning Tea */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fed7aa' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.food.morningTea.required}
                    onChange={(e) => setFormData({
                      ...formData,
                      food: {
                        ...formData.food,
                        morningTea: { ...formData.food.morningTea, required: e.target.checked }
                      }
                    })}
                  />
                  <span>2. Morning Tea / Coffee & Cookies (11:00 AM)</span>
                </label>
                {formData.food.morningTea.required && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Count:</span>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '70px', padding: '4px 8px' }}
                      min="1"
                      value={formData.food.morningTea.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        food: {
                          ...formData.food,
                          morningTea: { ...formData.food.morningTea, count: Number(e.target.value) }
                        }
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Executive Lunch */}
              <div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', marginBottom: '8px', border: '1.5px solid #ea580c' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.88rem', color: '#9a3412', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.food.lunch.required}
                      onChange={(e) => setFormData({
                        ...formData,
                        food: {
                          ...formData.food,
                          lunch: { ...formData.food.lunch, required: e.target.checked }
                        }
                      })}
                    />
                    <span>3. Executive Lunch (Special Meals)</span>
                  </label>
                  {formData.food.lunch.required && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Total Meals:</span>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '70px', padding: '4px 8px' }}
                        min="1"
                        value={formData.food.lunch.count}
                        onChange={(e) => setFormData({
                          ...formData,
                          food: {
                            ...formData.food,
                            lunch: { ...formData.food.lunch, count: Number(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  )}
                </div>

                {formData.food.lunch.required && (
                  <div className="form-grid-3" style={{ fontSize: '0.82rem' }}>
                    <div>
                      <label style={{ display: 'block', color: '#475569', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                      <select
                        className="form-select"
                        style={{ padding: '6px' }}
                        value={formData.food.lunch.mealType}
                        onChange={(e) => setFormData({
                          ...formData,
                          food: {
                            ...formData.food,
                            lunch: { ...formData.food.lunch, mealType: e.target.value }
                          }
                        })}
                      >
                        <option value="Special Executive Meals">Special Executive Meals</option>
                        <option value="South Indian Full Meals">South Indian Full Meals</option>
                        <option value="North Indian Thali">North Indian Thali</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#15803d', fontWeight: 700, marginBottom: '4px' }}>Veg Meals</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ padding: '6px' }}
                        min="0"
                        value={formData.food.lunch.vegCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          food: {
                            ...formData.food,
                            lunch: { ...formData.food.lunch, vegCount: Number(e.target.value) }
                          }
                        })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#b91c1c', fontWeight: 700, marginBottom: '4px' }}>Non-Veg Meals</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ padding: '6px' }}
                        min="0"
                        value={formData.food.lunch.nonVegCount}
                        onChange={(e) => setFormData({
                          ...formData,
                          food: {
                            ...formData.food,
                            lunch: { ...formData.food.lunch, nonVegCount: Number(e.target.value) }
                          }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Evening Tea */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', marginBottom: '8px', border: '1px solid #fed7aa' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.86rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.food.eveningTea.required}
                    onChange={(e) => setFormData({
                      ...formData,
                      food: {
                        ...formData.food,
                        eveningTea: { ...formData.food.eveningTea, required: e.target.checked }
                      }
                    })}
                  />
                  <span>4. Evening Tea / Coffee & Hot Snacks (04:00 PM)</span>
                </label>
                {formData.food.eveningTea.required && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Count:</span>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '70px', padding: '4px 8px' }}
                      min="1"
                      value={formData.food.eveningTea.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        food: {
                          ...formData.food,
                          eveningTea: { ...formData.food.eveningTea, count: Number(e.target.value) }
                        }
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Dinner (Optional) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.86rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.food.dinner.required}
                    onChange={(e) => setFormData({
                      ...formData,
                      food: {
                        ...formData.food,
                        dinner: { ...formData.food.dinner, required: e.target.checked }
                      }
                    })}
                  />
                  <span>5. Dinner (In case of overnight stay)</span>
                </label>
                {formData.food.dinner.required && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Persons:</span>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: '70px', padding: '4px 8px' }}
                      min="1"
                      value={formData.food.dinner.count}
                      onChange={(e) => setFormData({
                        ...formData,
                        food: {
                          ...formData.food,
                          dinner: { ...formData.food.dinner, count: Number(e.target.value) }
                        }
                      })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Special notes for AO */}
            <div className="form-group">
              <label className="form-label">Special Requisition Instructions for Administrative Officer (AO)</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Mention train arrival timing, vehicle pickup requirement, or special dietary requirements."
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting to AO...' : 'Submit Requisition to AO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
