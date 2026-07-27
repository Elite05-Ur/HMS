import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Stethoscope, 
    Calendar, 
    FolderKanban, 
    CreditCard, 
    Settings, 
    LogOut, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true); // Default sleek state

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const mainNavItems = [
        { path: '/staff-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/patients', label: 'Patient Records', icon: Users },
        { path: '/doctors', label: 'Doctors List', icon: Stethoscope },
        { path: '/appointments', label: 'Appointments', icon: Calendar },
        { path: '/reports', label: 'Medical Reports', icon: FolderKanban },
        { path: '/billing', label: 'Billing & Payments', icon: CreditCard },
    ];

    return (
        <aside style={{
            width: collapsed ? '75px' : '250px',
            minHeight: '100vh',
            height: '100vh',
            position: 'sticky',
            top: 0,
            /* Dark Slate/Charcoal Base to contrast with Soft-Green & White Page */
            backgroundColor: '#1E232A',
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
                .sidebar-link {
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

                .sidebar-link:hover {
                    color: #879A77; /* Soft Green Hover */
                    background: rgba(135, 154, 119, 0.08);
                }

                /* Exact Match Page Background Active Effect */
                .sidebar-link.active {
                    background: #F7F9F6 !important; /* Main page background color */
                    color: #2D3748 !important;
                    font-weight: 600;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                    margin-left: 8px;
                }

                /* Active Soft Green Icon Accent */
                .sidebar-link.active .icon-box {
                    color: #879A77;
                    transform: scale(1.08);
                }

                /* Floating Tooltip in Collapsed View */
                .collapsed-tooltip {
                    position: absolute;
                    left: 70px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #2D3748;
                    color: #F7F9F6;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
                    z-index: 1000;
                }

                .collapsed-mode .sidebar-link:hover .collapsed-tooltip {
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
                            <h2 style={{ fontSize: '16px', color: '#F7F9F6', margin: 0, fontWeight: '700' }}>
                                HMS Portal
                            </h2>
                            <span style={{ fontSize: '11px', color: '#879A77', fontWeight: '600' }}>Staff Panel</span>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#879A77',
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
                                className={`sidebar-link ${active ? 'active' : ''}`}
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

            {/* Bottom Section (Settings & Logout with Separator) */}
            <div className={collapsed ? 'collapsed-mode' : ''}>
                {/* Separator Line 1 */}
                <div className="sidebar-divider" />

                {/* Settings Link */}
                <Link 
                    to="/settings" 
                    className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}
                    style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        paddingLeft: collapsed ? '0' : '18px'
                    }}
                >
                    <div className="icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <Settings size={20} />
                    </div>
                    {!collapsed && <span>Portal Settings</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip">
                            Portal Settings
                        </div>
                    )}
                </Link>

                {/* Separator Line 2 */}
                <div className="sidebar-divider" />

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="sidebar-link"
                    style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        paddingLeft: collapsed ? '0' : '18px',
                        color: '#E53E3E' // Red Logout Accent
                    }}
                >
                    <div className="icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <LogOut size={20} />
                    </div>
                    {!collapsed && <span>Logout</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip" style={{ background: '#792828' }}>
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;