import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string, lastName: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simulación de login
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        setUser({
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          lastName: foundUser.lastName
        });
        return true;
      }
    }
    return false;
  };

  const register = (email: string, password: string, name: string, lastName: string): boolean => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Verificar si el usuario ya existe
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      lastName
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
