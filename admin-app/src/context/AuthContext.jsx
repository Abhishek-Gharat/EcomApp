import { createContext, useContext, useState, useEffect } from 'react';
import { loginWithEmail } from '../services/firebaseRest';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Check for admin email
    if (!email.includes('admin')) {
      throw new Error('Access denied. Admin credentials required.');
    }
    
    const data = await loginWithEmail(email, password);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    idToken: user?.idToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
