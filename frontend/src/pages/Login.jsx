import { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    Stethoscope, 
    ClipboardList, 
    Lock, 
    Mail, 
    ArrowRight, 
    AlertCircle, 
    CheckCircle2, 
    X,
    Building2,
    Sparkles,
    KeyRound
} from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'doctor' | 'staff'
    const { login } = useAuth();
    const navigate = useNavigate();

    // Bottom-Right Corner Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'error' });
        }, 3500);
    };

    // Role-Based Dynamic Themes Configuration
    const themeConfig = {
        admin: {
            title: "System Administrator",
            primary: "#1C2A2B",      // Dark Slate
            secondary: "#2A3E40",
            lightBg: "#F0F4F4",
            accentBorder: "rgba(28, 42, 43, 0.2)",
            icon: ShieldCheck,
            desc: "Full system governance, access controls & revenue analytics"
        },
        doctor: {
            title: "Medical Specialist",
            primary: "#0E8388",      // Doctor Teal
            secondary: "#0B666A",
            lightBg: "#EBF7F7",
            accentBorder: "rgba(14, 131, 136, 0.2)",
            icon: Stethoscope,
            desc: "Patient care plans, digital prescriptions & appointments"
        },
        staff: {
            title: "Hospital Operations Staff",
            primary: "#556B2F",      // Olive Green
            secondary: "#3E4E22",
            lightBg: "#F4F6F0",
            accentBorder: "rgba(85, 107, 47, 0.2)",
            icon: ClipboardList,
            desc: "Patient admissions, billing invoices & room allocations"
        }
    };

    const currentTheme = themeConfig[selectedRole];

    // Demo Credentials Helper
    const demoCredentials = [
        { role: 'admin', label: 'Admin Access', email: 'admin@gmail.com', pass: '123456password' },
        { role: 'doctor', label: 'Doctor Portal', email: 'doctor@gmail.com', pass: 'doc123' },
        { role: 'staff', label: 'Staff Workdesk', email: 'staff@gmail.com', pass: 'staf123' }
    ];

    const applyDemoCreds = (cred) => {
        setSelectedRole(cred.role);
        setFormData({ email: cred.email, password: cred.pass });
        showToast(`Auto-filled ${cred.label} demo credentials`, 'success');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await API.post('/auth/login', formData);
            
            // Fetch user returned from Backend
            const userData = res.data.user || res.data; 

            if (userData) {
                login(userData); // AuthContext + LocalStorage update

                showToast("Authentication successful! Redirecting...", "success");

                // Role check and navigation
                const userRole = userData.role?.toLowerCase();

                setTimeout(() => {
                    if (userRole === 'admin') {
                        navigate('/admin-dashboard', { replace: true });
                    } else if (userRole === 'doctor') {
                        navigate('/doctor-dashboard', { replace: true });
                    } else {
                        navigate('/staff-dashboard', { replace: true });
                    }
                }, 800);
            }
        } catch (err) {
            console.error("Login Error:", err);
            showToast(err.response?.data?.message || 'Login Failed. Check email & password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            fontFamily: "'Inter', sans-serif",
            padding: '24px',
            boxSizing: 'border-box'
        }}>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .toast-animation {
                    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .spinner {
                    animation: spin 0.8s linear infinite;
                }
                .login-card {
                    background: #FFFFFF;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
                    display: flex;
                    width: 100%;
                    max-width: 980px;
                    overflow: hidden;
                    border: 1px solid #E2E8F0;
                    transition: all 0.3s ease;
                }
                .demo-card {
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .demo-card:hover {
                    border-color: #CBD5E1;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transform: translateY(-1px);
                }
                .role-tab {
                    flex: 1;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                    color: #64748B;
                }
                .input-field {
                    width: 100%;
                    padding: 12px 14px 12px 42px;
                    border-radius: 10px;
                    border: 1px solid #CBD5E1;
                    font-size: 14px;
                    color: #1C2A2B;
                    outline: none;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                }
                .input-field:focus {
                    border-color: ${currentTheme.primary};
                    box-shadow: 0 0 0 3.5px ${currentTheme.accentBorder};
                }
                .btn-submit {
                    width: 100%;
                    padding: 13px;
                    background: ${currentTheme.primary};
                    color: #FFFFFF;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px ${currentTheme.accentBorder};
                }
                .btn-submit:hover {
                    background: ${currentTheme.secondary};
                    transform: translateY(-1px);
                }
                @media (max-width: 860px) {
                    .login-card {
                        flex-direction: column;
                    }
                    .left-panel {
                        padding: 32px 24px !important;
                    }
                }
            `}</style>

            <div className="login-card">
                
                {/* LEFT SIDE PANEL: Demo Accounts & System Info */}
                <div className="left-panel" style={{
                    flex: '1.1',
                    background: '#FAFAFA',
                    borderRight: '1px solid #E2E8F0',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                }}>
                    <div>
                        {/* Hospital Branding */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: '#1C2A2B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF'
                            }}>
                                <Building2 size={22} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1C2A2B', letterSpacing: '-0.3px' }}>
                                    City Care Hospital
                                </h2>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                    Health Management System
                                </span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', marginBottom: '6px' }}>
                                <Sparkles size={15} />
                                <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instant Portal Switch</span>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#0F172A' }}>
                                Sample Login Accounts
                            </h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748B', lineHeight: '1.4' }}>
                                Click on any account below to auto-fill credentials and test different user portals.
                            </p>
                        </div>

                        {/* Interactive Demo Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {demoCredentials.map((cred) => {
                                const isSelected = selectedRole === cred.role;
                                const theme = themeConfig[cred.role];
                                const IconComp = theme.icon;

                                return (
                                    <div 
                                        key={cred.role} 
                                        className="demo-card" 
                                        onClick={() => applyDemoCreds(cred)}
                                        style={{
                                            borderColor: isSelected ? theme.primary : '#E2E8F0',
                                            background: isSelected ? theme.lightBg : '#FFFFFF',
                                            boxShadow: isSelected ? `0 0 0 1px ${theme.primary}` : 'none'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '34px',
                                                height: '34px',
                                                borderRadius: '8px',
                                                background: isSelected ? theme.primary : '#F1F5F9',
                                                color: isSelected ? '#FFFFFF' : '#64748B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <IconComp size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1C2A2B' }}>
                                                    {cred.label}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                                                    {cred.email}
                                                </div>
                                            </div>
                                        </div>
                                        <KeyRound size={14} style={{ color: isSelected ? theme.primary : '#94A3B8' }} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', fontSize: '12px', color: '#94A3B8' }}>
                        © 2026 HMS Care Systems. Secure Role-Based Authorization Portal.
                    </div>
                </div>

                {/* RIGHT SIDE PANEL: Dynamic Role Login Form */}
                <div style={{ flex: '1.2', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
                    
                    {/* Role Theme Tabs Header */}
                    <div style={{
                        background: '#F1F5F9',
                        padding: '4px',
                        borderRadius: '10px',
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '28px'
                    }}>
                        {Object.keys(themeConfig).map((roleKey) => {
                            const isTabActive = selectedRole === roleKey;
                            const tabTheme = themeConfig[roleKey];
                            const TabIcon = tabTheme.icon;

                            return (
                                <button
                                    key={roleKey}
                                    type="button"
                                    className="role-tab"
                                    onClick={() => setSelectedRole(roleKey)}
                                    style={{
                                        background: isTabActive ? '#FFFFFF' : 'transparent',
                                        color: isTabActive ? tabTheme.primary : '#64748B',
                                        boxShadow: isTabActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                                    }}
                                >
                                    <TabIcon size={15} />
                                    <span style={{ textTransform: 'capitalize' }}>{roleKey}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Portal Info Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '20px', background: currentTheme.lightBg, color: currentTheme.primary, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                            <currentTheme.icon size={13} />
                            <span>{currentTheme.title}</span>
                        </div>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1C2A2B', letterSpacing: '-0.3px' }}>
                            Sign in to Portal
                        </h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                            {currentTheme.desc}
                        </p>
                    </div>

                    {/* Form Controls */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        
                        {/* Email Input */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input 
                                    className="input-field"
                                    type="email" 
                                    placeholder="e.g. name@citycare.com" 
                                    required 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                                    Password
                                </label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input 
                                    className="input-field"
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    value={formData.password} 
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                            {loading ? (
                                <span>Authenticating...</span>
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Redirection Footer */}
                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748B', margin: '24px 0 0 0' }}>
                        Don't have an registered account?{' '}
                        <Link to="/register" style={{ color: currentTheme.primary, fontWeight: '600', textDecoration: 'none' }}>
                            Register here
                        </Link>
                    </p>

                </div>

            </div>

            {/* Bottom-Right Corner Toast Notification Popup */}
            {toast.show && (
                <div className="toast-animation" style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    padding: '12px 18px',
                    background: toast.type === 'error' ? '#1E293B' : currentTheme.primary,
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2)',
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

        </div>
    );
};

export default Login;