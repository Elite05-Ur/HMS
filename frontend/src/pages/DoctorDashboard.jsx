import { useEffect, useState } from 'react';
import API from '../services/api';
import DoctorSidebar from '../components/DoctorSidebar';
import { 
    RefreshCw, 
    Users, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    Activity, 
    AlertCircle, 
    User, 
    Stethoscope, 
    Building2,
    XCircle,
    TrendingUp,
    BarChart3
} from 'lucide-react';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [stats, setStats] = useState({ totalToday: 0, completedToday: 0, pendingToday: 0 });
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await API.get('/doctor/dashboard');
            
            if (res.data) {
                setDoctorInfo(res.data.doctorInfo || {});
                setStats(res.data.stats || { totalToday: 0, completedToday: 0, pendingToday: 0 });
                setQueue(res.data.queue || []);
            }
        } catch (err) {
            console.error("Doctor Dashboard Fetch Error:", err);
            setError(err.response?.data?.message || "Failed to load today's OPD appointments.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await API.put(`/appointment/status/${appointmentId}`, { status: newStatus });
            fetchDoctorData();
        } catch (err) {
            console.error("Status Update Error:", err);
            alert("Failed to update appointment status.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            /* Same color as Sidebar's Active Cutout Item for seamless integration */
            background: '#F4F6F5', 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        }}>
            
            {/* Connected Sidebar */}
            <DoctorSidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '32px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin-icon {
                        animation: spin 1s linear infinite;
                    }
                    .dashboard-card-hover {
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .dashboard-card-hover:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px -5px rgba(28, 42, 43, 0.08);
                    }
                    .btn-action-done {
                        background: #0E8388;
                        color: #FFFFFF;
                        transition: background 0.2s;
                    }
                    .btn-action-done:hover {
                        background: #0B6B6F;
                    }
                    .btn-action-cancel {
                        background: #EF4444;
                        color: #FFFFFF;
                        transition: background 0.2s;
                    }
                    .btn-action-cancel:hover {
                        background: #DC2626;
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
                            width: '52px',
                            height: '52px',
                            borderRadius: '10px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0E8388',
                            boxShadow: '0 4px 12px rgba(28, 42, 43, 0.15)'
                        }}>
                            <Stethoscope size={28} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{ margin: 0, color: '#1C2A2B', fontSize: '22px', fontWeight: '700' }}>
                                    {doctorInfo ? `Dr. ${doctorInfo.name}` : 'Doctor Portal'}
                                </h1>
                                <span style={{
                                    background: 'rgba(14, 131, 136, 0.1)',
                                    color: '#0E8388',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px'
                                }}>
                                    ON DUTY
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '13px', color: '#64748B' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Activity size={14} color="#0E8388" />
                                    Specialty: <strong style={{ color: '#1C2A2B' }}>{doctorInfo?.specialty || 'General OPD'}</strong>
                                </span>
                                <span style={{ color: '#CBD5E1' }}>|</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Building2 size={14} color="#0E8388" />
                                    Room No: <strong style={{ color: '#1C2A2B' }}>#{doctorInfo?.roomNo || 'N/A'}</strong>
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={fetchDoctorData}
                        disabled={loading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: '#1C2A2B',
                            color: '#F4F6F5',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh Queue</span>
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        background: '#FEF2F2', 
                        border: '1px solid #FCA5A5', 
                        color: '#991B1B', 
                        padding: '14px 18px', 
                        borderRadius: '8px', 
                        marginBottom: '24px',
                        fontSize: '14px'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Metrics Cards */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '28px' 
                }}>
                    {/* Total Today */}
                    <div className="dashboard-card-hover" style={{ 
                        background: '#1C2A2B',
                        padding: '20px', 
                        borderRadius: '10px', 
                        border: '1px solid rgba(14, 131, 136, 0.2)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={cardLabelStyle}>Total Patients Today</span>
                            <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(14, 131, 136, 0.15)', color: '#0E8388' }}>
                                <Users size={18} />
                            </div>
                        </div>
                        <p style={{ ...cardValueStyle, color: '#F4F6F5' }}>{stats.totalToday}</p>
                        <span style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>Registered for consultation</span>
                    </div>

                    {/* Pending Queue */}
                    <div className="dashboard-card-hover" style={{ 
                        background: '#FFFFFF',
                        padding: '20px', 
                        borderRadius: '10px', 
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...cardLabelStyle, color: '#64748B' }}>In Waiting Queue</span>
                            <div style={{ padding: '8px', borderRadius: '6px', background: '#FEF3C7', color: '#D97706' }}>
                                <Clock size={18} />
                            </div>
                        </div>
                        <p style={{ ...cardValueStyle, color: '#D97706' }}>{stats.pendingToday}</p>
                        <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>Awaiting doctor review</span>
                    </div>

                    {/* Attended / Completed */}
                    <div className="dashboard-card-hover" style={{ 
                        background: '#FFFFFF',
                        padding: '20px', 
                        borderRadius: '10px', 
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ ...cardLabelStyle, color: '#64748B' }}>Attended & Completed</span>
                            <div style={{ padding: '8px', borderRadius: '6px', background: '#DCFCE7', color: '#16A34A' }}>
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                        <p style={{ ...cardValueStyle, color: '#16A34A' }}>{stats.completedToday}</p>
                        <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', display: 'block' }}>Prescriptions generated</span>
                    </div>
                </div>

                {/* Queue Table */}
                <div style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0', 
                    padding: '24px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    marginBottom: '28px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#1C2A2B', fontSize: '16px', fontWeight: '700' }}>
                                Today's Consultation Queue
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                                Live status of OPD appointments assigned to you
                            </p>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#0E8388', background: 'rgba(14, 131, 136, 0.08)', padding: '6px 12px', borderRadius: '6px' }}>
                            {queue.length} Active Queue
                        </span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                            <RefreshCw size={24} className="spin-icon" style={{ marginBottom: '8px', color: '#0E8388' }} />
                            <p style={{ margin: 0, fontSize: '14px' }}>Loading OPD Queue...</p>
                        </div>
                    ) : queue.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                        <th style={thStyle}>Token</th>
                                        <th style={thStyle}>Patient Name</th>
                                        <th style={thStyle}>Demographics</th>
                                        <th style={thStyle}>Chief Complaint</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={{ ...thStyle, textAlign: 'center' }}>Consultation Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.map((item) => (
                                        <tr key={item._id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}>
                                            <td style={{ ...tdStyle, fontWeight: '700' }}>
                                                <span style={{ 
                                                    background: '#1C2A2B', 
                                                    color: '#FAF8F5', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '6px',
                                                    fontSize: '12px'
                                                }}>
                                                    #{item.tokenNumber || '1'}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: '600', color: '#1C2A2B' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <User size={15} color="#64748B" />
                                                    {item.patientId?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td style={{ ...tdStyle, color: '#475569' }}>
                                                {item.patientId?.age ? `${item.patientId.age} Yrs` : 'N/A'} / {item.patientId?.gender || 'M'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#334155' }}>
                                                {item.reason || item.patientId?.disease || 'General Checkup'}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    background: item.status === 'Completed' ? '#DCFCE7' : item.status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7',
                                                    color: item.status === 'Completed' ? '#15803D' : item.status === 'Cancelled' ? '#B91C1C' : '#B45309'
                                                }}>
                                                    {item.status === 'Completed' && <CheckCircle2 size={13} />}
                                                    {item.status === 'Cancelled' && <XCircle size={13} />}
                                                    {item.status === 'Scheduled' && <Clock size={13} />}
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {item.status === 'Scheduled' && (
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(item._id, 'Completed')}
                                                            className="btn-action-done"
                                                            style={{ ...btnStyle }}
                                                        >
                                                            <CheckCircle2 size={13} /> Mark Done
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(item._id, 'Cancelled')}
                                                            className="btn-action-cancel"
                                                            style={{ ...btnStyle }}
                                                        >
                                                            <XCircle size={13} /> Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {item.status === 'Completed' && (
                                                    <span style={{ color: '#16A34A', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                        <CheckCircle2 size={14} /> Checked
                                                    </span>
                                                )}
                                                {item.status === 'Cancelled' && (
                                                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>Cancelled</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                            <Calendar size={32} style={{ marginBottom: '8px', color: '#CBD5E1' }} />
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>No patients currently waiting in queue for today.</p>
                        </div>
                    )}
                </div>

                {/* Additional OPD Analytics Section */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '20px' 
                }}>
                    {/* Consultations Overview Visualizer */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '20px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BarChart3 size={18} color="#0E8388" />
                                <h4 style={{ margin: 0, color: '#1C2A2B', fontSize: '14px', fontWeight: '700' }}>Weekly OPD Load Trends</h4>
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>Average: 24/day</span>
                        </div>
                        
                        {/* CSS Bar Graph */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', paddingT: '10px', gap: '8px' }}>
                            {[
                                { day: 'Mon', val: '65%' },
                                { day: 'Tue', val: '80%' },
                                { day: 'Wed', val: '45%' },
                                { day: 'Thu', val: '90%' },
                                { day: 'Fri', val: '75%' },
                                { day: 'Sat', val: '30%' },
                                { day: 'Sun', val: '15%' }
                            ].map((bar, idx) => (
                                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '100%',
                                        height: bar.val,
                                        background: idx === 3 ? '#0E8388' : '#E2E8F0',
                                        borderRadius: '4px',
                                        transition: 'height 0.3s ease'
                                    }} />
                                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>{bar.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Patient Age Distribution */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        padding: '20px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <TrendingUp size={18} color="#0E8388" />
                            <h4 style={{ margin: 0, color: '#1C2A2B', fontSize: '14px', fontWeight: '700' }}>Demographics Breakdown</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { label: 'Pediatric (0 - 12 Yrs)', pct: '20%', count: '4' },
                                { label: 'Adults (13 - 59 Yrs)', pct: '65%', count: '14' },
                                { label: 'Seniors (60+ Yrs)', pct: '15%', count: '3' },
                            ].map((group, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                        <span style={{ color: '#475569', fontWeight: '500' }}>{group.label}</span>
                                        <span style={{ color: '#1C2A2B', fontWeight: '700' }}>{group.count} patients ({group.pct})</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ width: group.pct, height: '100%', background: '#0E8388', borderRadius: '3px' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

// Layout Object Styles
const cardLabelStyle = { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' };
const cardValueStyle = { fontSize: '28px', fontWeight: '800', margin: '12px 0 0 0', lineHeight: 1 };
const thStyle = { padding: '14px 16px', color: '#475569', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '14px 16px', fontSize: '13px' };
const btnStyle = { padding: '6px 12px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' };

export default DoctorDashboard;