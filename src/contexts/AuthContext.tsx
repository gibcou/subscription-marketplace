import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
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
      
      return await signInWithEmailAndPassword(auth, sanitizedEmail, password);
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
      
      const { user } = await createUserWithEmailAndPassword(auth, sanitizedEmail, password);
      
      // Send email verification
      await sendEmailVerification(user);
      
      await updateProfile(user, { displayName: sanitizedName });
      
      // Create user document in Firestore
      const userData: User = {
        id: user.uid,
        email: user.email!,
        displayName: sanitizedName,
        role,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setCurrentUser({
            ...userData,
            createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt)
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
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