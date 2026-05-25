import { createContext, useContext, useState, useEffect } from 'react';
import { signUpWithEmail, loginWithEmail, getUserData, updateUserData } from '../services/firebaseRest';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.localId, parsedUser.idToken);
    }
    setLoading(false);
  }, []);

  const loadUserData = async (userId, idToken) => {
    try {
      const data = await getUserData(userId, idToken);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signUp = async (email, password, name = '') => {
    const data = await signUpWithEmail(email, password);
    setUser(data);
    const profile = { name, phone: '', addresses: [] };
    await updateUserData(data.localId, profile, data.idToken);
    setUserData(profile);
    return data;
  };

  const login = async (email, password) => {
    const data = await loginWithEmail(email, password);
    setUser(data);
    await loadUserData(data.localId, data.idToken);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserData(null);
  };

  const updateProfile = async (data) => {
    if (!user) throw new Error('User not authenticated');
    const updatedData = await updateUserData(user.localId, data, user.idToken);
    setUserData(parseUserData(updatedData));
    return updatedData;
  };

  const parseUserData = (doc) => {
    if (!doc || !doc.fields) return {};
    const result = {};
    for (const [key, value] of Object.entries(doc.fields)) {
      if (value.stringValue !== undefined) {
        result[key] = value.stringValue;
      } else if (value.arrayValue?.values) {
        result[key] = value.arrayValue.values.map(v => v.stringValue);
      }
    }
    return result;
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
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
