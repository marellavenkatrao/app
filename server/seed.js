const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const SeminarHall = require('./models/SeminarHall');
const HallBooking = require('./models/HallBooking');
const ExaminerRequest = require('./models/ExaminerRequest');
const StationaryRequest = require('./models/StationaryRequest');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nec_portal';

async function seed() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected.');

    // Clear existing collections
    await User.deleteMany({});
    await SeminarHall.deleteMany({});
    await HallBooking.deleteMany({});
    await ExaminerRequest.deleteMany({});
    await StationaryRequest.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    const defaultPassword = await bcrypt.hash('nec@123', 10);

    // 1. Create Coordinators
    const coord1 = await User.create({
      name: 'Dr. S.N Tirumalarao',
      email: 'tirumalarao.b2@nec.edu.in',
      password: defaultPassword,
      role: 'COORDINATOR',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Coordinator - Block-2 Seminar Hall',
      phone: '+91 94401 23456'
    });

    const coord2 = await User.create({
      name: 'Dr. M.VenkataRao',
      email: 'venkatarao.b3@nec.edu.in',
      password: defaultPassword,
      role: 'COORDINATOR',
      department: 'Electronics & Communication Engineering',
      designation: 'Professor & Coordinator - Block-3 Seminar Hall',
      phone: '+91 94402 34567'
    });

    const coord3 = await User.create({
      name: 'Dr. S.Sunil',
      email: 'sunil.b4@nec.edu.in',
      password: defaultPassword,
      role: 'COORDINATOR',
      department: 'Mechanical Engineering',
      designation: 'Associate Professor & Coordinator - Block-4 Seminar Hall',
      phone: '+91 94403 45678'
    });

    // 2. Create the 3 Seminar Halls
    const hall1 = await SeminarHall.create({
      name: 'Block-2 Seminar Hall',
      code: 'BLOCK-2',
      block: 'Block-2',
      capacity: 250,
      coordinator: coord1._id,
      coordinatorName: 'Dr. S.N Tirumalarao',
      coordinatorPhone: '+91 94401 23456',
      coordinatorEmail: 'tirumalarao.b2@nec.edu.in',
      location: 'Ground Floor, Block-2 (Main Admin & CSE Wing)',
      description: 'Air-conditioned seminar hall equipped with high-lumen laser projector, motorized screen, JBL surround audio, podium mic, and wireless lapel mics. Ideal for workshops and guest lectures.',
      facilities: ['Centralized AC', 'High-Lumen Projector', 'JBL Sound System', 'Smart Podium & Mic', 'High-Speed Wi-Fi', 'Motorized Screen']
    });

    const hall2 = await SeminarHall.create({
      name: 'Block-3 Seminar Hall',
      code: 'BLOCK-3',
      block: 'Block-3',
      capacity: 320,
      coordinator: coord2._id,
      coordinatorName: 'Dr. M.VenkataRao',
      coordinatorPhone: '+91 94402 34567',
      coordinatorEmail: 'venkatarao.b3@nec.edu.in',
      location: 'First Floor, Block-3 (ECE & EEE Wing)',
      description: 'Modern digital hall with interactive LED video wall, video conferencing setup, tiered executive cushioned seating, and advanced acoustic design.',
      facilities: ['Centralized AC', 'Interactive LED Video Wall', 'Polycom Video Conferencing', 'Acoustic Wall Paneling', 'Dual Wireless Mics', 'Recording Camera']
    });

    const hall3 = await SeminarHall.create({
      name: 'Block-4 Seminar Hall',
      code: 'BLOCK-4',
      block: 'Block-4',
      capacity: 450,
      coordinator: coord3._id,
      coordinatorName: 'Dr. S.Sunil',
      coordinatorPhone: '+91 94403 45678',
      coordinatorEmail: 'sunil.b4@nec.edu.in',
      location: 'Second Floor, Block-4 (Mechanical & Civil Wing)',
      description: 'Grand auditorium-style seminar hall with elevated stage, large seating capacity, theatrical stage lighting, green room, and powerful digital public address system.',
      facilities: ['Centralized AC', 'Stage & Theatrical Lighting', 'Dual Projectors', 'Auditorium Seating', 'Digital Audio Mixer', 'Backstage Facility']
    });

    // Update coordinators with assigned hall references
    coord1.assignedHall = hall1._id;
    await coord1.save();
    coord2.assignedHall = hall2._id;
    await coord2.save();
    coord3.assignedHall = hall3._id;
    await coord3.save();

    // 3. Create Department HODs
    const hodCse = await User.create({
      name: 'Dr. K. Rajesh',
      email: 'hod.cse@nec.edu.in',
      password: defaultPassword,
      role: 'HOD',
      department: 'Computer Science & Engineering (CSE)',
      designation: 'Professor & Head of Department - CSE',
      phone: '+91 98480 11223'
    });

    const hodEce = await User.create({
      name: 'Dr. P. Lakshman',
      email: 'hod.ece@nec.edu.in',
      password: defaultPassword,
      role: 'HOD',
      department: 'Electronics & Communication Engg (ECE)',
      designation: 'Professor & Head of Department - ECE',
      phone: '+91 98480 22334'
    });

    const hodEee = await User.create({
      name: 'Dr. V. Suresh',
      email: 'hod.eee@nec.edu.in',
      password: defaultPassword,
      role: 'HOD',
      department: 'Electrical & Electronics Engg (EEE)',
      designation: 'Professor & Head of Department - EEE',
      phone: '+91 98480 33445'
    });

    const hodMech = await User.create({
      name: 'Dr. N. Ramesh',
      email: 'hod.mech@nec.edu.in',
      password: defaultPassword,
      role: 'HOD',
      department: 'Mechanical Engineering (MECH)',
      designation: 'Professor & Head of Department - MECH',
      phone: '+91 98480 44556'
    });

    // 4. Create Administrative Officer (AO)
    const aoUser = await User.create({
      name: 'Sri K. Srinivasa Rao',
      email: 'ao@nec.edu.in',
      password: defaultPassword,
      role: 'AO',
      department: 'Administrative Office',
      designation: 'Administrative Officer (AO)',
      phone: '+91 94400 99887'
    });

    console.log('[Seed] Created Users, Coordinators, Halls, and AO.');

    // 5. Create Sample Hall Bookings
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

    // Approved booking in Block-2
    await HallBooking.create({
      bookingId: 'NEC-SH-2026-1001',
      hall: hall1._id,
      hallName: hall1.name,
      hod: hodCse._id,
      hodName: hodCse.name,
      department: hodCse.department,
      eventName: 'National Workshop on Generative AI & Cloud Architecture',
      eventType: 'Workshop',
      date: today,
      slot: 'FN',
      startTime: '09:30 AM',
      endTime: '12:30 PM',
      expectedAudience: 180,
      chiefGuest: 'Mr. B. Satyanarayana, Principal Architect, TCS Hyderabad',
      requirements: {
        projector: true,
        soundSystem: true,
        airConditioning: true,
        podiumMic: true,
        videoRecording: true,
        specialArrangements: 'High bandwidth Wi-Fi for 150 student laptops'
      },
      status: 'APPROVED',
      coordinator: coord1._id,
      coordinatorRemarks: 'Slot confirmed. Lab assistants notified for Wi-Fi setup.',
      actionDate: new Date(),
      passNumber: 'NEC/SH-PASS/2026/1001',
      passSentToHod: true,
      passSentAt: new Date(),
      coordinatorSignature: 'Dr. S.N Tirumalarao (Professor & Coordinator - Block-2)'
    });

    // Pending booking in Block-2 for Dr. S.N Tirumalarao to approve!
    await HallBooking.create({
      bookingId: 'NEC-SH-2026-1002',
      hall: hall1._id,
      hallName: hall1.name,
      hod: hodCse._id,
      hodName: hodCse.name,
      department: hodCse.department,
      eventName: 'Full Stack Web Development Boot Camp with React & Node',
      eventType: 'Workshop',
      date: tomorrow,
      slot: 'FULL_DAY',
      startTime: '09:30 AM',
      endTime: '04:30 PM',
      expectedAudience: 200,
      chiefGuest: 'Dr. Anand Kumar, Tech Lead, Infosys',
      requirements: {
        projector: true,
        soundSystem: true,
        airConditioning: true,
        podiumMic: true,
        videoRecording: false,
        specialArrangements: 'Arrangement of 6 power extension boards for student teams'
      },
      status: 'PENDING',
      coordinator: coord1._id
    });

    // Pending booking in Block-3 for Dr. M.VenkataRao to approve!
    await HallBooking.create({
      bookingId: 'NEC-SH-2026-1003',
      hall: hall2._id,
      hallName: hall2.name,
      hod: hodEce._id,
      hodName: hodEce.name,
      department: hodEce.department,
      eventName: 'VLSI Chip Design Trends & Embedded IoT Systems Expo',
      eventType: 'Conference',
      date: dayAfter,
      slot: 'FN',
      startTime: '09:30 AM',
      endTime: '12:30 PM',
      expectedAudience: 240,
      chiefGuest: 'Prof. K. Rama Krishna, IIT Hyderabad',
      requirements: {
        projector: true,
        soundSystem: true,
        airConditioning: true,
        podiumMic: true,
        videoRecording: true,
        specialArrangements: 'Video wall configuration for live FPGA board output'
      },
      status: 'PENDING',
      coordinator: coord2._id
    });

    // Pending booking in Block-4 for Dr. S.Sunil to approve!
    await HallBooking.create({
      bookingId: 'NEC-SH-2026-1004',
      hall: hall3._id,
      hallName: hall3.name,
      hod: hodMech._id,
      hodName: hodMech.name,
      department: hodMech.department,
      eventName: 'Industry 4.0 & Electric Mobility National Seminar',
      eventType: 'Guest Lecture',
      date: tomorrow,
      slot: 'AN',
      startTime: '01:30 PM',
      endTime: '04:30 PM',
      expectedAudience: 350,
      chiefGuest: 'Sri P. Venkateswara Rao, GM, Hyundai Motors',
      requirements: {
        projector: true,
        soundSystem: true,
        airConditioning: true,
        podiumMic: true,
        videoRecording: true,
        specialArrangements: 'Stage display for prototype EV chassis model'
      },
      status: 'PENDING',
      coordinator: coord3._id
    });

    // 6. Create Sample Examiner Hospitality Requests to AO
    // Request 1: Pending for AO to approve
    await ExaminerRequest.create({
      requisitionNo: 'NEC-AO-REQ-2026-081',
      hod: hodCse._id,
      hodName: hodCse.name,
      department: hodCse.department,
      purpose: 'End Semester Practical / Lab Examination',
      examSubject: 'Advanced Data Structures & Algorithms Lab (20CS301)',
      examDateFrom: tomorrow,
      examDateTo: tomorrow,
      examiners: [
        {
          name: 'Dr. C. H. Satyanarayana',
          designation: 'Professor, Dept of CSE',
          institution: 'JNTUK University College of Engineering, Kakinada',
          phone: '+91 98491 55667',
          email: 'ch.satya@jntuk.edu.in'
        },
        {
          name: 'Dr. K. Srinivas Rao',
          designation: 'Associate Professor',
          institution: 'Acharya Nagarjuna University, Guntur',
          phone: '+91 98492 66778',
          email: 'ksrao@anu.edu.in'
        }
      ],
      accommodation: {
        required: true,
        roomCount: 2,
        roomType: 'Executive AC Guest Suite',
        checkInDate: tomorrow,
        checkInTime: '08:00 AM',
        checkOutDate: tomorrow,
        checkOutTime: '06:30 PM',
        allocatedRoom: 'Pending AO Allocation'
      },
      food: {
        breakfast: {
          required: true,
          count: 3,
          notes: 'Idli, Vada, Upma with Filter Coffee at Guest House'
        },
        morningTea: {
          required: true,
          count: 5,
          time: '11:00 AM',
          withSnacks: true
        },
        lunch: {
          required: true,
          count: 5,
          mealType: 'Special Executive Meals',
          vegCount: 4,
          nonVegCount: 1,
          notes: 'Special Executive Meals with Sweets and Ice cream at Guest House Dining'
        },
        eveningTea: {
          required: true,
          count: 5,
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
        pickupRequired: true,
        pickupLocation: 'Narasaraopet Railway Station (Morning 07:30 AM)',
        pickupTime: '07:30 AM',
        dropRequired: true
      },
      specialInstructions: 'Examiners traveling by express train. College vehicle requested for station pickup.',
      status: 'PENDING'
    });

    // Request 2: Approved by AO
    await ExaminerRequest.create({
      requisitionNo: 'NEC-AO-REQ-2026-075',
      hod: hodEce._id,
      hodName: hodEce.name,
      department: hodEce.department,
      purpose: 'B.Tech Final Project Viva-Voce',
      examSubject: 'Major Project Evaluation & Comprehensive Viva (20EC801)',
      examDateFrom: today,
      examDateTo: today,
      examiners: [
        {
          name: 'Prof. Y. Rama Rao',
          designation: 'Professor & Head',
          institution: 'Andhra University College of Engineering, Visakhapatnam',
          phone: '+91 94411 77889',
          email: 'yr_rao@andhrauniversity.edu.in'
        }
      ],
      accommodation: {
        required: true,
        roomCount: 1,
        roomType: 'Executive AC Guest Suite',
        checkInDate: today,
        checkInTime: '07:45 AM',
        checkOutDate: today,
        checkOutTime: '07:00 PM',
        allocatedRoom: 'Suite 101 - VVIP Executive Suite, Guest House'
      },
      food: {
        breakfast: {
          required: true,
          count: 2,
          notes: 'Continental & South Indian Breakfast'
        },
        morningTea: {
          required: true,
          count: 4,
          time: '11:15 AM',
          withSnacks: true
        },
        lunch: {
          required: true,
          count: 4,
          mealType: 'Special Executive Meals',
          vegCount: 3,
          nonVegCount: 1,
          notes: 'Arranged in Executive Dining Hall'
        },
        eveningTea: {
          required: true,
          count: 4,
          time: '04:15 PM',
          withSnacks: true
        },
        dinner: {
          required: true,
          count: 2,
          notes: 'Light dinner before train departure'
        }
      },
      conveyance: {
        pickupRequired: false,
        pickupLocation: '',
        pickupTime: '',
        dropRequired: true
      },
      specialInstructions: 'Return train departs at 08:30 PM from Guntur.',
      status: 'APPROVED',
      aoOfficer: aoUser._id,
      aoRemarks: 'Suite 101 allotted. Canteen supervisor instructed to serve executive lunch in guest dining hall.',
      sanctionOrderNo: 'NEC/AO/SANCT/2026/039',
      actionDate: new Date()
    });

    // Seed Department Stationary Requisitions (HOD -> AO)
    // 1. CSE Department: PENDING Exam Critical Requisition
    await StationaryRequest.create({
      requisitionNo: 'NEC-AO-STAT-2026-1042',
      department: hodCse.department,
      requestedBy: hodCse._id,
      requestorName: hodCse.name,
      requestorDesignation: hodCse.designation,
      purpose: 'End Semester Examinations',
      urgency: 'EXAM_CRITICAL',
      requiredByDate: today,
      items: [
        {
          itemName: 'A4 Copier Paper Sheets (75 GSM)',
          category: 'Paper & Sheets',
          quantityRequested: 20,
          quantitySanctioned: null,
          unit: 'Reams (500 Sheets)',
          specification: 'JK Copier or Century Star (Bright White, 75 GSM)'
        },
        {
          itemName: 'Heavy Duty Stapler (No. 10)',
          category: 'Fasteners & Desktop',
          quantityRequested: 8,
          quantitySanctioned: null,
          unit: 'Pieces / Nos',
          specification: 'Kangaro HD-10D or equivalent'
        },
        {
          itemName: 'Stapler Pin Boxes (No. 10)',
          category: 'Fasteners & Desktop',
          quantityRequested: 15,
          quantitySanctioned: null,
          unit: 'Boxes',
          specification: 'Kangaro No. 10 (1000 staples per box)'
        },
        {
          itemName: 'HB Writing & Drawing Pencils',
          category: 'Writing Instruments',
          quantityRequested: 5,
          quantitySanctioned: null,
          unit: 'Boxes',
          specification: 'Apsara Platinum Extra Dark HB (Pack of 10)'
        },
        {
          itemName: 'Whiteboard Markers Assorted (Black, Blue, Red, Green)',
          category: 'Writing Instruments',
          quantityRequested: 10,
          quantitySanctioned: null,
          unit: 'Sets',
          specification: 'Camlin Whiteboard Marker 4-color set'
        }
      ],
      generalRemarks: 'Urgent requirement for Autonomous End Semester Examinations starting this week. Required for exam cell and student seating halls.',
      status: 'PENDING'
    });

    // 2. ECE Department: APPROVED Requisition
    await StationaryRequest.create({
      requisitionNo: 'NEC-AO-STAT-2026-1018',
      department: hodEce.department,
      requestedBy: hodEce._id,
      requestorName: hodEce.name,
      requestorDesignation: hodEce.designation,
      purpose: 'NBA / NAAC Accreditation Documentation',
      urgency: 'URGENT',
      requiredByDate: today,
      items: [
        {
          itemName: 'A4 Copier Paper Sheets (75 GSM)',
          category: 'Paper & Sheets',
          quantityRequested: 10,
          quantitySanctioned: 10,
          unit: 'Reams (500 Sheets)',
          specification: '75 GSM Multipurpose Paper'
        },
        {
          itemName: 'Lever Arch Box Files (Index Files)',
          category: 'Filing & Folders',
          quantityRequested: 25,
          quantitySanctioned: 25,
          unit: 'Pieces / Nos',
          specification: 'Heavy duty hardboard file with spring clip'
        },
        {
          itemName: 'Heavy Duty 2-Hole Punching Machine',
          category: 'Fasteners & Desktop',
          quantityRequested: 3,
          quantitySanctioned: 3,
          unit: 'Pieces / Nos',
          specification: 'Kangaro DP-600 heavy duty'
        },
        {
          itemName: 'Practical Record Registers (200 Pages)',
          category: 'Registers & Pads',
          quantityRequested: 12,
          quantitySanctioned: 12,
          unit: 'Pieces / Nos',
          specification: 'Hard bound ruled registers'
        }
      ],
      generalRemarks: 'Required for compilation of Criteria-3 and Criteria-4 Course Outcome dossiers.',
      status: 'APPROVED',
      aoOfficer: aoUser._id,
      aoRemarks: 'Sanctioned from Central Store. Authorized representative may collect from Storekeeper (Room 104, Admin Block).',
      sanctionOrderNo: 'NEC/AO/STAT/2026/018',
      actionDate: new Date()
    });

    // 3. MECH Department: ISSUED Requisition
    await StationaryRequest.create({
      requisitionNo: 'NEC-AO-STAT-2026-1005',
      department: hodMech.department,
      requestedBy: hodMech._id,
      requestorName: hodMech.name,
      requestorDesignation: hodMech.designation,
      purpose: 'Laboratory & Practical Records',
      urgency: 'ROUTINE',
      requiredByDate: today,
      items: [
        {
          itemName: 'Engineering Drawing A3 Paper Bundles',
          category: 'Paper & Sheets',
          quantityRequested: 6,
          quantitySanctioned: 6,
          unit: 'Packets',
          specification: 'A3 Cartridge 130 GSM drawing sheets'
        },
        {
          itemName: '2B / 4B Technical Drawing Pencils',
          category: 'Writing Instruments',
          quantityRequested: 4,
          quantitySanctioned: 4,
          unit: 'Boxes',
          specification: 'Staedtler / Faber-Castell Drawing Pencils'
        }
      ],
      generalRemarks: 'For CAD/CAM and Engineering Graphics practical drafting sessions.',
      status: 'ISSUED',
      aoOfficer: aoUser._id,
      aoRemarks: 'Dispatched to Mechanical Department Lab Storekeeper Sri V. Prasad.',
      sanctionOrderNo: 'NEC/AO/STAT/2026/005',
      actionDate: new Date(Date.now() - 86400000),
      dispatchedAt: new Date()
    });

    console.log('[Seed] Successfully seeded sample bookings, examiner hospitality requests, and stationary requisitions.');
    console.log('[Seed] Database initialization complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
}

seed();
