import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { 
    Settings, 
    Building2, 
    MapPin, 
    Phone, 
    Mail, 
    Save, 
    CheckCircle2, 
    AlertCircle, 
    X 
} from 'lucide-react';

const AdminSettings = () => {
    const [hospitalInfo, setHospitalInfo] = useState({
        name: 'City Care Hospital',
        address: 'Main Boulevard, Sector 5, Lahore',
        contact: '+92 300 1234567',
        email: 'info@citycare.com'
    });

    // Bottom-Right Corner Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    const handleSave = (e) => {
        e.preventDefault();
        showToast("System configurations saved successfully!", "success");
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', color: '#1C2A2B', fontFamily: "'Inter', sans-serif" }}>
            
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .toast-animation {
                    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .settings-card {
                    background: #FFFFFF;
                    border: 1px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 4px 20px -2px rgba(28, 42, 43, 0.04);
                    width: 100%;
                    max-width: 620px;
                }
                .form-input {
                    width: 100%;
                    padding: 11px 14px 11px 40px;
                    border-radius: 8px;
                    border: 1px solid #CBD5E1;
                    font-size: 13.5px;
                    color: #1C2A2B;
                    outline: none;
                    box-sizing: border-box;
                    transition: all 0.2s ease;
                    background: #FFFFFF;
                }
                .form-input:focus {
                    border-color: #1C2A2B;
                    box-shadow: 0 0 0 3px rgba(28, 42, 43, 0.08);
                }
                .btn-save {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 12px;
                    background: #1C2A2B;
                    color: #FFFFFF;
                    border: 1px solid #1C2A2B;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: all 0.2s ease;
                }
                .btn-save:hover {
                    background: #2A3E40;
                    box-shadow: 0 6px 16px rgba(28, 42, 43, 0.18);
                }
            `}</style>

            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Center-Aligned Workspace */}
            <main style={{ 
                flex: 1, 
                padding: '40px', 
                boxSizing: 'border-box', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                overflowY: 'auto' 
            }}>
                
                {/* Header Container */}
                <header style={{ width: '100%', maxWidth: '620px', marginBottom: '28px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                        }}>
                            <Settings size={22} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1C2A2B', letterSpacing: '-0.3px' }}>
                                Hospital System Settings
                            </h1>
                            <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                                Configure general hospital details, billing headers, and system preferences
                            </p>
                        </div>
                    </div>
                </header>

                {/* Form Card */}
                <div className="settings-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F1F5F9' }}>
                        <Building2 size={18} color="#1C2A2B" />
                        <h3 style={{ margin: 0, color: '#1C2A2B', fontSize: '15px', fontWeight: '600' }}>
                            General Organization Profile
                        </h3>
                    </div>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        
                        {/* Hospital Name */}
                        <div>
                            <label style={labelStyle}>Hospital Name</label>
                            <div style={{ position: 'relative' }}>
                                <Building2 size={16} style={inputIconStyle} />
                                <input 
                                    className="form-input"
                                    type="text" 
                                    value={hospitalInfo.name} 
                                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                                    placeholder="Enter hospital name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Hospital Address */}
                        <div>
                            <label style={labelStyle}>Hospital Address</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} style={inputIconStyle} />
                                <input 
                                    className="form-input"
                                    type="text" 
                                    value={hospitalInfo.address} 
                                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                                    placeholder="Enter physical address"
                                    required
                                />
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div>
                            <label style={labelStyle}>Contact Phone</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={inputIconStyle} />
                                <input 
                                    className="form-input"
                                    type="text" 
                                    value={hospitalInfo.contact} 
                                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, contact: e.target.value })}
                                    placeholder="Enter helpline number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Official Email */}
                        <div>
                            <label style={labelStyle}>Official Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={inputIconStyle} />
                                <input 
                                    className="form-input"
                                    type="email" 
                                    value={hospitalInfo.email} 
                                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                                    placeholder="Enter admin email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-save">
                            <Save size={16} />
                            <span>Save System Configurations</span>
                        </button>

                    </form>
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

// Style Helpers
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px', uppercase: 'true' };
const inputIconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' };

export default AdminSettings;