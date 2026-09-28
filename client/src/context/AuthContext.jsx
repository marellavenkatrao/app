import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nec_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    // Fetch demo accounts for quick switcher
    const fetchAccounts = async () => {
      try {
        const res = await authApi.getDemoUsers();
        setDemoAccounts(res.data.users || []);
        
        // If no user is logged in, auto-login as HOD CSE for seamless first impression!
        if (!localStorage.getItem('nec_token') && res.data.users && res.data.users.length > 0) {
          const defaultHod = res.data.users.find(u => u.role === 'HOD') || res.data.users[0];
          await demoLogin(defaultHod._id);
        }
      } catch (err) {
        console.error('Failed to load demo accounts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { token, user } = res.data;
    localStorage.setItem('nec_token', token);
    localStorage.setItem('nec_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const demoLogin = async (userId) => {
    const res = await authApi.demoLogin(userId);
    const { token, user } = res.data;
    localStorage.setItem('nec_token', token);
    localStorage.setItem('nec_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('nec_token');
    localStorage.removeItem('nec_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, demoAccounts, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
