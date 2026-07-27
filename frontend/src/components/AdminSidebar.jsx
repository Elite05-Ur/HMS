import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    UserCheck, 
    TrendingUp, 
    Settings, 
    LogOut, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const mainNavItems = [
        { path: '/admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
        { path: '/admin/staff', label: 'Manage Staff & Users', icon: Users },
        { path: '/admin/accounts', label: 'Manage Accounts', icon: UserCheck },
        { path: '/admin/revenue', label: 'Financial Analytics', icon: TrendingUp },
    ];

    return (
        <aside style={{
            width: collapsed ? '75px' : '250px',
            minHeight: '100vh',
            height: '100vh',
            position: 'sticky',
            top: 0,
            /* Dark Charcoal Base to give high-end contrast with Taupe & Off-White */
            backgroundColor: '#1C1917',
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
                .admin-sidebar-link {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 12px 18px;
                    color: #A8A29E;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease-in-out;
                    white-space: nowrap;
                    margin: 3px 0;
                }

                .admin-sidebar-link:hover {
                    color: #554940; /* Taupe Hover */
                    background: rgba(85, 73, 64, 0.15);
                }

                /* Exact Match Admin Page Background Active Effect */
                .admin-sidebar-link.active {
                    background: #FAF8F5 !important; /* Main Admin page background color */
                    color: #292524 !important;
                    font-weight: 600;
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                    margin-left: 8px;
                }

                /* Active Taupe Icon Accent */
                .admin-sidebar-link.active .icon-box {
                    color: #554940;
                    transform: scale(1.08);
                }

                /* Floating Tooltip in Collapsed View */
                .collapsed-tooltip {
                    position: absolute;
                    left: 70px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #292524;
                    color: #FAF8F5;
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

                .collapsed-mode .admin-sidebar-link:hover .collapsed-tooltip {
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
                            <h2 style={{ fontSize: '16px', color: '#FAF8F5', margin: 0, fontWeight: '700' }}>
                                Admin Panel
                            </h2>
                            <span style={{ fontSize: '10px', color: '#554940', fontWeight: '700', letterSpacing: '0.5px' }}>
                                SYSTEM MANAGEMENT
                            </span>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#554940',
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
                                className={`admin-sidebar-link ${active ? 'active' : ''}`}
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
                <div className="sidebar-divider" />

                {/* Settings Link */}
                <Link 
                    to="/admin/settings" 
                    className={`admin-sidebar-link ${isActive('/admin/settings') ? 'active' : ''}`}
                    style={{
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        paddingLeft: collapsed ? '0' : '18px'
                    }}
                >
                    <div className="icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <Settings size={20} />
                    </div>
                    {!collapsed && <span>System Settings</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip">
                            System Settings
                        </div>
                    )}
                </Link>

                <div className="sidebar-divider" />

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="admin-sidebar-link"
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
                    {!collapsed && <span>Logout Admin</span>}

                    {collapsed && (
                        <div className="collapsed-tooltip" style={{ background: '#7F1D1D' }}>
                            Logout Admin
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;