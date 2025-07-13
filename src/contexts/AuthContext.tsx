import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/appwrite';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  sessions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUserName: (name: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// List of admin gmails
const ADMIN_GMAILS = [
  'admin@anurag.edu.in',
  'admin2@gmail.com',
  'gollapallisupreeth@gmail.com',
  'pardhu1@anurag.edu.in',
  // Add more admin gmails here
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for existing session with Appwrite
    const checkUser = async () => {
      try {
        const appwriteUser = await authService.getCurrentUser();
        if (appwriteUser) {
          const user: User = {
            id: appwriteUser.$id,
            email: appwriteUser.email,
            name: appwriteUser.name,
            role: ADMIN_GMAILS.includes(appwriteUser.email) ? 'admin' : 'user',
            sessions: ['current']
          };
          setUser(user);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const updateUserName = async (name: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await authService.updateName(name);
      const updatedUser = { ...user, name };
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Failed to update user name:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Validate AU email or admin
      if (!email.endsWith('@anurag.edu.in') && !ADMIN_GMAILS.includes(email)) {
        setUser(null);
        return false;
      }
      const session = await authService.login(email, password);
      const appwriteUser = await authService.getCurrentUser();
      if (appwriteUser) {
        const newUser: User = {
          id: appwriteUser.$id,
          email: appwriteUser.email,
          name: appwriteUser.name,
          role: ADMIN_GMAILS.includes(appwriteUser.email) ? 'admin' : 'user',
          sessions: [session.$id]
        };
        setUser(newUser);
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      setUser(null);
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Validate AU email or admin
      if (!email.endsWith('@anurag.edu.in') && !ADMIN_GMAILS.includes(email)) {
        setUser(null);
        return false;
      }
      await authService.register(email, password, name);
      const appwriteUser = await authService.getCurrentUser();
      if (appwriteUser) {
        const newUser: User = {
          id: appwriteUser.$id,
          email: appwriteUser.email,
          name: appwriteUser.name,
          role: ADMIN_GMAILS.includes(appwriteUser.email) ? 'admin' : 'user',
          sessions: ['current']
        };
        setUser(newUser);
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      setUser(null);
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Force logout even if Appwrite call fails
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}