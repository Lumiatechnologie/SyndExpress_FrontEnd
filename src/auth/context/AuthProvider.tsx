import React, { useState } from 'react';
import { AuthContext } from './auth-context';
import { AuthModel, UserModel } from '@/auth/lib/models';
import axiosInstance from '../api/axios';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : undefined;
  });
  const [user, setUser] = useState<UserModel | undefined>(undefined);

  const saveAuth = (authData: AuthModel | undefined) => {
    if (authData) {
      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData)
     
    } else {
      localStorage.removeItem('auth');
      setAuth(undefined);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/signin', { username, password });
      console.log('Login response:', response.data);
      saveAuth(response.data);
        setUser(response.data);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setUser(undefined);
  };

   const requestPasswordUpdate = async (username:string,password: string, newPassword: string) => {
    
    try {
      const response = await axiosInstance.put('/api/auth/change-password', { username, password,newPassword },
         {
      }
      );
         console.log('Password update response:', response.data);
         return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

 

  const isAdmin = user?.roles?.includes('ADMIN') ?? false;

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user,
        setUser,
        login,
        register: async () => {},
        requestPasswordUpdate,
        requestPasswordReset: async () => {},
        resetPassword: async () => {},
        resendVerificationEmail: async () => {},
        getUser: async () => null,
        updateProfile: async () => ({} as UserModel),
        logout,
        verify: async () => {},
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
