import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        // Agar staff admin page par jaane ki koshish kare
        return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/staff-dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;