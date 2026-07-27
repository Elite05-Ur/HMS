import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminSidebar from '../components/AdminSidebar';

const AdminStaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        specialty: '', // Used if role is doctor
        roomNo: ''     // Used if role is doctor
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await API.get('/auth/users'); // Adjust backend route if needed
            setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
        } catch (err) {
            console.error("Fetch Users Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register-staff', formData); // Backend register route
            alert("New staff/doctor account created successfully!");
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'staff', specialty: '', roomNo: '' });
            fetchUsers();
        } catch (err) {
            console.error("User Creation Error:", err);
            alert(err.response?.data?.message || "Failed to create account.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        try {
            await API.delete(`/auth/user/${userId}`);
            fetchUsers();
        } catch (err) {
            console.error("Delete Error:", err);
            alert("Failed to delete user.");
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            
            {/* 👈 Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main style={{ flex: 1, padding: '30px 40px', boxSizing: 'border-box' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '26px' }}>Staff & Users Management</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Register new staff members, doctors, and control system access roles
                        </p>
                    </div>

                    <button 
                        onClick={() => setShowModal(true)}
                        style={{
                            padding: '10px 18px',
                            background: '#0284c7',
                            color: '#fff',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                        }}
                    >
                        + Register New User
                    </button>
                </div>

                {/* Users List Table */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                        <h3>Loading User Accounts...</h3>
                    </div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={thStyle}>User Name</th>
                                    <th style={thStyle}>Email Address</th>
                                    <th style={thStyle}>Role</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((usr) => (
                                        <tr key={usr._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ ...tdStyle, fontWeight: 'bold' }}>{usr.name || 'N/A'}</td>
                                            <td style={tdStyle}>{usr.email}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    background: usr.role === 'admin' ? '#fee2e2' : usr.role === 'doctor' ? '#dcfce7' : '#e0f2fe',
                                                    color: usr.role === 'admin' ? '#b91c1c' : usr.role === 'doctor' ? '#15803d' : '#0369a1'
                                                }}>
                                                    {usr.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {usr.role !== 'admin' && (
                                                    <button 
                                                        onClick={() => handleDeleteUser(usr._id)}
                                                        style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                            No user accounts registered.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Register Modal */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <h2 style={{ marginTop: 0, color: '#0f172a' }}>Register New User Account</h2>
                            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input 
                                        type="text" 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={inputStyle} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Password *</label>
                                    <input 
                                        type="password" 
                                        value={formData.password} 
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={inputStyle} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Assign Role *</label>
                                    <select 
                                        value={formData.role} 
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="staff">Staff / Receptionist</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="admin">System Admin</option>
                                    </select>
                                </div>

                                {/* Additional Doctor Fields if Role == Doctor */}
                                {formData.role === 'doctor' && (
                                    <>
                                        <div>
                                            <label style={labelStyle}>Specialization *</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Cardiologist"
                                                value={formData.specialty} 
                                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                style={inputStyle} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>OPD Room Number *</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Room 102"
                                                value={formData.roomNo} 
                                                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                                                style={inputStyle} 
                                                required 
                                            />
                                        </div>
                                    </>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        style={{ padding: '10px 16px', border: 'none', borderRadius: '6px', background: '#cbd5e1', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        style={{ padding: '10px 16px', border: 'none', borderRadius: '6px', background: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Create Account
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

const thStyle = { padding: '14px 16px', color: '#475569', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 16px', color: '#334155', fontSize: '14px' };
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: '#475569' };
const inputStyle = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', padding: '25px', borderRadius: '12px', width: '450px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };

export default AdminStaffManagement;