import React, { useEffect, useState } from 'react';
import API from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { 
    RefreshCw, 
    Users, 
    UserCheck, 
    UserMinus, 
    DollarSign, 
    AlertCircle, 
    TrendingUp, 
    ShieldCheck, 
    BarChart2,
    Activity,
    Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activePatients: 0,
        dischargedPatients: 0,
        totalEarnings: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await API.get('/patient/admin/dashboard');
            const data = res.data?.stats || res.data || {};

            const normalizedStats = {
                totalPatients: data.totalPatients ?? data.total ?? data.totalCount ?? 0,
                activePatients: data.activePatients ?? data.active ?? data.working ?? 0,
                dischargedPatients: data.dischargedPatients ?? data.discharged ?? 0,
                totalEarnings: data.totalEarnings ?? data.totalBill ?? data.revenue ?? data.earnings ?? 0
            };

            setStats(normalizedStats);
        } catch (err) {
            console.error("Admin Analytics Fetch Error:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Unauthorized Access! Admin privileges required.");
            } else {
                setError("Failed to sync with central database server.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F8FAFC', 
            color: '#1C2A2B',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
        }}>
            
            {/* Left Admin Navigation */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin-icon {
                        animation: spin 1s linear infinite;
                    }
                    .white-glass-card {
                        background: rgba(255, 255, 255, 0.85);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        border-radius: 16px;
                        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        box-shadow: 0 4px 20px -2px rgba(28, 42, 43, 0.03);
                    }
                    .white-glass-card:hover {
                        background: #FFFFFF;
                        border-color: rgba(28, 42, 43, 0.15);
                        transform: translateY(-3px);
                        box-shadow: 0 20px 30px -10px rgba(28, 42, 43, 0.08);
                    }
                    .primary-btn {
                        background: #1C2A2B;
                        color: #FFFFFF;
                        border: 1px solid #1C2A2B;
                        transition: all 0.2s ease;
                    }
                    .primary-btn:hover {
                        background: #2A3E40;
                        transform: translateY(-1px);
                        box-shadow: 0 8px 16px -4px rgba(28, 42, 43, 0.25);
                    }
                `}</style>

                {/* Header Panel */}
                <header className="white-glass-card" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '32px',
                    padding: '24px 32px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            boxShadow: '0 8px 16px rgba(28, 42, 43, 0.15)'
                        }}>
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', letterSpacing: '-0.3px', color: '#1C2A2B' }}>
                                    System Overview
                                </h1>
                                <span style={{
                                    background: 'rgba(28, 42, 43, 0.06)',
                                    color: '#1C2A2B',
                                    border: '1px solid rgba(28, 42, 43, 0.12)',
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px'
                                }}>
                                    LIVE ANALYTICS
                                </span>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px', fontWeight: '400' }}>
                                Real-time operational metric breakdown and revenue tracking
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={fetchAdminStats}
                        disabled={loading}
                        className="primary-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '500',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                        <span>Sync Data</span>
                    </button>
                </header>

                {/* Error Banner */}
                {error && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        background: '#FEF2F2', 
                        border: '1px solid #FCA5A5', 
                        color: '#991B1B', 
                        padding: '16px 20px', 
                        borderRadius: '12px', 
                        marginBottom: '28px',
                        fontSize: '13px'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>
                        <RefreshCw size={32} className="spin-icon" style={{ marginBottom: '16px', color: '#1C2A2B' }} />
                        <p style={{ fontWeight: '400', fontSize: '14px' }}>Connecting to central database...</p>
                    </div>
                ) : (
                    <>
                        {/* 4 Metric Cards */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', 
                            gap: '20px', 
                            marginBottom: '32px' 
                        }}>
                            
                            {/* Card 1: Total Patients */}
                            <div className="white-glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={cardLabelStyle}>Total Records</span>
                                    <div style={iconWrapperStyle}>
                                        <Users size={16} color="#1C2A2B" />
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <span style={cardValueStyle}>{stats.totalPatients.toLocaleString()}</span>
                                </div>
                                <span style={subTextStyle}>Database overall total</span>
                            </div>

                            {/* Card 2: Active Patients */}
                            <div className="white-glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={cardLabelStyle}>Under Treatment</span>
                                    <div style={{ ...iconWrapperStyle, background: '#FEF3C7' }}>
                                        <UserCheck size={16} color="#D97706" />
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <span style={{ ...cardValueStyle, color: '#D97706' }}>{stats.activePatients.toLocaleString()}</span>
                                </div>
                                <span style={subTextStyle}>Currently active cases</span>
                            </div>

                            {/* Card 3: Discharged Patients */}
                            <div className="white-glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={cardLabelStyle}>Discharged</span>
                                    <div style={{ ...iconWrapperStyle, background: '#DCFCE7' }}>
                                        <UserMinus size={16} color="#16A34A" />
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <span style={{ ...cardValueStyle, color: '#16A34A' }}>{stats.dischargedPatients.toLocaleString()}</span>
                                </div>
                                <span style={subTextStyle}>Completed medical care</span>
                            </div>

                            {/* Card 4: Total Revenue (Accent Card) */}
                            <div className="white-glass-card" style={{ 
                                padding: '24px',
                                background: '#1C2A2B',
                                borderColor: '#1C2A2B'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ ...cardLabelStyle, color: '#CBD5E1' }}>Total Revenue</span>
                                    <div style={{ ...iconWrapperStyle, background: 'rgba(255, 255, 255, 0.1)' }}>
                                        <DollarSign size={16} color="#FFFFFF" />
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px' }}>
                                    <span style={{ ...cardValueStyle, fontSize: '24px', color: '#FFFFFF' }}>
                                        Rs. {stats.totalEarnings.toLocaleString()}
                                    </span>
                                </div>
                                <span style={{ ...subTextStyle, color: '#94A3B8' }}>Financial collections</span>
                            </div>

                        </div>

                        {/* Visual Analytics */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                            gap: '20px' 
                        }}>
                            {/* Revenue Flow Visualizer Bar */}
                            <div className="white-glass-card" style={{ padding: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <BarChart2 size={18} color="#1C2A2B" />
                                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1C2A2B' }}>Revenue Trajectory</h3>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <TrendingUp size={14} /> +12.5%
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', paddingTop: '10px', gap: '12px' }}>
                                    {[
                                        { month: 'Jan', height: '40%' },
                                        { month: 'Feb', height: '60%' },
                                        { month: 'Mar', height: '35%' },
                                        { month: 'Apr', height: '80%' },
                                        { month: 'May', height: '65%' },
                                        { month: 'Jun', height: '95%', active: true }
                                    ].map((bar, idx) => (
                                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '100%',
                                                height: bar.height,
                                                background: bar.active ? '#1C2A2B' : '#E2E8F0',
                                                borderRadius: '6px',
                                                transition: 'all 0.3s ease'
                                            }} />
                                            <span style={{ fontSize: '11px', color: bar.active ? '#1C2A2B' : '#64748B', fontWeight: bar.active ? '600' : '400' }}>{bar.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Operational System Health */}
                            <div className="white-glass-card" style={{ padding: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Activity size={18} color="#1C2A2B" />
                                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1C2A2B' }}>System Health</h3>
                                    </div>
                                    <Sparkles size={16} color="#64748B" />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '400' }}>Recovery Ratio</span>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1C2A2B' }}>
                                            {stats.totalPatients > 0 ? Math.round((stats.dischargedPatients / stats.totalPatients) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '400' }}>Occupied Load</span>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#D97706' }}>
                                            {stats.activePatients} Active Patients
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '400' }}>Database Status</span>
                                        <span style={{ 
                                            fontSize: '11px', 
                                            fontWeight: '600', 
                                            color: '#16A34A', 
                                            background: '#DCFCE7', 
                                            padding: '3px 8px', 
                                            borderRadius: '6px' 
                                        }}>
                                            Connected
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

// Styles
const cardLabelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#64748B'
};

const cardValueStyle = {
    fontSize: '28px',
    fontWeight: '500',
    letterSpacing: '-0.5px',
    color: '#1C2A2B'
};

const subTextStyle = {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '400',
    marginTop: '6px',
    display: 'block'
};

const iconWrapperStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default AdminDashboard;