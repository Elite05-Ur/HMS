import { useEffect, useState } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import API from '../services/api';
import { 
    Search, 
    UserCheck, 
    User, 
    PhoneCall, 
    Calendar, 
    RefreshCw, 
    ShieldAlert, 
    Clock, 
    ChevronRight,
    Users
} from 'lucide-react';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAssignedPatients();
    }, []);

    const fetchAssignedPatients = async () => {
        setLoading(true);
        try {
            // Backend endpoint to fetch doctor's patients
            const res = await API.get('/doctor/patients');
            setPatients(res.data.patients || res.data || []);
        } catch (err) {
            console.error("Error fetching patients:", err);
            // Fallback empty state
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.phone?.includes(search) ||
        p.tokenNo?.toString().includes(search)
    );

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F4F6F5', 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        }}>
            {/* Doctor Navigation Sidebar */}
            <DoctorSidebar />

            <main style={{ flex: 1, padding: '32px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin-icon { animation: spin 1s linear infinite; }
                    .patient-row-hover {
                        transition: background 0.15s ease-in-out;
                    }
                    .patient-row-hover:hover {
                        background: '#F8FAFC' !important;
                    }
                    .search-input-focus:focus-within {
                        border-color: #0E8388 !important;
                        box-shadow: 0 0 0 3px rgba(14, 131, 136, 0.12) !important;
                    }
                `}</style>

                {/* Glassmorphism Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '28px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(14, 131, 136, 0.12)',
                    padding: '20px 28px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0E8388',
                            boxShadow: '0 4px 12px rgba(28, 42, 43, 0.15)'
                        }}>
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: '#1C2A2B', fontSize: '22px', fontWeight: '700' }}>
                                Assigned Patients
                            </h1>
                            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                                Manage assigned OPD records and clinical consultation histories
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={fetchAssignedPatients}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: '#1C2A2B',
                            color: '#F4F6F5',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Sync Directory</span>
                    </button>
                </div>

                {/* Filter Controls & Search */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '20px',
                    gap: '16px'
                }}>
                    <div className="search-input-focus" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: '#FFFFFF', 
                        border: '1px solid #CBD5E1', 
                        borderRadius: '8px', 
                        padding: '0 14px', 
                        width: '360px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}>
                        <Search size={18} color="#0E8388" />
                        <input 
                            type="text" 
                            placeholder="Search by name, phone, or token..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                padding: '12px', 
                                width: '100%', 
                                fontSize: '13px', 
                                color: '#1C2A2B',
                                background: 'transparent'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', fontWeight: '500' }}>
                        <Users size={16} color="#0E8388" />
                        <span>Total Records: <strong style={{ color: '#1C2A2B' }}>{filteredPatients.length}</strong></span>
                    </div>
                </div>

                {/* Patient Records Table */}
                {loading ? (
                    <div style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0', 
                        padding: '60px', 
                        textAlign: 'center', 
                        color: '#64748B' 
                    }}>
                        <RefreshCw size={28} className="spin-icon" style={{ color: '#0E8388', marginBottom: '12px' }} />
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Loading patient clinical directory...</p>
                    </div>
                ) : (
                    <div style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                        overflow: 'hidden' 
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <th style={thStyle}>Token / ID</th>
                                    <th style={thStyle}>Patient Name</th>
                                    <th style={thStyle}>Demographics</th>
                                    <th style={thStyle}>Contact</th>
                                    <th style={thStyle}>Last Visit Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((pt, idx) => (
                                        <tr key={pt._id || idx} className="patient-row-hover" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            
                                            {/* Token / ID */}
                                            <td style={tdStyle}>
                                                <span style={{ 
                                                    background: '#1C2A2B', 
                                                    color: '#FAF8F5', 
                                                    padding: '4px 10px', 
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    #{pt.tokenNo || pt._id?.slice(-4) || 'N/A'}
                                                </span>
                                            </td>

                                            {/* Patient Name */}
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(14, 131, 136, 0.1)',
                                                        color: '#0E8388',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '700',
                                                        fontSize: '13px'
                                                    }}>
                                                        {pt.name ? pt.name.charAt(0).toUpperCase() : <User size={14} />}
                                                    </div>
                                                    <span style={{ fontWeight: '600', color: '#1C2A2B' }}>
                                                        {pt.name || <span style={emptyBadgeStyle}>Unassigned Name</span>}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Demographics */}
                                            <td style={tdStyle}>
                                                <span style={{ color: '#475569', fontSize: '13px', fontWeight: '500' }}>
                                                    {pt.age ? `${pt.age} Yrs` : 'Age N/A'}
                                                    <span style={{ color: '#CBD5E1', margin: '0 6px' }}>|</span>
                                                    {pt.gender || 'Gender N/A'}
                                                </span>
                                            </td>

                                            {/* Contact Number */}
                                            <td style={tdStyle}>
                                                {pt.phone ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                                                        <PhoneCall size={13} color="#0E8388" />
                                                        <span>{pt.phone}</span>
                                                    </div>
                                                ) : (
                                                    <span style={emptyBadgeStyle}>Contact Missing</span>
                                                )}
                                            </td>

                                            {/* Last Visit */}
                                            <td style={tdStyle}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                                                    <Clock size={13} color="#0E8388" />
                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#1C2A2B' }}>
                                                        {pt.lastVisit || 'Today'}
                                                    </span>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748B' }}>
                                            <ShieldAlert size={36} color="#CBD5E1" style={{ marginBottom: '8px' }} />
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1C2A2B' }}>No patient records matched</p>
                                            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Try searching with a different token ID, phone number or patient name.</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

// Styling Object Schemas
const thStyle = { 
    padding: '14px 18px', 
    color: '#475569', 
    fontSize: '12px', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: '0.5px' 
};

const tdStyle = { 
    padding: '14px 18px', 
    color: '#334155', 
    fontSize: '13px' 
};

const emptyBadgeStyle = { 
    display: 'inline-block',
    background: '#F1F5F9', 
    color: '#94A3B8', 
    padding: '3px 8px', 
    borderRadius: '4px', 
    fontSize: '11px', 
    fontWeight: '500',
    fontStyle: 'italic'
};

export default DoctorPatients;