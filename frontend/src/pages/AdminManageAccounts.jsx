import React, { useEffect, useState } from 'react';
import API from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import { 
    UserPlus, 
    Trash2, 
    AlertCircle, 
    CheckCircle,
    RefreshCw, 
    Users, 
    Stethoscope, 
    X
} from 'lucide-react';

const AdminManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Bottom-Corner Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        specialty: '',
        roomNo: '',
        fee: 1000
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    // Helper to trigger Bottom-Right Toast Notification
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    // Fetch both normal Users/Staff and Doctors
    const fetchUsers = async () => {
        setLoading(true);
        setErrorMsg('');

        let combinedData = [];

        // 1. Try fetching system users/staff
        try {
            const res = await API.get('/auth/users');
            const data = Array.isArray(res.data) ? res.data : (res.data?.users || res.data?.data || []);
            combinedData = [...data];
        } catch (err) {
            console.warn("Could not fetch /auth/users, trying alternate routes...");
            try {
                const resAlt = await API.get('/users');
                const altData = Array.isArray(resAlt.data) ? resAlt.data : (resAlt.data?.users || []);
                combinedData = [...altData];
            } catch (e) {
                console.error("Auth users fetch failed:", e);
            }
        }

        // 2. Try fetching Doctors specifically
        try {
            const docRes = await API.get('/doctor/all');
            const docs = Array.isArray(docRes.data) ? docRes.data : (docRes.data?.doctors || docRes.data?.data || []);
            
            const formattedDocs = docs.map(doc => ({
                _id: doc._id || doc.id,
                name: doc.name || doc.doctorName,
                email: doc.email || `${(doc.name || 'doctor').toLowerCase().replace(/\s+/g, '')}@hospital.com`,
                role: 'doctor',
                specialty: doc.specialty || doc.specialization,
                roomNo: doc.roomNo || doc.room,
                fee: doc.fee || doc.fees || 1000
            }));

            const userMap = new Map();
            // First, add all general users to a map using their email as the key.
            combinedData.forEach(u => userMap.set(u.email, u));

            // Now, iterate through doctors and merge/add them.
            formattedDocs.forEach(doc => {
                if (userMap.has(doc.email)) {
                    // If a user with this email already exists, enrich that record with doctor details.
                    const user = userMap.get(doc.email);
                    Object.assign(user, doc); // This will overwrite role, and add specialty, etc.
                } else {
                    // If this doctor is not in the user list, add them to the map.
                    userMap.set(doc.email, doc);
                }
            });
            combinedData = Array.from(userMap.values());
        } catch (err) {
            console.warn("Could not fetch /doctor/all endpoint:", err.message);
        }

        if (combinedData.length > 0) {
            setUsers(combinedData);
        } else {
            setErrorMsg("Failed to load accounts. Please check your backend server API connectivity.");
        }

        setLoading(false);
    };

    // Account Creation Handler
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            if (formData.role === 'doctor') {
                const doctorPayload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'doctor',
                    specialty: formData.specialty,
                    roomNo: formData.roomNo,
                    fee: formData.fee
                };

                try {
                    await API.post('/doctor/add', doctorPayload);
                } catch (err) {
                    await API.post('/auth/register-staff', doctorPayload);
                }

                showToast(`Doctor profile created for Dr. ${formData.name}`, 'success');
            } else {
                const userPayload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                };

                try {
                    await API.post('/auth/register-staff', userPayload);
                } catch (err) {
                    await API.post('/auth/register', userPayload);
                }

                showToast(`Account created for ${formData.name} (${formData.role.toUpperCase()})`, 'success');
            }

            setShowModal(false);
            resetForm();
            fetchUsers();

        } catch (err) {
            console.error("Account Creation Error:", err);
            const msg = err.response?.data?.message || "Failed to create user account.";
            showToast(msg, 'error');
        }
    };

    // Delete User Handler
    const handleDeleteUser = async (userId, role) => {
        if (!window.confirm(`Are you sure you want to delete this ${role.toUpperCase()} account?`)) return;

        try {
            if (role === 'doctor') {
                try {
                    await API.delete(`/doctor/${userId}`);
                } catch (err) {
                    await API.delete(`/auth/user/${userId}`);
                }
            } else {
                await API.delete(`/auth/user/${userId}`);
            }

            showToast("Account removed successfully.", 'success');
            fetchUsers();
        } catch (err) {
            console.error("Delete Error:", err);
            showToast("Failed to delete account from backend.", 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'staff',
            specialty: '',
            roomNo: '',
            fee: 1000
        });
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F8FAFC', 
            color: '#1C2A2B',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
        }}>
            
            {/* Left Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
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
                    .white-glass-card {
                        background: rgba(255, 255, 255, 0.85);
                        backdrop-filter: blur(12px);
                        -webkit-backdrop-filter: blur(12px);
                        border: 1px solid rgba(226, 232, 240, 0.8);
                        border-radius: 16px;
                        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                        box-shadow: 0 4px 20px -2px rgba(28, 42, 43, 0.03);
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
                    .input-field {
                        width: 100%;
                        padding: 10px 14px;
                        border-radius: 8px;
                        border: 1px solid #E2E8F0;
                        background: #F8FAFC;
                        color: #1C2A2B;
                        font-size: 13px;
                        outline: none;
                        transition: all 0.2s ease;
                        box-sizing: border-box;
                    }
                    .input-field:focus {
                        border-color: #1C2A2B;
                        background: #FFFFFF;
                        box-shadow: 0 0 0 3px rgba(28, 42, 43, 0.08);
                    }
                    .delete-btn {
                        background: transparent;
                        color: #EF4444;
                        border: 1px solid rgba(239, 68, 68, 0.2);
                        transition: all 0.2s ease;
                    }
                    .delete-btn:hover {
                        background: #FEF2F2;
                        border-color: #EF4444;
                    }
                `}</style>

                {/* Header Section */}
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
                            <Users size={24} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', letterSpacing: '-0.3px', color: '#1C2A2B' }}>
                                Manage Accounts
                            </h1>
                            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px', fontWeight: '400' }}>
                                Provision internal system credentials for Staff, Doctors, and Admins
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowModal(true)}
                        className="primary-btn"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        <UserPlus size={16} />
                        <span>Create Account</span>
                    </button>
                </header>

                {/* Top Error Banner for API/Network Connection Issues */}
                {errorMsg && (
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
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Users List Table Container */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>
                        <RefreshCw size={32} className="spin-icon" style={{ marginBottom: '16px', color: '#1C2A2B' }} />
                        <p style={{ fontWeight: '400', fontSize: '14px' }}>Loading registered accounts...</p>
                    </div>
                ) : (
                    <div className="white-glass-card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', background: 'rgba(241, 245, 249, 0.6)' }}>
                                    <th style={thStyle}>Full Name</th>
                                    <th style={thStyle}>Email / Login ID</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={thStyle}>Doctor Details</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((usr, idx) => (
                                        <tr key={usr._id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ ...tdStyle, fontWeight: '500', color: '#1C2A2B' }}>
                                                {usr.name || 'N/A'}
                                            </td>
                                            <td style={tdStyle}>{usr.email || 'N/A'}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    letterSpacing: '0.3px',
                                                    background: usr.role === 'admin' ? '#FEF2F2' : usr.role === 'doctor' ? '#DCFCE7' : '#F1F5F9',
                                                    color: usr.role === 'admin' ? '#991B1B' : usr.role === 'doctor' ? '#16A34A' : '#1C2A2B',
                                                    border: `1px solid ${usr.role === 'admin' ? '#FCA5A5' : usr.role === 'doctor' ? '#86EFAC' : '#CBD5E1'}`
                                                }}>
                                                    {(usr.role || 'staff').toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                {usr.role === 'doctor' || usr.specialty ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '12px' }}>
                                                        <span style={{ fontWeight: '500', color: '#1C2A2B' }}>{usr.specialty || 'General'}</span>
                                                        <span style={{ color: '#64748B' }}>Room: {usr.roomNo || 'N/A'} • Fee: Rs.{usr.fee || 1000}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {usr.role !== 'admin' && (
                                                    <button 
                                                        onClick={() => handleDeleteUser(usr._id, usr.role || 'staff')}
                                                        className="delete-btn"
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            borderRadius: '8px', 
                                                            cursor: 'pointer', 
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '14px' }}>
                                            No user accounts registered yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Account Creation Modal */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1C2A2B' }}>Create Account</h2>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>Fill in details to provision a new user profile</p>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Dr. Salman / Receptionist Staff"
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Email (Login Identifier) *</label>
                                    <input 
                                        type="email" 
                                        placeholder="user@hospital.com"
                                        value={formData.email} 
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Temporary Password *</label>
                                    <input 
                                        type="password" 
                                        placeholder="Set initial password"
                                        value={formData.password} 
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-field"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>System Access Role *</label>
                                    <select 
                                        value={formData.role} 
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="staff">Staff / Receptionist</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="admin">System Admin</option>
                                    </select>
                                </div>

                                {/* Dynamic Doctor Profile Fields */}
                                {formData.role === 'doctor' && (
                                    <div style={{ 
                                        background: '#F8FAFC', 
                                        padding: '16px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #E2E8F0', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '12px' 
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1C2A2B', fontWeight: '500', fontSize: '12px' }}>
                                            <Stethoscope size={14} /> Doctor Profile Setup
                                        </div>
                                        
                                        <div>
                                            <label style={labelStyle}>Specialization *</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Cardiologist, Neurologist"
                                                value={formData.specialty} 
                                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                className="input-field"
                                                required={formData.role === 'doctor'} 
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <div>
                                                <label style={labelStyle}>OPD Room No. *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Room 102"
                                                    value={formData.roomNo} 
                                                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                                                    className="input-field"
                                                    required={formData.role === 'doctor'} 
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Consultation Fee (Rs.)</label>
                                                <input 
                                                    type="number" 
                                                    value={formData.fee} 
                                                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        style={{ 
                                            padding: '10px 16px', 
                                            border: '1px solid #CBD5E1', 
                                            borderRadius: '8px', 
                                            background: '#FFFFFF', 
                                            color: '#64748B', 
                                            cursor: 'pointer', 
                                            fontWeight: '500',
                                            fontSize: '13px' 
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="primary-btn"
                                        style={{ 
                                            padding: '10px 18px', 
                                            borderRadius: '8px', 
                                            cursor: 'pointer', 
                                            fontWeight: '500',
                                            fontSize: '13px' 
                                        }}
                                    >
                                        Save Account
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* Bottom-Right Corner Toast Notification Popup */}
                {toast.show && (
                    <div className="toast-animation" style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        padding: '14px 20px',
                        background: toast.type === 'error' ? '#FEF2F2' : '#1C2A2B',
                        color: toast.type === 'error' ? '#991B1B' : '#FFFFFF',
                        border: toast.type === 'error' ? '1px solid #FCA5A5' : '1px solid #2A3E40',
                        borderRadius: '12px',
                        boxShadow: '0 12px 30px -4px rgba(28, 42, 43, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        zIndex: 2000,
                        fontSize: '13px',
                        fontWeight: '500'
                    }}>
                        {toast.type === 'error' ? (
                            <AlertCircle size={18} style={{ color: '#EF4444' }} />
                        ) : (
                            <CheckCircle size={18} style={{ color: '#4ADE80' }} />
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
                                marginLeft: '8px',
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

// Styles
const thStyle = { 
    padding: '14px 20px', 
    color: '#64748B', 
    fontSize: '11px', 
    fontWeight: '600', 
    textTransform: 'uppercase',
    letterSpacing: '0.6px'
};

const tdStyle = { 
    padding: '16px 20px', 
    color: '#334155', 
    fontSize: '13px',
    fontWeight: '400'
};

const labelStyle = { 
    display: 'block', 
    marginBottom: '6px', 
    fontSize: '12px', 
    fontWeight: '500', 
    color: '#64748B' 
};

const modalOverlayStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: 'rgba(28, 42, 43, 0.4)', 
    backdropFilter: 'blur(4px)',
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000 
};

const modalContentStyle = { 
    background: '#FFFFFF', 
    padding: '28px', 
    borderRadius: '16px', 
    width: '460px', 
    maxWidth: '90%', 
    boxShadow: '0 20px 40px -10px rgba(28, 42, 43, 0.15)',
    border: '1px solid rgba(226, 232, 240, 0.8)'
};

export default AdminManageAccounts;