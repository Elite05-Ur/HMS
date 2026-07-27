import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    Stethoscope, 
    Users, 
    FileText, 
    Clock, 
    UserCog, 
    LogOut, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

const DoctorSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const mainNavItems = [
        { path: '/doctor-dashboard', label: 'OPD Appointments Queue', icon: Stethoscope },
        { path: '/doctor/patients', label: 'Assigned Patients', icon: Users },
        { path: '/doctor/prescriptions', label: 'Write Prescriptions', icon: FileText },
        { path: '/doctor/schedule', label: 'OPD Duty Schedule', icon: Clock },
    ];

    return (
        <aside style={{
            width: collapsed ? '75px' : '250px',
            minHeight: '100vh',
            height: '100vh',
            position: 'sticky',
            top: 0,
            /* Deep Medical Slate / Dark Teal Theme Base */
            backgroundColor: '#1C2A2B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 0',
            boxSizing: 'border-box',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 99,
            overflowX: 'visible'
        }}>
            <style>{`
                /* Base Link Styling */
                .doc-sidebar-link {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 12px 18px;
                    color: #94A3B8;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease-in-out;
                    white-space: nowrap;
                    margin: 3px 0;
                }

                .doc-sidebar-link:hover {
                    color: #0E8388; /* Medical Sage Hover Accent */
                    background: rgba(14, 131, 136, 0.12);
                }

                /* Exact Match Doctor Page Cutout Active Effect */
                .doc-sidebar-link.active {
                    background: #F4F6F5 !important; /* Main Doctor Page Off-White Background */
                    color: #1C2A2B !important;
                    font-weight: 600;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                    margin-left: 8px;
                }

                /* Active Medical Teal Icon Accent */
                .doc-sidebar-link.active .icon-box {
                    color: #0E8388;
                    transform: scale(1.08);
                }

                /* Floating Tooltip in Collapsed View */
                .collapsed-tooltip {
                    position: absolute;
                    left: 70px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #1C2A2B;
                    color: #F4F6F5;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
                    z-index: 1000;
                }

                .collapsed-mode .doc-sidebar-link:hover .collapsed-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(-50%) translateX(4px);
                }

                /* Section Separator Line */
                .sidebar-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.08);
                    margin: 12px 16px;
                }
            `}</style>

            <div className={collapsed ? 'collapsed-mode' : ''}>
                {/* Header & Toggle Button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '0 16px',
                    marginBottom: '20px'
                }}>
                    {!collapsed && (
                        <div>
                            <h2 style={{ fontSize: '16px', color: '#F4F6F5', margin: 0, fontWeight: '700' }}>
                                Doctor Portal
                            </h2>
                            <span style={{ fontSize: '10px', color: '#0E8388', fontWeight: '700', letterSpacing: '0.5px' }}>
                                OPD & CLINICAL PANEL
                            </span>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#0E8388',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Main Navigation Items */}
                <nav>
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`doc-sidebar-link ${active ? 'active' : ''}`}
                                style={{
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    paddingLeft: collapsed ? '0' : '18px'
                                }}
                            >
                                <div className="icon-box" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease' }}>
                                    <Icon size={20} />
                                </div>
                                
                                {!collapsed && <span>{item.label}</span>}

                                {collapsed && (
                                    <div className="collapsed-tooltip">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section (Profile & Logout with Separator) */}
            <div className={collapsed ? 'collapsed-mode' : ''}>
                <div className="sidebar-divider" />

                {/* Doctor Profile Settings */}
                <Link 
                    to="/doctor/profile" 
                    className={`doc-sidebar-link ${isActive('/doctor/profile') ? 'active' : ''}`}
                    style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        paddingLeft: collapsed ? '0' : '18px'
                    }}
                >
                    <div className="icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <UserCog size={20} />
                    </div>
                    {!collapsed && <span>Doctor Profile</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip">
                            Doctor Profile
                        </div>
                    )}
                </Link>

                <div className="sidebar-divider" />

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="doc-sidebar-link"
                    style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        paddingLeft: collapsed ? '0' : '18px',
                        color: '#EF4444'
                    }}
                >
                    <div className="icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <LogOut size={20} />
                    </div>
                    {!collapsed && <span>Logout Account</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip" style={{ background: '#7F1D1D' }}>
                            Logout Account
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default DoctorSidebar;