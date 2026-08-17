import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../mock/users';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ngo_user');
    return saved ? JSON.parse(saved) : mockUsers[0];
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return user ? user.role : 'ADMIN';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ngo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ngo_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setRoleState(res.data.user.role);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const setRole = (newRole: UserRole) => {
    const matchedUser = mockUsers.find((u) => u.role === newRole) || {
      ...mockUsers[0],
      role: newRole,
      name: `${newRole} User`,
    };
    setUser(matchedUser);
    setRoleState(newRole);
    authService.switchRole(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : role,
        isAuthenticated: !!user,
        login,
        logout,
        setRole,
      }}
    >
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
