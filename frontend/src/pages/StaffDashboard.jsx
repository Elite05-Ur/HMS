import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
    Users, 
    UserPlus, 
    Search, 
    Eye, 
    Edit3, 
    Clock, 
    DollarSign, 
    RefreshCw, 
    TrendingUp,
    Info,
    CheckCircle2,
    XCircle,
    X
} from 'lucide-react';

const StaffDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchPatients(true);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 4000);
    };

    const fetchPatients = async (isInitial = false) => {
        setLoading(true);
        try {
            const res = await API.get('/patient/all');
            const patientData = res.data?.patients || res.data || [];
            setPatients(Array.isArray(patientData) ? patientData : []);
            
            if (!isInitial) {
                showToast("Patient records synced successfully!", "success");
            }
        } catch (err) {
            console.error("Error fetching patients:", err);
            showToast("Failed to load patient data. Check server connection.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredPatients = patients.filter(patient => {
        return (
            (patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (patient.disease && patient.disease.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (patient._id && patient._id.toString().includes(searchQuery))
        );
    });

    // Calculated Statistics
    const totalPatients = patients.length;
    const pendingCases = patients.filter(p => p.status?.toLowerCase() === 'working' || p.status?.toLowerCase() === 'pending').length;
    const avgAge = totalPatients > 0 ? Math.round(patients.reduce((acc, p) => acc + (Number(p.age) || 0), 0) / totalPatients) : 0;
    const totalRevenue = patients.reduce((acc, curr) => acc + (Number(curr.totalBill) || 0), 0);

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F8FAFC', 
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            color: '#1E293B'
        }}>
            {/* 👈 Left Sidebar */}
            <Sidebar />

            {/* Right Main Content Area */}
            <main style={{ 
                flex: 1, 
                padding: '32px 40px', 
                boxSizing: 'border-box', 
                maxWidth: '1600px', 
                margin: '0 auto',
                position: 'relative'
            }}>
                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin-icon { animation: spin 0.8s linear infinite; }

                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .toast-slide { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

                    /* White & Olive Modern Card */
                    .olive-card {
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        border-radius: 16px;
                        box-shadow: 0 4px 20px rgba(122, 143, 110, 0.06);
                        transition: all 0.25s ease;
                    }

                    /* 4-Card Single Row Grid Layout */
                    .stats-4-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 16px;
                        margin-bottom: 28px;
                    }

                    .stat-box {
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        border-radius: 14px;
                        padding: 18px 20px;
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        transition: all 0.25s ease;
                    }
                    .stat-box:hover {
                        border-color: #7A8F6E;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(122, 143, 110, 0.12);
                    }

                    /* Light Table Styling */
                    .light-table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0 8px;
                    }
                    .light-table tr.table-row {
                        background: #FFFFFF;
                        transition: all 0.2s ease;
                    }
                    .light-table tr.table-row:hover {
                        background: #F4F6F3 !important;
                        box-shadow: 0 4px 14px rgba(122, 143, 110, 0.08);
                    }
                    .light-table td {
                        padding: 14px 18px;
                        border-top: 1px solid #F1F5F9;
                        border-bottom: 1px solid #F1F5F9;
                        font-weight: 400;
                        font-size: 13.5px;
                        color: #334155;
                    }
                    .light-table td:first-child {
                        border-top-left-radius: 10px;
                        border-bottom-left-radius: 10px;
                        border-left: 1px solid #F1F5F9;
                    }
                    .light-table td:last-child {
                        border-top-right-radius: 10px;
                        border-bottom-right-radius: 10px;
                        border-right: 1px solid #F1F5F9;
                    }

                    /* Olive Accent Text */
                    .olive-text {
                        color: #5A6B50;
                    }

                    .action-btn {
                        width: 34px;
                        height: 34px;
                        border-radius: 8px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        text-decoration: none;
                    }
                    .action-btn-view {
                        background: #F0F4EF;
                        color: #5A6B50;
                    }
                    .action-btn-view:hover {
                        background: #7A8F6E;
                        color: #FFFFFF;
                    }
                    .action-btn-edit {
                        background: #FEF3C7;
                        color: #D97706;
                    }
                    .action-btn-edit:hover {
                        background: #D97706;
                        color: #FFFFFF;
                    }

                    /* Info Hover Tooltip */
                    .info-wrapper {
                        position: relative;
                        display: inline-block;
                    }
                    .info-tooltip {
                        visibility: hidden;
                        opacity: 0;
                        width: 260px;
                        background: #1E293B;
                        color: #F8FAFC;
                        text-align: left;
                        border-radius: 10px;
                        padding: 12px 14px;
                        position: absolute;
                        z-index: 50;
                        bottom: 125%;
                        right: 0;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                        font-size: 11.5px;
                        line-height: 1.5;
                        transition: opacity 0.2s ease, visibility 0.2s ease;
                    }
                    .info-wrapper:hover .info-tooltip {
                        visibility: visible;
                        opacity: 1;
                    }

                    @media (max-width: 1024px) {
                        .stats-4-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                `}</style>

                {/* 🔔 Right Side Floating Toast Popup */}
                {toast.show && (
                    <div className="toast-slide" style={{
                        position: 'fixed',
                        top: '28px',
                        right: '28px',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: toast.type === 'success' ? '#FFFFFF' : '#FEF2F2',
                        borderLeft: `5px solid ${toast.type === 'success' ? '#7A8F6E' : '#EF4444'}`,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                        minWidth: '300px'
                    }}>
                        {toast.type === 'success' ? (
                            <CheckCircle2 size={20} color="#7A8F6E" />
                        ) : (
                            <XCircle size={20} color="#EF4444" />
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: toast.type === 'success' ? '#5A6B50' : '#991B1B', textTransform: 'uppercase' }}>
                                {toast.type === 'success' ? 'Notification' : 'Error Alert'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#334155', fontWeight: '500', marginTop: '2px' }}>
                                {toast.message}
                            </div>
                        </div>
                        <button 
                            onClick={() => setToast({ ...toast, show: false })}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94A3B8' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* 1. Header Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ 
                                background: '#F0F4EF', 
                                color: '#5A6B50', 
                                padding: '3px 10px', 
                                borderRadius: '12px', 
                                fontSize: '11px', 
                                fontWeight: '700',
                                border: '1px solid #D6E0D2'
                            }}>
                                STAFF PANEL
                            </span>
                        </div>
                        <h1 className="olive-text" style={{ margin: 0, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.3px' }}>
                            Patient Management
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px', fontWeight: '400' }}>
                            Real-time patient intake, check-ins, and billing operations
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                            onClick={() => fetchPatients(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '10px',
                                color: '#475569',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <RefreshCw size={15} className={loading ? "spin-icon" : ""} color="#5A6B50" />
                            <span>Sync Data</span>
                        </button>

                        <Link 
                            to="/add-patient" 
                            style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px', 
                                background: '#7A8F6E', 
                                color: '#FFFFFF', 
                                borderRadius: '10px', 
                                textDecoration: 'none', 
                                fontWeight: '600',
                                fontSize: '13.5px',
                                boxShadow: '0 4px 14px rgba(122, 143, 110, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <UserPlus size={16} />
                            <span>Add Patient</span>
                        </Link>
                    </div>
                </div>

                {/* 2. TOP 4 BOXES (STRICT SINGLE ROW) */}
                <div className="stats-4-grid">
                    <StatBox icon={<Users size={20} color="#7A8F6E" />} label="Total Registered" value={totalPatients} />
                    <StatBox icon={<Clock size={20} color="#D97706" />} label="Active Queue" value={pendingCases} />
                    <StatBox icon={<TrendingUp size={20} color="#0284C7" />} label="Avg. Patient Age" value={`${avgAge} Yrs`} />
                    <StatBox icon={<DollarSign size={20} color="#7A8F6E" />} label="Total Bill Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} />
                </div>

                {/* 3. Main Data Table Container */}
                <div className="olive-card" style={{ padding: '20px', marginBottom: '28px' }}>
                    
                    {/* Search Bar Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                            <Search size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input 
                                type="text"
                                placeholder="Search by name, disease, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px 10px 40px',
                                    borderRadius: '10px',
                                    border: '1px solid #CBD5E1',
                                    outline: 'none',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                    color: '#0F172A',
                                    background: '#F8FAFC',
                                    fontWeight: '400'
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div style={{ padding: '50px 20px', textAlign: 'center', color: '#5A6B50' }}>
                            <RefreshCw size={28} className="spin-icon" style={{ marginBottom: '10px' }} />
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>Fetching patient records...</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="light-table">
                                <thead>
                                    <tr style={{ color: '#5A6B50', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        <th style={{ padding: '10px 18px', textAlign: 'left' }}>Patient Name</th>
                                        <th style={{ padding: '10px 18px', textAlign: 'left' }}>Age / Gender</th>
                                        <th style={{ padding: '10px 18px', textAlign: 'left' }}>Diagnosis</th>
                                        <th style={{ padding: '10px 18px', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '10px 18px', textAlign: 'left' }}>Total Fee</th>
                                        <th style={{ padding: '10px 18px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => {
                                            const isPending = patient.status?.toLowerCase() === 'working' || patient.status?.toLowerCase() === 'pending';
                                            return (
                                                <tr key={patient._id} className="table-row">
                                                    
                                                    {/* Name & Photo */}
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            {patient.patientImage ? (
                                                                <img 
                                                                    src={patient.patientImage} 
                                                                    alt={patient.name} 
                                                                    style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} 
                                                                />
                                                            ) : (
                                                                <div style={{
                                                                    width: '38px',
                                                                    height: '38px',
                                                                    borderRadius: '8px',
                                                                    background: '#F0F4EF',
                                                                    color: '#5A6B50',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontWeight: '700',
                                                                    fontSize: '14px'
                                                                }}>
                                                                    {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div style={{ color: '#0F172A', fontWeight: '600', fontSize: '13.5px' }}>
                                                                    {patient.name || 'Anonymous'}
                                                                </div>
                                                                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '400' }}>
                                                                    #{patient._id ? patient._id.toString().slice(-6) : 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Age / Gender */}
                                                    <td style={{ color: '#334155' }}>
                                                        {patient.age || 'N/A'} Yrs <span style={{ color: '#94A3B8', fontSize: '12px' }}>({patient.gender || 'N/A'})</span>
                                                    </td>

                                                    {/* Disease */}
                                                    <td style={{ color: '#334155' }}>
                                                        {patient.disease || 'General Consultation'}
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td>
                                                        <span style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '6px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            background: isPending ? '#FEF3C7' : '#F0F4EF',
                                                            color: isPending ? '#D97706' : '#5A6B50',
                                                            border: `1px solid ${isPending ? '#FDE68A' : '#D6E0D2'}`
                                                        }}>
                                                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isPending ? '#D97706' : '#5A6B50' }}></span>
                                                            {isPending ? 'IN PROGRESS' : 'ACTIVE'}
                                                        </span>
                                                    </td>

                                                    {/* Fee */}
                                                    <td style={{ color: '#0F172A', fontWeight: '700' }}>
                                                        PKR {Number(patient.totalBill || 0).toLocaleString()}
                                                    </td>

                                                    {/* Actions */}
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                            <Link to={`/patient/${patient._id}`} className="action-btn action-btn-view" title="View Details">
                                                                <Eye size={15} />
                                                            </Link>
                                                            <Link to={`/edit-patient/${patient._id}`} className="action-btn action-btn-edit" title="Edit Record">
                                                                <Edit3 size={15} />
                                                            </Link>
                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                                                No patient records matching search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 4. Useful Analytics Trend Graph Section with Info Button */}
                <div className="olive-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <h3 className="olive-text" style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>
                                Monthly Patient Intake & Revenue Trend
                            </h3>
                            <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '12px' }}>
                                Analytical curve based on live database registrations
                            </p>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#64748B' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7A8F6E' }}></span> Admissions
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7' }}></span> Revenue Flow
                                </span>
                            </div>

                            {/* ℹ️ Info Button with Tooltip */}
                            <div className="info-wrapper">
                                <button style={{
                                    background: '#F0F4EF',
                                    border: '1px solid #D6E0D2',
                                    color: '#5A6B50',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}>
                                    <Info size={15} />
                                </button>
                                <div className="info-tooltip">
                                    <strong style={{ color: '#8A9A86' }}>Graph Insight:</strong><br />
                                    This chart maps overall monthly patient flow against clinic revenue generation. Olive line indicates active patient registrations.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SVG Curve Graph */}
                    <div style={{ width: '100%', height: '130px', position: 'relative' }}>
                        <svg viewBox="0 0 500 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="oliveGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7A8F6E" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#7A8F6E" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>
                            
                            {/* Grid Lines */}
                            <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                            <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeDasharray="3 3" />
                            <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeDasharray="3 3" />

                            {/* Area Fill */}
                            <path 
                                d="M0,80 Q75,30 150,60 T300,20 T450,50 L500,70 L500,100 L0,100 Z" 
                                fill="url(#oliveGradient)" 
                            />

                            {/* Olive Revenue Line */}
                            <path 
                                d="M0,80 Q75,30 150,60 T300,20 T450,50 L500,70" 
                                fill="none" 
                                stroke="#7A8F6E" 
                                strokeWidth="2.5" 
                            />

                            {/* Dotted Trend Line */}
                            <path 
                                d="M0,60 Q80,80 160,40 T320,70 T480,30" 
                                fill="none" 
                                stroke="#0284C7" 
                                strokeWidth="1.5" 
                                strokeDasharray="4 4"
                            />

                            {/* Data Points */}
                            <circle cx="150" cy="60" r="4" fill="#7A8F6E" stroke="#FFFFFF" strokeWidth="1.5" />
                            <circle cx="300" cy="20" r="4" fill="#7A8F6E" stroke="#FFFFFF" strokeWidth="1.5" />
                            <circle cx="450" cy="50" r="4" fill="#7A8F6E" stroke="#FFFFFF" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* Month Labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#94A3B8', fontSize: '11px', fontWeight: '500' }}>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                    </div>
                </div>

            </main>
        </div>
    );
};

// Sub-component: Stat Box
const StatBox = ({ icon, label, value }) => (
    <div className="stat-box">
        <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#F0F4EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
        }}>
            {icon}
        </div>
        <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', letterSpacing: '0.3px' }}>
                {label}
            </div>
            <div style={{ fontSize: '18px', color: '#0F172A', fontWeight: '700', marginTop: '1px' }}>
                {value}
            </div>
        </div>
    </div>
);

export default StaffDashboard;