import React, { useState } from 'react';
import { stationaryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  Package,
  Layers,
  Edit3,
  BookmarkPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_CATALOG = [
  { itemName: 'A4 Copier Paper Sheets (75 GSM)', category: 'Paper & Sheets', unit: 'Reams (500 Sheets)', defaultQty: 10, specification: 'JK Copier / Century Star (75 GSM Bright White)' },
  { itemName: 'Heavy Duty Stapler (No. 10)', category: 'Fasteners & Desktop', unit: 'Pieces / Nos', defaultQty: 4, specification: 'Kangaro HD-10D or equivalent' },
  { itemName: 'Stapler Pin Boxes (No. 10)', category: 'Fasteners & Desktop', unit: 'Boxes', defaultQty: 10, specification: 'Kangaro No. 10 (1000 pins/box)' },
  { itemName: 'HB Writing & Drawing Pencils', category: 'Writing Instruments', unit: 'Boxes', defaultQty: 5, specification: 'Apsara Platinum Extra Dark HB (Pack of 10)' },
  { itemName: 'Whiteboard Markers Assorted (Black, Blue, Red, Green)', category: 'Writing Instruments', unit: 'Sets', defaultQty: 8, specification: 'Camlin / Luxor 4-Color Assorted Set' },
  { itemName: 'Blue & Black Ballpoint Pens', category: 'Writing Instruments', unit: 'Packets', defaultQty: 6, specification: 'Reynolds / Cello 0.7mm (Pack of 20)' },
  { itemName: 'Lever Arch Box Files (Hardbound)', category: 'Filing & Folders', unit: 'Pieces / Nos', defaultQty: 15, specification: 'Office lever arch file with index clip' },
  { itemName: 'Practical & Attendance Registers (200 Pgs)', category: 'Registers & Pads', unit: 'Pieces / Nos', defaultQty: 10, specification: 'Hardcover bound ledger ruled' },
  { itemName: 'Heavy Duty 2-Hole Punch Machine', category: 'Fasteners & Desktop', unit: 'Pieces / Nos', defaultQty: 2, specification: 'Kangaro DP-600 heavy duty' },
  { itemName: 'Whiteboard Foam Dusters', category: 'General Stationery', unit: 'Pieces / Nos', defaultQty: 6, specification: 'Magnetic felt duster with marker holder' },
  { itemName: 'Sticky Notes / Post-It Pads (3x3")', category: 'General Stationery', unit: 'Packets', defaultQty: 5, specification: 'Yellow 100 sheets pad' },
  { itemName: 'Engineering Drawing A3 Paper Sheets', category: 'Paper & Sheets', unit: 'Packets', defaultQty: 5, specification: 'A3 Cartridge 130 GSM drawing sheets' }
];

export default function StationaryRequisitionModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();

  const getFutureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [purpose, setPurpose] = useState('End Semester Examinations');
  const [urgency, setUrgency] = useState('ROUTINE');
  const [requiredByDate, setRequiredByDate] = useState(getFutureDate(3));
  const [generalRemarks, setGeneralRemarks] = useState('');
  
  // Items list
  const [items, setItems] = useState([
    {
      itemName: 'A4 Copier Paper Sheets (75 GSM)',
      category: 'Paper & Sheets',
      quantityRequested: 10,
      unit: 'Reams (500 Sheets)',
      specification: 'JK Copier / Century Star (75 GSM Bright White)'
    },
    {
      itemName: 'Heavy Duty Stapler (No. 10)',
      category: 'Fasteners & Desktop',
      quantityRequested: 4,
      unit: 'Pieces / Nos',
      specification: 'Kangaro HD-10D or equivalent'
    },
    {
      itemName: 'Stapler Pin Boxes (No. 10)',
      category: 'Fasteners & Desktop',
      quantityRequested: 8,
      unit: 'Boxes',
      specification: 'Kangaro No. 10'
    },
    {
      itemName: 'HB Writing & Drawing Pencils',
      category: 'Writing Instruments',
      quantityRequested: 5,
      unit: 'Boxes',
      specification: 'Apsara Platinum Extra Dark'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddItemFromCatalog = (catalogItem) => {
    // Check if already in list
    const existingIndex = items.findIndex(i => i.itemName.toLowerCase() === catalogItem.itemName.toLowerCase());
    if (existingIndex >= 0) {
      // Increment quantity
      const updated = [...items];
      updated[existingIndex].quantityRequested += catalogItem.defaultQty;
      setItems(updated);
    } else {
      setItems([...items, {
        itemName: catalogItem.itemName,
        category: catalogItem.category,
        quantityRequested: catalogItem.defaultQty,
        unit: catalogItem.unit,
        specification: catalogItem.specification
      }]);
    }
  };

  const handleAddCustomItem = () => {
    setItems([...items, {
      itemName: '',
      category: 'General Stationery',
      quantityRequested: 1,
      unit: 'Pieces / Nos',
      specification: ''
    }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      alert('At least one stationery item is required in the requisition.');
      return;
    }
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const validItems = items.filter(i => i.itemName.trim().length > 0 && i.quantityRequested > 0);
    if (validItems.length === 0) {
      setError('Please provide at least one valid stationery item name and quantity.');
      return;
    }

    if (!requiredByDate) {
      setError('Please select the date by which stationery is required.');
      return;
    }

    setLoading(true);
    try {
      await stationaryApi.create({
        purpose,
        urgency,
        requiredByDate,
        items: validItems,
        generalRemarks
      });

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit stationery requisition', err);
      setError(err.response?.data?.message || 'Failed to submit requisition to AO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '920px', 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', 
          color: '#ffffff', 
          padding: '20px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '2px solid #3b82f6'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                background: '#fde047', 
                color: '#713f12', 
                padding: '2px 8px', 
                borderRadius: '6px', 
                fontSize: '0.72rem', 
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                Department Indent
              </span>
              <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                Central Store & Administrative Officer (AO)
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={22} color="#60a5fa" />
              Department Stationery Requisition
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ 
              background: '#fee2e2', 
              border: '1px solid #f87171', 
              color: '#991b1b', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem'
            }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form id="stationary-form" onSubmit={handleSubmit}>
            {/* Requester Profile Strip */}
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '10px', 
              padding: '12px 18px', 
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.86rem'
            }}>
              <div>
                <span style={{ color: '#64748b' }}>Requesting Department:</span>{' '}
                <strong style={{ color: '#0f172a' }}>{user?.department || 'Department Office'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Initiated By:</span>{' '}
                <strong style={{ color: '#701a75' }}>{user?.name}</strong> ({user?.role})
              </div>
            </div>

            {/* Purpose, Urgency & Date Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Academic Purpose / Requirement:
                </label>
                <select 
                  className="form-control"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  style={{ height: '42px', fontWeight: 600 }}
                  required
                >
                  <option value="End Semester Examinations">End Semester Examinations</option>
                  <option value="Mid-Term Examinations & Evaluation">Mid-Term Examinations & Evaluation</option>
                  <option value="Laboratory & Practical Records">Laboratory & Practical Records</option>
                  <option value="NBA / NAAC Accreditation Documentation">NBA / NAAC Accreditation Documentation</option>
                  <option value="Faculty & Department Administration">Faculty & Department Administration</option>
                  <option value="Workshop / Seminar / Conference">Workshop / Seminar / Conference</option>
                  <option value="General Departmental Use">General Departmental Use</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Urgency / Priority Level:
                </label>
                <select 
                  className="form-control"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={{ 
                    height: '42px', 
                    fontWeight: 700,
                    color: urgency === 'EXAM_CRITICAL' ? '#b91c1c' : urgency === 'URGENT' ? '#b45309' : '#15803d',
                    backgroundColor: urgency === 'EXAM_CRITICAL' ? '#fef2f2' : urgency === 'URGENT' ? '#fffbeb' : '#f0fdf4'
                  }}
                  required
                >
                  <option value="ROUTINE">🟢 Routine (Within 3-5 Working Days)</option>
                  <option value="URGENT">🟡 Urgent (Needed in 24-48 Hours)</option>
                  <option value="EXAM_CRITICAL">🔴 Exam Critical (Immediate Dispatch Required)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Required By Date:
                </label>
                <input 
                  type="date"
                  className="form-control"
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ height: '42px', fontWeight: 600 }}
                  required
                />
              </div>
            </div>

            {/* Quick Catalog Bar */}
            <div style={{ 
              background: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '12px', 
              padding: '16px', 
              marginBottom: '22px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: '#0369a1' }}>
                  <BookmarkPlus size={16} />
                  <span>Quick-Add from Central Store Standard Catalog:</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#0284c7' }}>Click item to add or increment</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POPULAR_CATALOG.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddItemFromCatalog(cat)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #7dd3fc',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#0369a1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#e0f2fe'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                  >
                    <Plus size={13} />
                    <span>{cat.itemName}</span>
                    <span style={{ background: '#f0f9ff', color: '#0284c7', fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px' }}>
                      +{cat.defaultQty}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Itemized Requisition Table */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    Requisition Items List ({items.length})
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Specified for Administrative Officer Sanction
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1e3a8a', borderColor: '#bfdbfe' }}
                >
                  <Plus size={14} />
                  Add Custom Item
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: '#ffffff', 
                      border: '1.5px solid #e2e8f0', 
                      borderRadius: '10px', 
                      padding: '12px 16px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 140px 100px 140px 36px',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Item Name & Spec */}
                    <div>
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="Stationery Item Name (e.g., A4 Paper, Stapler, Pencils)..."
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        style={{ fontWeight: 700, fontSize: '0.88rem', height: '36px' }}
                        required
                      />
                      <input 
                        type="text"
                        className="form-control"
                        placeholder="Specification / Brand (e.g., Century Star 75 GSM, Kangaro No. 10)"
                        value={item.specification}
                        onChange={(e) => handleItemChange(index, 'specification', e.target.value)}
                        style={{ fontSize: '0.76rem', color: '#475569', height: '28px', marginTop: '4px' }}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <select 
                        className="form-control"
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        style={{ fontSize: '0.8rem', height: '36px' }}
                      >
                        <option value="Paper & Sheets">Paper & Sheets</option>
                        <option value="Fasteners & Desktop">Fasteners & Desktop</option>
                        <option value="Writing Instruments">Writing Instruments</option>
                        <option value="Filing & Folders">Filing & Folders</option>
                        <option value="Registers & Pads">Registers & Pads</option>
                        <option value="General Stationery">General Stationery</option>
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'quantityRequested', Math.max(1, (Number(item.quantityRequested) || 1) - 1))}
                          style={{ padding: '4px 8px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          min="1"
                          className="form-control"
                          value={item.quantityRequested}
                          onChange={(e) => handleItemChange(index, 'quantityRequested', Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ textAlign: 'center', border: 'none', height: '34px', fontWeight: 800, padding: '2px', width: '50px' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'quantityRequested', (Number(item.quantityRequested) || 1) + 1)}
                          style={{ padding: '4px 8px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Unit */}
                    <div>
                      <select 
                        className="form-control"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        style={{ fontSize: '0.8rem', height: '36px' }}
                      >
                        <option value="Reams (500 Sheets)">Reams (500 Sheets)</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Pieces / Nos">Pieces / Nos</option>
                        <option value="Packets">Packets</option>
                        <option value="Dozens">Dozens</option>
                        <option value="Sets">Sets</option>
                        <option value="Rolls">Rolls</option>
                      </select>
                    </div>

                    {/* Remove Action */}
                    <div style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="btn btn-sm"
                        style={{ color: '#ef4444', padding: '6px', border: 'none', background: 'transparent' }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Remarks / Notes for AO */}
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Department Remarks & Justification for Administrative Officer (AO):
              </label>
              <textarea 
                className="form-control"
                rows="2"
                placeholder="Specific course codes, lab batches, or examination dates for justification..."
                value={generalRemarks}
                onChange={(e) => setGeneralRemarks(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div style={{ 
          background: '#f8fafc', 
          borderTop: '1px solid #e2e8f0', 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Will be transmitted directly to AO for inventory allocation and official Sanction Order.
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="stationary-form"
              className="btn"
              disabled={loading}
              style={{ 
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', 
                color: '#ffffff', 
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px'
              }}
            >
              {loading ? (
                <>Submitting Requisition...</>
              ) : (
                <>
                  <Sparkles size={16} color="#fde047" />
                  Submit Requisition to AO
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
