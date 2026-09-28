const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HallBooking = require('../models/HallBooking');
const SeminarHall = require('../models/SeminarHall');
const { authMiddleware } = require('../middleware/auth');

// Create a hall booking request (HOD)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      hallId,
      eventName,
      eventType,
      date,
      slot,
      startTime,
      endTime,
      expectedAudience,
      chiefGuest,
      requirements
    } = req.body;

    if (!hallId || !eventName || !date || !slot) {
      return res.status(400).json({ message: 'Please provide all required booking fields (Hall, Event Name, Date, Slot)' });
    }

    // Robust Hall Lookup (by ObjectId, Code 'BLOCK-2', or shorthand 'b2')
    let hall = null;
    if (mongoose.isValidObjectId(hallId)) {
      hall = await SeminarHall.findById(hallId);
    }
    
    if (!hall) {
      const codeStr = hallId.toString().trim().toUpperCase();
      const normalizedCode = codeStr.startsWith('BLOCK-') ? codeStr : `BLOCK-${codeStr.replace(/[^0-9]/g, '')}`;
      hall = await SeminarHall.findOne({
        $or: [
          { code: codeStr },
          { code: normalizedCode },
          { name: new RegExp(codeStr.replace('-', ' '), 'i') }
        ]
      });
    }

    if (!hall) {
      return res.status(404).json({ message: 'Seminar hall not found. Please select Block-2, Block-3, or Block-4.' });
    }

    const resolvedHallId = hall._id;

    // Clash detection: check if an APPROVED booking exists for this hall on this date for conflicting slot
    const slotConflictConditions = [
      { slot: slot },
      { slot: 'FULL_DAY' }
    ];
    if (slot === 'FULL_DAY') {
      slotConflictConditions.push({ slot: 'FN' }, { slot: 'AN' });
    }

    const conflict = await HallBooking.findOne({
      hall: resolvedHallId,
      date: date,
      status: 'APPROVED',
      $or: slotConflictConditions
    });

    if (conflict) {
      return res.status(409).json({ 
        message: `Seminar Hall is already booked and approved for '${conflict.eventName}' (${conflict.slot}) on ${date}`,
        conflict
      });
    }

    const newBooking = new HallBooking({
      hall: resolvedHallId,
      hallName: hall.name,
      hod: req.user._id,
      hodName: req.user.name,
      department: req.user.department || 'General',
      eventName,
      eventType: eventType || 'Guest Lecture',
      date,
      slot,
      startTime: startTime || (slot === 'FN' ? '09:30 AM' : slot === 'AN' ? '01:30 PM' : '09:30 AM'),
      endTime: endTime || (slot === 'FN' ? '12:30 PM' : slot === 'AN' ? '04:30 PM' : '04:30 PM'),
      expectedAudience: Number(expectedAudience) || 100,
      chiefGuest: chiefGuest || '',
      requirements: requirements || {
        projector: true,
        soundSystem: true,
        airConditioning: true,
        podiumMic: true,
        videoRecording: false,
        specialArrangements: ''
      },
      status: 'PENDING',
      coordinator: hall.coordinator
    });

    await newBooking.save();
    res.status(201).json({ 
      message: `Booking request successfully submitted to Coordinator (${hall.coordinatorName})`, 
      booking: newBooking 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating hall booking', error: err.message });
  }
});

// Get bookings with role-based filtering
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, hallId, date } = req.query;
    let query = {};

    if (status) query.status = status;
    if (hallId) query.hall = hallId;
    if (date) query.date = date;

    if (req.user.role === 'HOD') {
      // HOD sees their own department's requests
      query.hod = req.user._id;
    } else if (req.user.role === 'COORDINATOR') {
      // Coordinator sees requests for their assigned hall
      if (req.user.assignedHall) {
        query.hall = req.user.assignedHall._id || req.user.assignedHall;
      }
    }
    // AO and Admin can view all bookings

    const bookings = await HallBooking.find(query)
      .populate('hall')
      .populate('hod', 'name email department phone')
      .populate('coordinator', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving bookings', error: err.message });
  }
});

// Get single booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await HallBooking.findById(req.params.id)
      .populate('hall')
      .populate('hod', 'name email department phone')
      .populate('coordinator', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving booking details', error: err.message });
  }
});

// Approve or Reject booking (Coordinator)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, coordinatorRemarks } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be APPROVED or REJECTED' });
    }

    const booking = await HallBooking.findById(req.params.id).populate('hall');
    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    // Check permissions: only coordinator of this hall or AO/Admin
    if (req.user.role === 'COORDINATOR') {
      const userAssignedHallId = (req.user.assignedHall?._id || req.user.assignedHall || '').toString();
      const bookingHallId = (booking.hall?._id || booking.hall).toString();
      if (userAssignedHallId !== bookingHallId) {
        return res.status(403).json({ message: 'You are only authorized to review bookings for your assigned Seminar Hall' });
      }
    } else if (req.user.role !== 'AO') {
      return res.status(403).json({ message: 'Only Seminar Hall Coordinators or AO can approve or reject bookings' });
    }

    // If approving, re-check for clashes to ensure safety
    if (status === 'APPROVED') {
      const slotConflictConditions = [
        { slot: booking.slot },
        { slot: 'FULL_DAY' }
      ];
      if (booking.slot === 'FULL_DAY') {
        slotConflictConditions.push({ slot: 'FN' }, { slot: 'AN' });
      }

      const existingApproval = await HallBooking.findOne({
        _id: { $ne: booking._id },
        hall: booking.hall._id || booking.hall,
        date: booking.date,
        status: 'APPROVED',
        $or: slotConflictConditions
      });

      if (existingApproval) {
        return res.status(409).json({ 
          message: `Cannot approve: Hall is already confirmed for '${existingApproval.eventName}' on ${booking.date}`,
          existingApproval 
        });
      }
    }

    booking.status = status;
    booking.coordinatorRemarks = coordinatorRemarks || (status === 'APPROVED' ? 'Approved by Seminar Hall Coordinator.' : 'Regret to inform, slot unavailable or reserved.');
    booking.actionDate = new Date();
    booking.coordinator = req.user._id;

    if (status === 'APPROVED') {
      const serial = Math.floor(1000 + Math.random() * 9000);
      booking.passNumber = `NEC/SH-PASS/${new Date().getFullYear()}/${serial}`;
      booking.passSentToHod = true;
      booking.passSentAt = new Date();
      booking.passViewedByHod = false;
      booking.coordinatorSignature = `${req.user.name} (${req.user.designation || 'Coordinator'})`;
    }

    await booking.save();

    res.json({ 
      message: status === 'APPROVED' 
        ? `Booking approved! Official Seminar Hall Pass (${booking.passNumber}) has been dispatched to ${booking.hodName}'s login.`
        : `Booking request declined.`, 
      booking 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking status', error: err.message });
  }
});

// Acknowledge / View Pass (HOD)
router.put('/:id/acknowledge-pass', authMiddleware, async (req, res) => {
  try {
    const booking = await HallBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking pass not found' });
    }
    booking.passViewedByHod = true;
    await booking.save();
    res.json({ message: 'Pass acknowledged', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error acknowledging pass', error: err.message });
  }
});

module.exports = router;
