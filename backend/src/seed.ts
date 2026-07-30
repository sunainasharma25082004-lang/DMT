import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { User } from './models/User';
import { Technician } from './models/Technician';
import { Application } from './models/Application';
import { Service } from './models/Service';
import { Booking } from './models/Booking';
import { Ticket } from './models/Ticket';
import { Coupon } from './models/Coupon';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Technician.deleteMany({});
    await Application.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Ticket.deleteMany({});
    await Coupon.deleteMany({});

    console.log('🌱 Seeding production Indian datasets...');

    // Seed Users
    await User.insertMany([
      { name: 'Rohan Deshmukh', phone: '+91 98765 43210', email: 'rohan.d@email.com', city: 'Mumbai', role: 'CUSTOMER' },
      { name: 'Priya Sharma', phone: '+91 98100 12345', email: 'priya.s@email.com', city: 'New Delhi', role: 'CUSTOMER' },
      { name: 'Vikram Admin', phone: '+91 99999 00000', email: 'vikram.admin@dmt.com', city: 'Mumbai', role: 'ADMIN' },
    ]);

    // Seed Technicians
    await Technician.insertMany([
      {
        proId: 'PRO-101',
        name: 'Ramesh Kumar',
        phone: '+91 98765 12345',
        email: 'ramesh.pro@dmt.com',
        category: 'AC Repair & Service',
        city: 'New Delhi',
        rating: 4.9,
        completedJobs: 142,
        isOnline: true,
        bgvStatus: 'VERIFIED',
        todaysEarnings: 3450,
        totalEarnings: 84200,
        upiId: 'rameshkumar@okaxis',
        aadhaarNumber: 'XXXX-XXXX-1122',
        panNumber: 'FGHIJ5678L',
        skills: ['Split AC Repair', 'Window AC Service', 'Gas Refill'],
      },
      {
        proId: 'PRO-102',
        name: 'Amit Singh',
        phone: '+91 98112 23344',
        email: 'amit.plumber@dmt.com',
        category: 'Plumbing',
        city: 'Mumbai',
        rating: 4.8,
        completedJobs: 98,
        isOnline: true,
        bgvStatus: 'VERIFIED',
        todaysEarnings: 1800,
        totalEarnings: 56400,
        upiId: 'amitsingh@ybl',
        aadhaarNumber: 'XXXX-XXXX-3344',
        panNumber: 'KLMNO9012P',
        skills: ['Pipe Fitting', 'Bathroom Leakage'],
      },
    ]);

    // Seed Applications
    await Application.insertMany([
      {
        appCode: 'APP-901',
        applicantName: 'Suresh Kumar',
        phone: '+91 98234 56789',
        email: 'suresh.ac@gmail.com',
        category: 'AC Repair & Service',
        city: 'New Delhi',
        experienceYears: 5,
        aadhaarNumber: 'XXXX-XXXX-4589',
        panNumber: 'ABCDE1234F',
        status: 'PENDING',
        notes: '5+ years experience at Voltas service center.',
      },
    ]);

    // Seed Services
    await Service.insertMany([
      {
        serviceId: 'full-home-deep',
        title: 'Full Home Deep Cleaning',
        categoryId: 'cleaning',
        categoryName: 'Deep Cleaning',
        price: 2499,
        rating: 4.9,
        reviewCount: 2840,
        image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1400&q=90',
        badge: 'BEST SELLER',
        description: 'Complete deep cleaning of every room.',
        duration: '4-5 hrs',
        included: ['Scrubbing', 'Sanitization', 'Kitchen chimney clean'],
        cities: ['Delhi', 'Mumbai', 'Bengaluru'],
      },
      {
        serviceId: 'ac-repair',
        title: 'AC Repair & Service',
        categoryId: 'appliance',
        categoryName: 'Appliance',
        price: 499,
        rating: 4.8,
        reviewCount: 3200,
        image: 'https://images.unsplash.com/photo-1631545806609-c5626c09fcad?w=900&q=80',
        badge: 'POPULAR',
        description: 'Gas check, filter clean, and full service.',
        duration: '1-2 hrs',
        included: ['Filter clean', 'Gas check'],
        cities: ['Delhi', 'Mumbai', 'Pune'],
      },
    ]);

    // Seed Bookings
    await Booking.insertMany([
      {
        bookingCode: 'DMT-88421',
        customerName: 'Rohan Deshmukh',
        customerPhone: '+91 98765 43210',
        customerAddress: 'Flat 402, Horizon Heights, Andheri West',
        city: 'Mumbai',
        serviceTitle: 'Full Home Deep Cleaning',
        category: 'Cleaning',
        price: 2499,
        timeSlot: 'Today, 04:00 PM',
        status: 'ASSIGNED',
        technicianId: 'PRO-101',
        technicianName: 'Ramesh Kumar',
        otpCode: '4829',
      },
    ]);

    // Seed Coupons
    await Coupon.insertMany([
      { code: 'WELCOME50', discount: '50% OFF', maxDiscount: '₹200', validTill: '31 Aug 2026', uses: 1420 },
      { code: 'DEEP40', discount: 'Flat ₹400 OFF', maxDiscount: '₹400', validTill: '15 Aug 2026', uses: 890 },
    ]);

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Error:', err);
    process.exit(1);
  }
};

seedData();
