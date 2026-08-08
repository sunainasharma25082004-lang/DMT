export interface FallbackService {
  _id?: string;
  serviceId: string;
  title: string;
  categoryId: string;
  categoryName: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  duration: string;
  included: string[];
  cities: string[];
}

export interface FallbackBooking {
  _id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  serviceTitle: string;
  category: string;
  price: number;
  timeSlot: string;
  status: string;
  technicianId?: string;
  technicianName?: string;
  otpCode: string;
  createdAt: string;
  proofPhotoUri?: string;
}

export interface FallbackTechnician {
  _id: string;
  proId: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  rating: number;
  completedJobs: number;
  isOnline: boolean;
  bgvStatus: string;
  todaysEarnings: number;
  totalEarnings: number;
  upiId: string;
  aadhaarNumber: string;
  panNumber: string;
  skills: string[];
}

export interface FallbackUser {
  _id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  role: string;
}

export interface FallbackApplication {
  _id: string;
  appCode: string;
  applicantName: string;
  phone: string;
  email: string;
  category: string;
  city: string;
  experienceYears: number;
  aadhaarNumber: string;
  panNumber: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface FallbackCoupon {
  _id: string;
  code: string;
  discount: string;
  maxDiscount: string;
  validTill: string;
  uses: number;
}

export interface FallbackTicket {
  _id: string;
  ticketId: string;
  customerName: string;
  subject: string;
  category: string;
  status: string;
  createdAt: string;
}

class FallbackStore {
  public services: FallbackService[] = [
    {
      _id: 'srv-101',
      serviceId: 'full-home-deep',
      title: 'Full Home Deep Cleaning',
      categoryId: 'cleaning',
      categoryName: 'Deep Cleaning',
      price: 2499,
      rating: 4.9,
      reviewCount: 2840,
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1400&q=90',
      badge: 'BEST SELLER',
      description: 'Complete deep cleaning of every room, kitchen chimney, and scrubbing.',
      duration: '4-5 hrs',
      included: ['Scrubbing', 'Sanitization', 'Kitchen chimney clean'],
      cities: ['Delhi', 'Mumbai', 'Bengaluru'],
    },
    {
      _id: 'srv-102',
      serviceId: 'ac-repair',
      title: 'AC Repair & Service',
      categoryId: 'appliance',
      categoryName: 'Appliance Repair',
      price: 499,
      rating: 4.8,
      reviewCount: 3200,
      image: 'https://images.unsplash.com/photo-1631545806609-c5626c09fcad?w=900&q=80',
      badge: 'POPULAR',
      description: 'Gas check, filter clean, cooling inspection, and full service.',
      duration: '1-2 hrs',
      included: ['Filter clean', 'Gas check', 'Condenser wash'],
      cities: ['Delhi', 'Mumbai', 'Pune', 'Bengaluru'],
    },
    {
      _id: 'srv-103',
      serviceId: 'sofa-cleaning',
      title: 'Premium Sofa & Carpet Cleaning',
      categoryId: 'cleaning',
      categoryName: 'Deep Cleaning',
      price: 899,
      rating: 4.7,
      reviewCount: 1420,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
      badge: 'HIGHLY RATED',
      description: 'Shampooing and foam extraction for 3+2 sofa sets and carpets.',
      duration: '2-3 hrs',
      included: ['Vacuuming', 'Foam shampoo', 'Stain extraction'],
      cities: ['Mumbai', 'Delhi', 'Bengaluru'],
    },
    {
      _id: 'srv-104',
      serviceId: 'plumbing-repair',
      title: 'Plumbing Leakage & Tap Fix',
      categoryId: 'plumbing',
      categoryName: 'Plumbing',
      price: 299,
      rating: 4.85,
      reviewCount: 1980,
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80',
      description: 'Quick resolution for leaking pipes, drain blockages, and tap replacements.',
      duration: '45 mins',
      included: ['Leak inspection', 'Tap replacement', 'Drain clear'],
      cities: ['Delhi', 'Mumbai', 'Kolkata', 'Chennai'],
    },
  ];

  public bookings: FallbackBooking[] = [
    {
      _id: 'bkg-101',
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
      createdAt: new Date().toISOString(),
    },
  ];

  public technicians: FallbackTechnician[] = [
    {
      _id: 'tech-101',
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
      _id: 'tech-102',
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
  ];

  public users: FallbackUser[] = [
    { _id: 'usr-101', name: 'Rohan Deshmukh', phone: '+91 98765 43210', email: 'rohan.d@email.com', city: 'Mumbai', role: 'CUSTOMER' },
    { _id: 'usr-102', name: 'Priya Sharma', phone: '+91 98100 12345', email: 'priya.s@email.com', city: 'New Delhi', role: 'CUSTOMER' },
    { _id: 'usr-103', name: 'Vikram Admin', phone: '+91 99999 00000', email: 'vikram.admin@dmt.com', city: 'Mumbai', role: 'ADMIN' },
  ];

  public applications: FallbackApplication[] = [
    {
      _id: 'app-901',
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
      createdAt: new Date().toISOString(),
    },
  ];

  public coupons: FallbackCoupon[] = [
    { _id: 'cpn-101', code: 'WELCOME50', discount: '50% OFF', maxDiscount: '₹200', validTill: '31 Aug 2026', uses: 1420 },
    { _id: 'cpn-102', code: 'DEEP40', discount: 'Flat ₹400 OFF', maxDiscount: '₹400', validTill: '15 Aug 2026', uses: 890 },
  ];

  public tickets: FallbackTicket[] = [
    { _id: 'tck-101', ticketId: 'TCK-101', customerName: 'Rohan Deshmukh', subject: 'Delay in technician arrival', category: 'General', status: 'OPEN', createdAt: new Date().toISOString() },
  ];
}

export const fallbackStore = new FallbackStore();
