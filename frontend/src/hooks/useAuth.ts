import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAppContext } from '../context/AppContext';

const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    login: loginContext, 
    logout: logoutContext,
    updateUser: updateUserContext,
    setLoading,
    setError,
    clearError
  } = useAppContext();

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    clearError();
    
    try {
      console.log('Attempting login with:', { email });
      const data = await authAPI.login({ email, password });
      console.log('Login response:', data);
      if (data?.requiresOtp) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        return false;
      }

      if (data) {
        // Store user data in context
        loginContext(data, data.token);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loginContext, setLoading, setError, clearError]);

  // Register function
  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    setLoading(true);
    clearError();
    
    try {
      console.log('Attempting registration with:', userData);
      const data = await authAPI.register(userData);
      console.log('Registration response:', data);
      if (data?.email) {
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return false;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loginContext, setLoading, setError, clearError]);

  // Logout function
  const logout = useCallback(() => {
    logoutContext();
    navigate('/login');
  }, [logoutContext, navigate]);

  // Get user profile
  const getProfile = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const userData = await authAPI.getProfile(token);
      if (userData) {
        updateUserContext(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateUserContext, setLoading]);

  // Update user profile
  const updateProfile = useCallback(async (userData: any) => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const updatedUser = await authAPI.updateProfile(token, userData);
      if (updatedUser) {
        updateUserContext(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateUserContext, setLoading]);

  // Add address to user profile
  const addAddress = useCallback(async (addressData: any) => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      const updatedUser = await authAPI.addAddress(token, addressData);
      if (updatedUser) {
        updateUserContext(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding address:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, updateUserContext, setLoading]);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    clearError();

    try {
      const data = await authAPI.verifyOtp({ email, otp });
      if (data?.token) {
        loginContext(data.user, data.token);
        navigate('/');
        return true;
      }
      return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message || 'OTP verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loginContext, navigate, setLoading, setError, clearError]);

  const resendOtp = useCallback(async (email: string) => {
  setLoading(true);
  clearError();

  try {
    const data = await authAPI.resendOtp(email);
    return data?.message || 'OTP resent successfully';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setError(error.message || 'Failed to resend OTP');
    return false;
  } finally {
    setLoading(false);
  }
}, [setLoading, setError, clearError]);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    addAddress,
    verifyOtp,
    resendOtp,
  };
};

export default useAuth; 