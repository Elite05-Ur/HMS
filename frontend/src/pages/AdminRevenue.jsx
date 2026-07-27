import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { 
    TrendingUp, 
    DollarSign, 
    AlertCircle, 
    CheckCircle2, 
    RefreshCw, 
    Clock,
    X,
    Receipt
} from 'lucide-react';

const AdminRevenue = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalPaid: 0,
        totalPending: 0
    });

    // Bottom-Corner Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/billing/all').catch(() => ({ data: [] }));
            const billData = Array.isArray(res.data) ? res.data : res.data.bills || [];
            
            setBills(billData);

            let total = 0;
            let paid = 0;
            let pending = 0;

            billData.forEach(b => {
                const amt = Number(b.totalAmount) || 0;
                const paidAmt = Number(b.paidAmount) || 0;
                total += amt;
                paid += paidAmt;
                pending += (amt - paidAmt > 0 ? amt - paidAmt : 0);
            });

            setSummary({
                totalRevenue: total,
                totalPaid: paid,
                totalPending: pending
            });

            showToast("Financial data synced successfully!", "success");

        } catch (err) {
            console.error("Fetch Revenue Error:", err);
            showToast("Failed to fetch billing records.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', color: '#1C2A2B', fontFamily: "'Inter', sans-serif" }}>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .spin-icon {
                    animation: spin 1s linear infinite;
                }
                .toast-animation {
                    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .summary-card {
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 22px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease;
                }
                .summary-card:hover {
                    border-color: #CBD5E1;
                    box-shadow: 0 4px 12px rgba(28, 42, 43, 0.06);
                    transform: translateY(-1px);
                }
                .table-container {
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                .btn-refresh {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 9px 18px;
                    background: #1C2A2B;
                    color: #FFFFFF;
                    border: 1px solid #1C2A2B;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .btn-refresh:hover {
                    background: #2A3E40;
                    box-shadow: 0 4px 12px rgba(28, 42, 43, 0.15);
                }
                .table-row {
                    border-bottom: 1px solid #F1F5F9;
                    transition: background 0.15s ease;
                }
                .table-row:hover {
                    background: #F8FAFC;
                }
            `}</style>

            {/* Left Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '36px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* Top Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                        }}>
                            <Receipt size={22} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1C2A2B', letterSpacing: '-0.3px' }}>
                                Financial Analytics & Revenue
                            </h1>
                            <p style={{ margin: '3px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                                Real-time hospital earnings, collected fees, and pending bill balances
                            </p>
                        </div>
                    </div>

                    <button className="btn-refresh" onClick={fetchRevenueData}>
                        <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                        <span>Refresh Data</span>
                    </button>
                </header>

                {/* Minimalist Financial Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                    
                    {/* Total Revenue Card */}
                    <div className="summary-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={cardLabelStyle}>Total Billed Revenue</span>
                            <div style={iconBadgeStyle}>
                                <TrendingUp size={16} color="#1C2A2B" />
                            </div>
                        </div>
                        <p style={cardValueStyle}>Rs. {summary.totalRevenue.toLocaleString()}</p>
                    </div>

                    {/* Paid Cash Card */}
                    <div className="summary-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={cardLabelStyle}>Total Cash Collected</span>
                            <div style={iconBadgeStyle}>
                                <DollarSign size={16} color="#1C2A2B" />
                            </div>
                        </div>
                        <p style={cardValueStyle}>Rs. {summary.totalPaid.toLocaleString()}</p>
                    </div>

                    {/* Pending Dues Card */}
                    <div className="summary-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <span style={cardLabelStyle}>Outstanding Dues</span>
                            <div style={iconBadgeStyle}>
                                <Clock size={16} color="#1C2A2B" />
                            </div>
                        </div>
                        <p style={cardValueStyle}>Rs. {summary.totalPending.toLocaleString()}</p>
                    </div>

                </div>

                {/* Billing History Table Container */}
                <div className="table-container">
                    <h3 style={{ margin: '0 0 18px 0', color: '#1C2A2B', fontSize: '15px', fontWeight: '600' }}>
                        Recent Financial Transactions
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748B' }}>
                            <RefreshCw size={26} className="spin-icon" style={{ marginBottom: '10px', color: '#1C2A2B' }} />
                            <p style={{ fontSize: '13px', margin: 0 }}>Syncing financial data...</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                        <th style={thStyle}>Patient Name</th>
                                        <th style={thStyle}>Doctor Fee</th>
                                        <th style={thStyle}>Room Fee</th>
                                        <th style={thStyle}>Tests Fee</th>
                                        <th style={thStyle}>Total Amount</th>
                                        <th style={thStyle}>Paid Amount</th>
                                        <th style={thStyle}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bills.length > 0 ? (
                                        bills.map((item, idx) => (
                                            <tr key={item._id || idx} className="table-row">
                                                <td style={{ ...tdStyle, fontWeight: '500', color: '#1C2A2B' }}>
                                                    {item.patientId?.name || 'N/A'}
                                                </td>
                                                <td style={tdStyle}>Rs. {item.doctorFee || 0}</td>
                                                <td style={tdStyle}>Rs. {item.roomCharges || 0}</td>
                                                <td style={tdStyle}>Rs. {item.testCharges || 0}</td>
                                                <td style={{ ...tdStyle, fontWeight: '600', color: '#1C2A2B' }}>
                                                    Rs. {item.totalAmount || 0}
                                                </td>
                                                <td style={{ ...tdStyle, fontWeight: '500', color: '#334155' }}>
                                                    Rs. {item.paidAmount || 0}
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={getStatusBadgeStyle(item.paymentStatus)}>
                                                        {item.paymentStatus || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B', fontSize: '13px' }}>
                                                No financial billing records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Bottom-Right Corner Toast Notification Popup */}
                {toast.show && (
                    <div className="toast-animation" style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        padding: '12px 18px',
                        background: '#1C2A2B',
                        color: '#FFFFFF',
                        border: '1px solid #2A3E40',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 2000,
                        fontSize: '13px',
                        fontWeight: '500'
                    }}>
                        {toast.type === 'error' ? (
                            <AlertCircle size={17} style={{ color: '#F87171' }} />
                        ) : (
                            <CheckCircle2 size={17} style={{ color: '#4ADE80' }} />
                        )}
                        <span>{toast.message}</span>
                        <button 
                            onClick={() => setToast({ ...toast, show: false })}
                            style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'inherit', 
                                cursor: 'pointer', 
                                padding: '2px',
                                marginLeft: '6px',
                                opacity: 0.7,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

// Clean Helper Styles
const cardLabelStyle = { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B' };
const cardValueStyle = { fontSize: '24px', fontWeight: '700', color: '#1C2A2B', margin: '0', letterSpacing: '-0.5px' };
const iconBadgeStyle = { width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const thStyle = { padding: '12px 16px', color: '#64748B', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '14px 16px', color: '#475569', fontSize: '13px' };

// Status Badge Styling Helper
const getStatusBadgeStyle = (status) => {
    const isPaid = status === 'Paid';
    const isPartial = status === 'Partial';

    return {
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        background: isPaid ? '#F0FDF4' : isPartial ? '#FEFCE8' : '#FEF2F2',
        color: isPaid ? '#166534' : isPartial ? '#854D0E' : '#991B1B',
        border: `1px solid ${isPaid ? '#BBF7D0' : isPartial ? '#FEF08A' : '#FECACA'}`
    };
};

export default AdminRevenue;