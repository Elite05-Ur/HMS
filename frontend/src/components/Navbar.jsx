import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            {/* Logo / Brand Title */}
            <div style={styles.brandContainer}>
                <h2 style={styles.brandText}>HMS Portal</h2>
            </div>

            {/* User Profile & Actions */}
            {user && (
                <div style={styles.userSection}>
                    <div style={styles.userInfo}>
                        <span style={styles.welcomeText}>Welcome,</span>
                        <strong style={styles.userName}>{user.username}</strong>
                        <span style={styles.roleBadge}>{user.role?.toUpperCase()}</span>
                    </div>

                    <button 
                        onClick={handleLogout} 
                        style={styles.logoutBtn}
                        className="hms-logout-btn"
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* CSS styles injected for clean hover & mobile responsiveness */}
            <style>{`
                .hms-logout-btn {
                    transition: all 0.2s ease-in-out;
                }
                .hms-logout-btn:hover {
                    background-color: #581c87 !important;
                    color: #FAF7F2 !important;
                    border-color: #581c87 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(88, 28, 135, 0.2);
                }
                .hms-logout-btn:active {
                    transform: translateY(0);
                }

                @media (max-width: 640px) {
                    nav {
                        padding: 10px 16px !important;
                    }
                    .hms-welcome-text {
                        display: none;
                    }
                    .hms-role-badge {
                        font-size: 9px !important;
                        padding: 2px 6px !important;
                    }
                }
            `}</style>
        </nav>
    );
};

// 🎨 Theme Palette: Cream (#FAF7F2 / #F3EFE6) & Purple (#3B0764 / #581C87)
const styles = {
    nav: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 28px',
        backgroundColor: 'rgba(243, 239, 230, 0.75)', // Soft Cream Liquid Glass Base
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(88, 28, 135, 0.12)', // Subtle Purple Accent Border
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(59, 7, 100, 0.04)'
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    brandText: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '700',
        color: '#3B0764', // Deep Royal Purple
        letterSpacing: '-0.3px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        color: '#4A4052',
        background: 'rgba(255, 255, 255, 0.55)',
        padding: '6px 12px',
        borderRadius: '6px', // Standard clean border radius
        border: '1px solid rgba(88, 28, 135, 0.08)'
    },
    welcomeText: {
        color: '#7E6E85'
    },
    userName: {
        color: '#3B0764',
        fontWeight: '600'
    },
    roleBadge: {
        fontSize: '10px',
        fontWeight: '700',
        backgroundColor: '#581C87',
        color: '#FAF7F2',
        padding: '2px 8px',
        borderRadius: '4px',
        letterSpacing: '0.5px',
        marginLeft: '4px'
    },
    logoutBtn: {
        padding: '7px 16px',
        backgroundColor: 'transparent',
        color: '#581C87',
        border: '1px solid #581C87',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        outline: 'none'
    }
};

export default Navbar;