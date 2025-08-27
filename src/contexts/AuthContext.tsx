import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { sanitizeInput, isValidEmail, isStrongPassword, rateLimiter } from '../utils/security';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, displayName: string, role: 'buyer' | 'seller') => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed(`login_${email}`)) {
        throw new Error('Too many login attempts. Please try again later.');
      }
      
      // Input validation
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address.');
      }
      
      if (!password || password.length < 6) {
        throw new Error('Password is required.');
      }
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === sanitizedEmail);
      
      if (!user) {
        throw new Error('User not found. Please register first.');
      }
      
      // In a real app, you'd hash and compare passwords
      const storedPassword = localStorage.getItem(`password_${user.id}`);
      if (storedPassword !== password) {
        throw new Error('Invalid password.');
      }
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      
      return { user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string, role: 'buyer' | 'seller') => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed(`register_${email}`)) {
        throw new Error('Too many registration attempts. Please try again later.');
      }
      
      // Input validation
      const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
      const sanitizedName = sanitizeInput(displayName.trim());
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address.');
      }
      
      if (!isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.');
      }
      
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        throw new Error('Name must be between 2 and 50 characters.');
      }
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: User) => u.email === sanitizedEmail);
      
      if (existingUser) {
        throw new Error('User with this email already exists.');
      }
      
      // Create new user
      const userId = Date.now().toString(); // Simple ID generation
      const userData: User = {
        id: userId,
        email: sanitizedEmail,
        displayName: sanitizedName,
        role,
        createdAt: new Date()
      };
      
      // Store user data
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem(`password_${userId}`, password); // In real app, hash this
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setCurrentUser(userData);
      
      return { user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as User;
        setCurrentUser({
          ...userData,
          createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt)
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};