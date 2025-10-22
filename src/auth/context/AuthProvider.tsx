import React, { useState, useEffect } from 'react';
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
      setUser(user);  
    } else {
      localStorage.removeItem('auth');
      setAuth(undefined);
    }
  };
  const UserRefresh = async () => {
    const data = localStorage.getItem('auth');
    if (data) {
      const authData = JSON.parse(data) as AuthModel;
      saveAuth(authData);
      setUser(authData);
    }
  }

  // Refresh user data when component mounts
  useEffect(() => {
    UserRefresh();
  }, []);

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
       return response;
    } catch (error: any) {
      throw new Error(error || 'Password update failed');
    }
  };
  const DeleteAccount = async (username:string) => {
    
    try {
      const response = await axiosInstance.delete(`/api/auth/delete/${username}`,
      );
         console.log('Delete account response:', response.data);
         return response.data;
    } catch (error: any) {
    const message =
      error.response?.data?.replace("Error: ", "") ||
      "Password update failed";
      console.log("❌ Backend error:", error.response?.data);
      console.log("❌ Backend error:", error.response?.data.message);


    throw new Error(message);
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
        DeleteAccount,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
