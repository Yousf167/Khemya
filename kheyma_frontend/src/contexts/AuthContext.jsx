import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Normalize user object from backend to frontend format
  const normalizeUser = (userData, responseData) => {
    // Backend User model: email, type (ADMIN/USER), dob, address, etc.
    // Frontend expects: email, role (ROLE_ADMIN/ROLE_USER), name (optional)
    const user = userData || {
      email: responseData?.email,
      type: responseData?.userType,
    };
    
    // Map type to role for frontend compatibility
    if (user.type && !user.role) {
      user.role = user.type === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER';
    }
    
    return user;
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          const user = normalizeUser(response.data, null);
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          // Token invalid, clear storage
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      const user = normalizeUser(userData, response.data);
      
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (email, password, name = null) => {
    try {
      // Backend doesn't have name field, so we'll just send email and password
      const response = await authAPI.register({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      const user = normalizeUser(userData, response.data);
      
      // Store name locally if provided (not in backend)
      if (name) {
        user.name = name;
      }
      
      setToken(newToken);
      setUser(user);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = async (data) => {
    try {
      const response = await authAPI.updateMe(data);
      const user = normalizeUser(response.data, null);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Update failed',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

