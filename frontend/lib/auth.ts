import Cookies from 'js-cookie';
import { AuthUser, User } from '@/types';

// Set tokens in cookies
export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
};

// Get token from cookies
export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

// Remove token from cookies
export const removeToken = () => {
  Cookies.remove('token');
};

// Set user in local storage
export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user from local storage
export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Remove user from local storage
export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Login user
export const login = (data: AuthUser) => {
  setToken(data.token);
  setUser(data.user);
};

// Logout user
export const logout = () => {
  removeToken();
  removeUser();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};
