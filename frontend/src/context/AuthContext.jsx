import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
    try {
        const savedUser = localStorage.getItem('hms_user');
        return (savedUser && savedUser !== "undefined") ? JSON.parse(savedUser) : null;
    } catch (e) {
        return null;
    }
});
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('hms_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hms_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);