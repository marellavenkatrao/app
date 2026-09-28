const mongoose = require('mongoose');

const stationaryItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Paper & Sheets', 
      'Fasteners & Desktop', 
      'Writing Instruments', 
      'Filing & Folders', 
      'Registers & Pads', 
      'General Stationery'
    ],
    default: 'General Stationery'
  },
  quantityRequested: { type: Number, required: true, min: 1 },
  quantitySanctioned: { type: Number, default: null },
  unit: { 
    type: String, 
    enum: ['Reams (500 Sheets)', 'Boxes', 'Pieces / Nos', 'Packets', 'Dozens', 'Sets', 'Rolls'],
    default: 'Pieces / Nos' 
  },
  specification: { type: String, default: '' }
}, { _id: true });

const stationaryRequestSchema = new mongoose.Schema({
  requisitionNo: { type: String, unique: true },
  department: { type: String, required: true },
  requestedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestorName: { type: String, required: true },
  requestorDesignation: { type: String, default: 'Head of Department' },
  purpose: { 
    type: String, 
    required: true,
    enum: [
      'End Semester Examinations',
      'Mid-Term Examinations & Evaluation',
      'Laboratory & Practical Records',
      'NBA / NAAC Accreditation Documentation',
      'Faculty & Department Administration',
      'Workshop / Seminar / Conference',
      'General Departmental Use'
    ],
    default: 'General Departmental Use'
  },
  urgency: { 
    type: String, 
    enum: ['ROUTINE', 'URGENT', 'EXAM_CRITICAL'], 
    default: 'ROUTINE' 
  },
  requiredByDate: { type: String, required: true }, // YYYY-MM-DD
  items: [stationaryItemSchema],
  generalRemarks: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'ISSUED'], 
    default: 'PENDING' 
  },
  aoOfficer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  aoRemarks: { type: String, default: '' },
  sanctionOrderNo: { type: String, default: '' },
  actionDate: { type: Date, default: null },
  dispatchedAt: { type: Date, default: null }
}, { timestamps: true });

// Auto-generate unique requisition number: NEC-AO-STAT-YYYY-XXXX
stationaryRequestSchema.pre('save', async function(next) {
  if (!this.requisitionNo) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.requisitionNo = `NEC-AO-STAT-${new Date().getFullYear()}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('StationaryRequest', stationaryRequestSchema);
