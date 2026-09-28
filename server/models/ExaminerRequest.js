const mongoose = require('mongoose');

const examinerRequestSchema = new mongoose.Schema({
  requisitionNo: { type: String, unique: true },
  hod: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hodName: { type: String, required: true },
  department: { type: String, required: true },
  purpose: { 
    type: String, 
    required: true,
    enum: [
      'B.Tech Final Project Viva-Voce',
      'End Semester Practical / Lab Examination',
      'M.Tech Dissertation Evaluation',
      'Ph.D. Comprehensive Viva',
      'Autonomous Academic Council / BoS Meeting',
      'NBA / NAAC External Audit',
      'Other External Academic Examination'
    ],
    default: 'End Semester Practical / Lab Examination'
  },
  examSubject: { type: String, required: true },
  examDateFrom: { type: String, required: true }, // YYYY-MM-DD
  examDateTo: { type: String, required: true },   // YYYY-MM-DD
  examiners: [{
    name: { type: String, required: true },
    designation: { type: String, default: 'Associate Professor' },
    institution: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' }
  }],
  accommodation: {
    required: { type: Boolean, default: true },
    roomCount: { type: Number, default: 1 },
    roomType: { 
      type: String, 
      enum: ['Executive AC Guest Suite', 'Deluxe AC Room', 'Standard Guest Room'],
      default: 'Executive AC Guest Suite' 
    },
    checkInDate: { type: String, default: '' },
    checkInTime: { type: String, default: '08:00 AM' },
    checkOutDate: { type: String, default: '' },
    checkOutTime: { type: String, default: '06:00 PM' },
    allocatedRoom: { type: String, default: 'Pending AO Allocation' }
  },
  food: {
    breakfast: {
      required: { type: Boolean, default: true },
      count: { type: Number, default: 2 },
      notes: { type: String, default: 'South Indian Breakfast with Coffee/Tea' }
    },
    morningTea: {
      required: { type: Boolean, default: true },
      count: { type: Number, default: 4 },
      time: { type: String, default: '11:00 AM' },
      withSnacks: { type: Boolean, default: true }
    },
    lunch: {
      required: { type: Boolean, default: true },
      count: { type: Number, default: 4 },
      mealType: { 
        type: String, 
        enum: ['Special Executive Meals', 'South Indian Full Meals', 'North Indian Thali'],
        default: 'Special Executive Meals' 
      },
      vegCount: { type: Number, default: 3 },
      nonVegCount: { type: Number, default: 1 },
      notes: { type: String, default: '' }
    },
    eveningTea: {
      required: { type: Boolean, default: true },
      count: { type: Number, default: 4 },
      time: { type: String, default: '04:00 PM' },
      withSnacks: { type: Boolean, default: true }
    },
    dinner: {
      required: { type: Boolean, default: false },
      count: { type: Number, default: 0 },
      notes: { type: String, default: '' }
    }
  },
  conveyance: {
    pickupRequired: { type: Boolean, default: false },
    pickupLocation: { type: String, default: '' },
    pickupTime: { type: String, default: '' },
    dropRequired: { type: Boolean, default: false }
  },
  specialInstructions: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  aoOfficer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  aoRemarks: { type: String, default: '' },
  sanctionOrderNo: { type: String, default: '' },
  actionDate: { type: Date, default: null }
}, { timestamps: true });

// Auto-generate requisition number
examinerRequestSchema.pre('save', async function(next) {
  if (!this.requisitionNo) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.requisitionNo = `NEC-AO-REQ-${new Date().getFullYear()}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('ExaminerRequest', examinerRequestSchema);
