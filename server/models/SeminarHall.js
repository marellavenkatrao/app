const mongoose = require('mongoose');

const seminarHallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  block: { type: String, required: true },
  capacity: { type: Number, required: true },
  coordinator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  coordinatorName: { type: String, required: true },
  coordinatorPhone: { type: String, default: '' },
  coordinatorEmail: { type: String, default: '' },
  facilities: [{ type: String }],
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SeminarHall', seminarHallSchema);
