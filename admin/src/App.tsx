import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  CalendarCheck,
  CreditCard,
  Megaphone,
  Headphones,
  BarChart3,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  DollarSign,
  UserCheck,
  Plus,
  Lock,
  MessageSquare,
  FileText,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';

import {
  sharedStore,
  ProviderApplication,
  Technician,
  AdminBooking,
  AdminTicket,
} from './data/sharedData';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'users'
    | 'professionals'
    | 'services'
    | 'bookings'
    | 'payments'
    | 'marketing'
    | 'support'
    | 'reports'
    | 'settings'
  >('dashboard');

  // Shared store reactive state
  const [applications, setApplications] = useState<ProviderApplication[]>(sharedStore.getApplications());
  const [technicians, setTechnicians] = useState<Technician[]>(sharedStore.getTechnicians());
  const [bookings, setBookings] = useState<AdminBooking[]>(sharedStore.getBookings());
  const [tickets, setTickets] = useState<AdminTicket[]>(sharedStore.getTickets());

  useEffect(() => {
    const unsubscribe = sharedStore.subscribe(() => {
      setApplications([...sharedStore.getApplications()]);
      setTechnicians([...sharedStore.getTechnicians()]);
      setBookings([...sharedStore.getBookings()]);
      setTickets([...sharedStore.getTickets()]);
    });
    return unsubscribe;
  }, []);

  // Application Approval Modal State
  const [selectedApp, setSelectedApp] = useState<ProviderApplication | null>(null);
  const [genPassword, setGenPassword] = useState('');

  // User Management State
  const [userSearch, setUserSearch] = useState('');
  const [customersList, setCustomersList] = useState([
    { id: 'CUST-101', name: 'Rohan Deshmukh', phone: '+91 98765 43210', city: 'Mumbai', bookings: 24, status: 'ACTIVE', complaints: 0 },
    { id: 'CUST-102', name: 'Priya Sharma', phone: '+91 98100 12345', city: 'New Delhi', bookings: 12, status: 'ACTIVE', complaints: 1 },
    { id: 'CUST-103', name: 'Ananya Verma', phone: '+91 98991 22334', city: 'Bengaluru', bookings: 8, status: 'ACTIVE', complaints: 2 },
    { id: 'CUST-104', name: 'Rajesh Gupta', phone: '+91 97112 00998', city: 'Pune', bookings: 2, status: 'BLOCKED', complaints: 4 },
  ]);

  // Categories State
  const [categoryList, setCategoryList] = useState([
    { id: 'cat1', name: 'Full Home Deep Cleaning', category: 'Cleaning', price: 2499, duration: '4 hrs', cities: ['Delhi', 'Mumbai', 'Bengaluru'] },
    { id: 'cat2', name: 'AC Repair & Service', category: 'Appliance', price: 499, duration: '1.5 hrs', cities: ['Delhi', 'Mumbai', 'Pune'] },
    { id: 'cat3', name: 'Bathroom Sanitation', category: 'Cleaning', price: 699, duration: '1 hr', cities: ['Delhi', 'Mumbai', 'Bengaluru', 'Pune'] },
    { id: 'cat4', name: 'Salon Luxe at Home', category: 'Beauty', price: 1499, duration: '2 hrs', cities: ['Delhi', 'Mumbai'] },
  ]);

  // Marketing Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'WELCOME50', discount: '50% OFF', maxDiscount: '₹200', validTill: '31 Aug 2026', uses: 1420 },
    { code: 'DEEP40', discount: 'Flat ₹400 OFF', maxDiscount: '₹400', validTill: '15 Aug 2026', uses: 890 },
  ]);

  const handleApproveApplication = (appId: string) => {
    const password = `DMT#${Math.floor(1000 + Math.random() * 9000)}`;
    setGenPassword(password);
    sharedStore.updateApplicationStatus(appId, 'APPROVED', password);
    alert(`Application Approved! 🎉\nIssued Technician Login Credentials:\nID: ${appId}\nPassword: ${password}\n\nCandidate has been added to Active Professionals roster!`);
    setSelectedApp(null);
  };

  const handleRejectApplication = (appId: string) => {
    sharedStore.updateApplicationStatus(appId, 'REJECTED');
    alert('Application Rejected.');
    setSelectedApp(null);
  };

  const toggleBlockCustomer = (id: string) => {
    setCustomersList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' } : c))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050507' }}>
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0a0a0e',
          borderRight: '1px solid #1f1f2e',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Logo Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                border: '1.5px solid #8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={22} color="#a78bfa" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0 }}>DMT Control</h2>
              <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700 }}>SUPER ADMIN PANEL</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Customer Management', icon: Users },
              {
                id: 'professionals',
                label: 'Partner Applications',
                icon: Briefcase,
                badge: applications.filter((a) => a.status === 'PENDING').length,
              },
              { id: 'services', label: 'Services & Pricing', icon: Layers },
              { id: 'bookings', label: 'Live Bookings', icon: CalendarCheck },
              { id: 'payments', label: 'Payouts & Revenue', icon: CreditCard },
              { id: 'marketing', label: 'Marketing & Coupons', icon: Megaphone },
              { id: 'support', label: 'Helpdesk & Tickets', icon: Headphones },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Admin Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isActive ? '#8b5cf6' : 'transparent',
                    color: isActive ? '#fff' : '#9ca3af',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#fff' : '#9ca3af'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span
                      style={{
                        backgroundColor: isActive ? '#fff' : '#ef4444',
                        color: isActive ? '#8b5cf6' : '#fff',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div
          style={{
            padding: '12px',
            backgroundColor: '#111116',
            borderRadius: '12px',
            border: '1px solid #22222e',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src="https://i.pravatar.cc/100?img=60"
            alt="Admin"
            style={{ width: '36px', height: '36px', borderRadius: '18px', border: '1.5px solid #8b5cf6' }}
          />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Vikram Admin</div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>vikram.head@dmt.com</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Executive Overview</h1>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                  Real-time analytics across Customer App, Service Provider App & Transactions
                </p>
              </div>
              <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '12px' }}>
                LIVE DATA SYNC • INDIA REGION
              </span>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>
                  <span>TOTAL REVENUE</span>
                  <DollarSign size={18} color="#8b5cf6" />
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '10px 0 4px' }}>₹1,84,500</div>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>+18.4% vs last month</div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>
                  <span>TOTAL BOOKINGS</span>
                  <CalendarCheck size={18} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '10px 0 4px' }}>1,420</div>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>98.2% fulfillment rate</div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>
                  <span>ACTIVE PROFESSIONALS</span>
                  <UserCheck size={18} color="#22c55e" />
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '10px 0 4px' }}>{technicians.length + 145}</div>
                <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 700 }}>12 pending verification</div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: 700 }}>
                  <span>REGISTERED CUSTOMERS</span>
                  <Users size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '10px 0 4px' }}>4,890</div>
                <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>+340 new this week</div>
              </div>
            </div>

            {/* Visual Revenue & Booking Trends Bar Chart Simulation */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Revenue & Booking Performance Trends</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-outline">Daily</button>
                  <button className="btn-purple">Weekly</button>
                  <button className="btn-outline">Monthly</button>
                </div>
              </div>

              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '24px', padding: '10px 20px', borderBottom: '1px solid #22222e' }}>
                {[
                  { day: 'Mon', val: '65%', amt: '₹22k' },
                  { day: 'Tue', val: '80%', amt: '₹28k' },
                  { day: 'Wed', val: '45%', amt: '₹16k' },
                  { day: 'Thu', val: '90%', amt: '₹34k' },
                  { day: 'Fri', val: '75%', amt: '₹26k' },
                  { day: 'Sat', val: '95%', amt: '₹42k' },
                  { day: 'Sun', val: '100%', amt: '₹48k' },
                ].map((bar) => (
                  <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700 }}>{bar.amt}</span>
                    <div
                      style={{
                        width: '100%',
                        height: bar.val,
                        backgroundColor: '#8b5cf6',
                        borderRadius: '6px',
                        boxShadow: '0 0 10px rgba(139,92,246,0.3)',
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Partner Applications Quick Review Card */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Incoming Partner Applications (From Customer App)</h3>
                <button className="btn-outline" onClick={() => setActiveTab('professionals')}>
                  View All Applications →
                </button>
              </div>

              {applications.length === 0 ? (
                <div style={{ color: '#6b7280', fontSize: '13px', padding: '20px 0' }}>No pending applications.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                      <th style={{ padding: '12px 8px' }}>APPLICANT</th>
                      <th style={{ padding: '12px 8px' }}>SERVICE CATEGORY</th>
                      <th style={{ padding: '12px 8px' }}>CITY</th>
                      <th style={{ padding: '12px 8px' }}>KYC STATUS</th>
                      <th style={{ padding: '12px 8px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #191924' }}>
                        <td style={{ padding: '14px 8px', fontWeight: 700 }}>
                          <div>{app.applicantName}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>{app.phone}</div>
                        </td>
                        <td style={{ padding: '14px 8px', color: '#a78bfa', fontWeight: 600 }}>{app.category}</td>
                        <td style={{ padding: '14px 8px' }}>{app.city}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <span className="badge badge-warning">{app.status}</span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <button
                            className="btn-purple"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={() => handleApproveApplication(app.id)}
                          >
                            Approve & Issue ID
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Customer Management</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Search customer accounts, check booking history, and manage block/unblock status.
            </p>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                  <input
                    type="text"
                    placeholder="Search by Customer Name, Mobile, or City..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 42px',
                      backgroundColor: '#0a0a0e',
                      border: '1px solid #22222e',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>CUSTOMER ID</th>
                    <th style={{ padding: '12px 8px' }}>NAME</th>
                    <th style={{ padding: '12px 8px' }}>MOBILE NO.</th>
                    <th style={{ padding: '12px 8px' }}>CITY</th>
                    <th style={{ padding: '12px 8px' }}>TOTAL BOOKINGS</th>
                    <th style={{ padding: '12px 8px' }}>STATUS</th>
                    <th style={{ padding: '12px 8px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {customersList
                    .filter((c) => c.name.toLowerCase().includes(userSearch.toLowerCase()) || c.city.toLowerCase().includes(userSearch.toLowerCase()))
                    .map((cust) => (
                      <tr key={cust.id} style={{ borderBottom: '1px solid #191924' }}>
                        <td style={{ padding: '14px 8px', fontWeight: 800, color: '#a78bfa' }}>{cust.id}</td>
                        <td style={{ padding: '14px 8px', fontWeight: 700 }}>{cust.name}</td>
                        <td style={{ padding: '14px 8px' }}>{cust.phone}</td>
                        <td style={{ padding: '14px 8px' }}>{cust.city}</td>
                        <td style={{ padding: '14px 8px', fontWeight: 700 }}>{cust.bookings} orders</td>
                        <td style={{ padding: '14px 8px' }}>
                          <span className={cust.status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'}>
                            {cust.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <button
                            className="btn-outline"
                            onClick={() => toggleBlockCustomer(cust.id)}
                            style={{ color: cust.status === 'ACTIVE' ? '#ef4444' : '#22c55e' }}
                          >
                            {cust.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNER APPLICATIONS & PROFESSIONAL MANAGEMENT */}
        {activeTab === 'professionals' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Professional & Technician Management</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Approve new partner applications submitted via Customer App, issue ID/Password, and track performance.
            </p>

            {/* Application Applications Section */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#a78bfa' }}>
                Pending Partner Applications ({applications.length})
              </h3>
              {applications.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: '13px' }}>No new applications pending review.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#0a0a0e',
                        borderRadius: '12px',
                        border: '1px solid #22222e',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{app.applicantName}</span>
                        <span className="badge badge-warning">{app.status}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                        <div>📱 Phone: {app.phone}</div>
                        <div>🔧 Service Category: <strong style={{ color: '#a78bfa' }}>{app.category}</strong></div>
                        <div>📍 City: {app.city} | Experience: {app.experienceYears} Years</div>
                        <div>🆔 Aadhaar: {app.aadhaarNumber} | PAN: {app.panNumber}</div>
                        {app.notes && <div>📝 Note: {app.notes}</div>}
                      </div>

                      {app.generatedPassword ? (
                        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)', fontSize: '12px', color: '#22c55e', fontWeight: 700 }}>
                          ✓ Approved! Credentials Sent via WhatsApp:<br />
                          ID: {app.id} | Password: {app.generatedPassword}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-purple" style={{ flex: 1 }} onClick={() => handleApproveApplication(app.id)}>
                            Approve & Issue ID/Pass
                          </button>
                          <button className="btn-outline" style={{ color: '#ef4444' }} onClick={() => handleRejectApplication(app.id)}>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Technicians Roster */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Active Verified Technicians Directory</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>TECH ID & NAME</th>
                    <th style={{ padding: '12px 8px' }}>SPECIALIZATION</th>
                    <th style={{ padding: '12px 8px' }}>CITY</th>
                    <th style={{ padding: '12px 8px' }}>RATING</th>
                    <th style={{ padding: '12px 8px' }}>JOBS DONE</th>
                    <th style={{ padding: '12px 8px' }}>ONLINE STATUS</th>
                    <th style={{ padding: '12px 8px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((tech) => (
                    <tr key={tech.id} style={{ borderBottom: '1px solid #191924' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 700 }}>
                        <div style={{ color: '#a78bfa' }}>{tech.id}</div>
                        <div style={{ color: '#fff' }}>{tech.name}</div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>{tech.category}</td>
                      <td style={{ padding: '14px 8px' }}>{tech.city}</td>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: '#f59e0b' }}>{tech.rating} ⭐</td>
                      <td style={{ padding: '14px 8px', fontWeight: 700 }}>{tech.completedJobs} jobs</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={tech.isOnline ? 'badge badge-success' : 'badge badge-warning'}>
                          {tech.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <button className="btn-outline" style={{ color: '#ef4444' }}>Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICE & CATEGORY MANAGEMENT */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>Service & Category Management</h1>
                <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                  Manage service offerings, pricing (₹), duration, and city availability.
                </p>
              </div>
              <button className="btn-purple">
                <Plus size={16} /> Add New Service
              </button>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>SERVICE TITLE</th>
                    <th style={{ padding: '12px 8px' }}>CATEGORY</th>
                    <th style={{ padding: '12px 8px' }}>PRICING (INR)</th>
                    <th style={{ padding: '12px 8px' }}>EST. DURATION</th>
                    <th style={{ padding: '12px 8px' }}>CITIES AVAILABLE</th>
                    <th style={{ padding: '12px 8px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map((cat) => (
                    <tr key={cat.id} style={{ borderBottom: '1px solid #191924' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: '#fff' }}>{cat.name}</td>
                      <td style={{ padding: '14px 8px', color: '#a78bfa' }}>{cat.category}</td>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: '#22c55e' }}>₹{cat.price}</td>
                      <td style={{ padding: '14px 8px' }}>{cat.duration}</td>
                      <td style={{ padding: '14px 8px' }}>
                        {cat.cities.map((city) => (
                          <span key={city} className="badge badge-purple" style={{ marginRight: '4px', fontSize: '10px' }}>
                            {city}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <button className="btn-outline">Edit Pricing</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKING MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Live Booking Management</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Monitor live bookings across India, reassign technicians manually, or process disputes.
            </p>

            <div className="glass-card" style={{ padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>BOOKING CODE</th>
                    <th style={{ padding: '12px 8px' }}>CUSTOMER</th>
                    <th style={{ padding: '12px 8px' }}>SERVICE TITLE</th>
                    <th style={{ padding: '12px 8px' }}>PRICE</th>
                    <th style={{ padding: '12px 8px' }}>ASSIGNED PRO</th>
                    <th style={{ padding: '12px 8px' }}>STATUS</th>
                    <th style={{ padding: '12px 8px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #191924' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: '#a78bfa' }}>{b.bookingCode}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{ fontWeight: 700 }}>{b.customerName}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>{b.customerPhone}</div>
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: 700 }}>{b.serviceTitle}</td>
                      <td style={{ padding: '14px 8px', color: '#22c55e', fontWeight: 800 }}>₹{b.price}</td>
                      <td style={{ padding: '14px 8px' }}>
                        {b.technicianName ? (
                          <span style={{ color: '#fff', fontWeight: 600 }}>{b.technicianName}</span>
                        ) : (
                          <span style={{ color: '#ef4444', fontWeight: 700 }}>UNASSIGNED</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={b.status === 'COMPLETED' ? 'badge badge-success' : 'badge badge-warning'}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <button className="btn-purple" style={{ fontSize: '11px', padding: '6px 12px' }}>
                          Manual Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENTS & PAYOUT MANAGEMENT */}
        {activeTab === 'payments' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Payout & Revenue Control</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Approve technician payout disbursements and manage platform commission cuts.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>DMT COMMISSION RATE</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#a78bfa', margin: '8px 0' }}>15%</div>
                <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Change Commission Rate</button>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>PENDING PRO PAYOUTS</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', margin: '8px 0' }}>₹42,800</div>
                <button className="btn-purple" style={{ width: '100%', justifyContent: 'center' }}>Approve Batch Payout</button>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: 700 }}>NET COMPANY PROFIT</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#22c55e', margin: '8px 0' }}>₹27,675</div>
                <span className="badge badge-success">Profitable</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MARKETING TOOLS */}
        {activeTab === 'marketing' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Marketing & Coupon Engine</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Create discount promo codes and send push notification announcements to customer devices.
            </p>

            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Active Promotional Coupons</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>COUPON CODE</th>
                    <th style={{ padding: '12px 8px' }}>DISCOUNT</th>
                    <th style={{ padding: '12px 8px' }}>MAX SAVINGS</th>
                    <th style={{ padding: '12px 8px' }}>VALID TILL</th>
                    <th style={{ padding: '12px 8px' }}>TOTAL USES</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code} style={{ borderBottom: '1px solid #191924' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 900, color: '#a78bfa' }}>{c.code}</td>
                      <td style={{ padding: '14px 8px', fontWeight: 700, color: '#22c55e' }}>{c.discount}</td>
                      <td style={{ padding: '14px 8px' }}>{c.maxDiscount}</td>
                      <td style={{ padding: '14px 8px' }}>{c.validTill}</td>
                      <td style={{ padding: '14px 8px', fontWeight: 700 }}>{c.uses} redeemed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Push Notification Campaign Broadcast</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
                <input
                  type="text"
                  placeholder="Campaign Title (e.g. ⚡ Monsoon AC Service Offer)"
                  style={{ padding: '12px', backgroundColor: '#0a0a0e', border: '1px solid #22222e', borderRadius: '10px', color: '#fff' }}
                />
                <textarea
                  placeholder="Notification Message body..."
                  rows={3}
                  style={{ padding: '12px', backgroundColor: '#0a0a0e', border: '1px solid #22222e', borderRadius: '10px', color: '#fff' }}
                />
                <button className="btn-purple" onClick={() => alert('Push Notification Sent to 4,890 Active Users! 🚀')}>
                  <Send size={16} /> Broadcast Push Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: HELPDESK & TICKETS */}
        {activeTab === 'support' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Support & Ticketing System</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Manage incoming complaints from both Customers & Professionals.
            </p>

            <div className="glass-card" style={{ padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ color: '#6b7280', borderBottom: '1px solid #22222e' }}>
                    <th style={{ padding: '12px 8px' }}>TICKET NO.</th>
                    <th style={{ padding: '12px 8px' }}>USER TYPE</th>
                    <th style={{ padding: '12px 8px' }}>NAME</th>
                    <th style={{ padding: '12px 8px' }}>SUBJECT / ISSUE</th>
                    <th style={{ padding: '12px 8px' }}>PRIORITY</th>
                    <th style={{ padding: '12px 8px' }}>STATUS</th>
                    <th style={{ padding: '12px 8px' }}>ASSIGNED AGENT</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #191924' }}>
                      <td style={{ padding: '14px 8px', fontWeight: 800, color: '#a78bfa' }}>{t.ticketNo}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={t.userType === 'CUSTOMER' ? 'badge badge-purple' : 'badge badge-warning'}>
                          {t.userType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: 700 }}>{t.userName}</td>
                      <td style={{ padding: '14px 8px' }}>{t.subject}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className={t.priority === 'HIGH' ? 'badge badge-danger' : 'badge badge-warning'}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px 8px' }}>
                        <span className="badge badge-success">{t.status}</span>
                      </td>
                      <td style={{ padding: '14px 8px', fontWeight: 600, color: '#a78bfa' }}>{t.assignedAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: REPORTS & ANALYTICS */}
        {activeTab === 'reports' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Reports & Intelligence</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              City-wise revenue breakdown, category popularity, and customer retention metrics.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>City-Wise Revenue Leaders</h3>
                {[
                  { city: 'Mumbai', rev: '₹78,400', share: '42%' },
                  { city: 'New Delhi', rev: '₹54,200', share: '29%' },
                  { city: 'Bengaluru', rev: '₹32,100', share: '18%' },
                  { city: 'Pune', rev: '₹19,800', share: '11%' },
                ].map((c) => (
                  <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1f1f2e' }}>
                    <span style={{ fontWeight: 700 }}>{c.city}</span>
                    <span style={{ color: '#22c55e', fontWeight: 800 }}>{c.rev} ({c.share})</span>
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Category Profitability</h3>
                {[
                  { cat: 'Full Home Deep Cleaning', rev: '₹84,200' },
                  { cat: 'AC Repair & Service', rev: '₹48,900' },
                  { cat: 'Beauty & Salon', rev: '₹32,400' },
                  { cat: 'Plumbing & Electrical', rev: '₹19,000' },
                ].map((c) => (
                  <div key={c.cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1f1f2e' }}>
                    <span style={{ fontWeight: 700 }}>{c.cat}</span>
                    <span style={{ color: '#a78bfa', fontWeight: 800 }}>{c.rev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS & PERMISSIONS */}
        {activeTab === 'settings' && (
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Admin Settings & Permissions</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              App config, Privacy Policy editor, and Admin Role Management.
            </p>

            <div className="glass-card" style={{ padding: '24px', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Admin Roles & Access Control</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', backgroundColor: '#0a0a0e', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>Vikram Admin (Super Admin)</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Full Access across all modules</div>
                  </div>
                  <span className="badge badge-purple">SUPER ADMIN</span>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#0a0a0e', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>Finance Manager</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Access to Payments & Payouts</div>
                  </div>
                  <span className="badge badge-success">FINANCE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
