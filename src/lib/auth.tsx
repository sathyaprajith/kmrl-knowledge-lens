import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
  email: string;
  name?: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (u: { email: string; password: string; name?: string; role?: string; department?: string; permissions?: string[] }) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_KEY = 'k-lens:auth:v1';
const USERS_KEY = 'k-lens:users:v1';

const ensureDemoUsers = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return; // Don't overwrite existing users unless needed
    const demo = [
      { id: 1, email: 'admin@kmrl.co.in', password: 'admin123', name: 'Admin User', role: 'Administrator', department: 'IT', permissions: ['full_access'], isDemo: true },
      { id: 2, email: 'safety@kmrl.co.in', password: 'safety123', name: 'Safety Officer', role: 'Safety', department: 'Safety', permissions: ['view_documents', 'manage_safety'], isDemo: true },
      { id: 3, email: 'legal@kmrl.co.in', password: 'legal123', name: 'Legal Advisor', role: 'Legal', department: 'Legal', permissions: ['view_documents', 'manage_legal'], isDemo: true },
      { id: 4, email: 'hr@kmrl.co.in', password: 'hr123', name: 'HR Manager', role: 'HR', department: 'HR', permissions: ['view_documents', 'manage_hr'], isDemo: true },
      { id: 5, email: 'finance@kmrl.co.in', password: 'finance123', name: 'Finance Manager', role: 'Finance', department: 'Finance', permissions: ['view_documents', 'manage_finance'], isDemo: true },
      { id: 6, email: 'operations@kmrl.co.in', password: 'operations123', name: 'Operations Manager', role: 'Operations', department: 'Operations', permissions: ['view_documents', 'manage_operations'], isDemo: true },
      { id: 7, email: 'it@kmrl.co.in', password: 'it123', name: 'IT Support', role: 'IT', department: 'IT', permissions: ['view_documents', 'manage_it'], isDemo: true },
      { id: 8, email: 'maintenance@kmrl.co.in', password: 'maintenance123', name: 'Maintenance Engineer', role: 'Maintenance', department: 'Maintenance', permissions: ['view_documents', 'manage_maintenance'], isDemo: true }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demo));
  } catch {}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) setUser(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // ensure demo users are present
    try { 
      if (typeof window !== 'undefined') {
        ensureDemoUsers(); 
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (user) localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
        else localStorage.removeItem(LOCAL_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // First check registered users from userRegistrationService
    try {
      const { userRegistrationService } = await import('@/services/userRegistrationService');
      const userStatus = userRegistrationService.getUserStatus(email);
      
      if (userStatus.status === 'approved' && userStatus.user) {
        const approvedUser = userStatus.user as any;
        if (approvedUser.password === password) {
          const u = { 
            email: approvedUser.email, 
            name: approvedUser.username || approvedUser.email, 
            role: 'User' 
          };
          setUser(u);
          return true;
        }
      }
    } catch (e) {
      // ignore and continue to demo accounts
    }

    // Check stored demo users in localStorage
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(USERS_KEY);
        if (raw) {
          const users = JSON.parse(raw) as any[];
          const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase() && u.password === password);
          if (found) {
            const u = { email: found.email, name: found.name || found.email, role: found.role || 'User' };
            setUser(u);
            return true;
          }
        }
      }
    } catch (e) {
      // ignore and fallthrough to false
    }

    return false;
  };

  const addUser = (u: { email: string; password: string; name?: string; role?: string; department?: string; permissions?: string[] }) => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(USERS_KEY);
        const users = raw ? JSON.parse(raw) : [];
        const id = users.length ? Math.max(...users.map((x:any) => x.id || 0)) + 1 : 1;
        const nu = { id, ...u, isDemo: false };
        users.push(nu);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addUser }}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
