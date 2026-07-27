import { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const StaffSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        role: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        setProfile({
            name: user.name || 'Staff Member',
            email: user.email || 'staff@hospital.com',
            phone: user.phone || 'N/A',
            role: user.role || 'staff'
        });
    }, []);

    // Profile Update Handler
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });
        setLoading(true);

        try {
            await API.put('/auth/update-profile', profile);
            
            const currentUser = JSON.parse(localStorage.getItem('user')) || {};
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...profile }));

            setMsg({ type: 'success', text: 'Profile details updated successfully!' });
        } catch (err) {
            console.error("Profile Update Error:", err);
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    // Password Change Handler
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMsg({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMsg({ type: 'error', text: 'New password and confirm password do not match!' });
            return;
        }

        setLoading(true);
        try {
            await API.put('/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            setMsg({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error("Password Change Error:", err);
            setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px 48px', boxSizing: 'border-box', maxWidth: '1200px' }}>
                
                {/* Header Block */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '28px' }}>⚙️</span>
                        <h1 style={{ margin: 0, color: '#1E293B', fontSize: '28px', fontWeight: '700' }}>Account Settings</h1>
                    </div>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '15px' }}>
                        Manage your staff profile credentials and portal security.
                    </p>
                </div>

                {/* Banner Notifications */}
                {msg.text && (
                    <div style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: msg.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                        color: msg.type === 'success' ? '#166534' : '#991B1B',
                        border: `1px solid ${msg.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontSize: '16px' }}>{msg.type === 'success' ? '✓' : '⚠️'}</span>
                        {msg.text}
                    </div>
                )}

                {/* Settings Layout Card */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                    overflow: 'hidden'
                }}>
                    
                    {/* Navigation Tabs */}
                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid #E2E8F0',
                        background: '#FAFAFA',
                        padding: '0 24px'
                    }}>
                        <button
                            onClick={() => { setActiveTab('profile'); setMsg({ type: '', text: '' }); }}
                            style={{
                                padding: '16px 20px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: activeTab === 'profile' ? '#7A8F6E' : '#64748B',
                                borderBottom: activeTab === 'profile' ? '3px solid #7A8F6E' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                        >
                            👤 Personal Profile
                        </button>
                        <button
                            onClick={() => { setActiveTab('security'); setMsg({ type: '', text: '' }); }}
                            style={{
                                padding: '16px 20px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: activeTab === 'security' ? '#7A8F6E' : '#64748B',
                                borderBottom: activeTab === 'security' ? '3px solid #7A8F6E' : '3px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                            }}
                        >
                            🔒 Security & Password
                        </button>
                    </div>

                    {/* Tab 1: Profile Details */}
                    {activeTab === 'profile' && (
                        <div style={{ padding: '32px', maxWidth: '600px' }}>
                            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={profile.name} 
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Email Address (Read-Only)</label>
                                    <input 
                                        type="email" 
                                        value={profile.email} 
                                        style={readOnlyStyle}
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={profile.phone} 
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Portal Role</label>
                                    <input 
                                        type="text" 
                                        value={profile.role.toUpperCase()} 
                                        style={{ ...readOnlyStyle, fontWeight: '700', letterSpacing: '0.5px' }}
                                        disabled
                                    />
                                </div>

                                <div style={{ paddingTop: '10px' }}>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{
                                            ...primaryBtnStyle,
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 2: Security & Password */}
                    {activeTab === 'security' && (
                        <div style={{ padding: '32px', maxWidth: '600px' }}>
                            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                
                                <div>
                                    <label style={labelStyle}>Current Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Enter current password"
                                        value={passwordData.oldPassword} 
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>New Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Enter new password"
                                        value={passwordData.newPassword} 
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="Re-type new password"
                                        value={passwordData.confirmPassword} 
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={{ paddingTop: '10px' }}>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{
                                            ...primaryBtnStyle,
                                            opacity: loading ? 0.7 : 1,
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {loading ? 'Updating Password...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>

                {/* Footer / System Status */}
                <div style={{
                    marginTop: '28px',
                    padding: '16px 20px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                        🏥 Hospital Management System • <strong>v2.4 (SaaS Multi-Role)</strong>
                    </span>
                    <span style={{ fontSize: '13px', color: '#7A8F6E', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#7A8F6E', display: 'inline-block' }}></span>
                        Connected to Server
                    </span>
                </div>

            </main>
        </div>
    );
};

// UI Element Styles
const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155'
};

const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    outline: 'none',
    boxSizing: 'border-box',
    fontSize: '14px',
    color: '#0F172A',
    background: '#FFFFFF',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
};

const readOnlyStyle = {
    ...inputStyle,
    background: '#F1F5F9',
    color: '#64748B',
    borderColor: '#E2E8F0',
    cursor: 'not-allowed'
};

const primaryBtnStyle = {
    width: '100%',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#FFFFFF',
    background: '#7A8F6E',
    transition: 'background 0.2s ease'
};

export default StaffSettings;