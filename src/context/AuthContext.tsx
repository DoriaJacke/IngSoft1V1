import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginAdmin: (email: string) => boolean;
  register: (email: string, password: string, name: string, lastName: string, rut: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Verificar si el usuario ya existe
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        setUser({
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          lastName: foundUser.lastName,
          rut: foundUser.rut
        });
        return true;
      }
    }
    
    // Si no existe, crear usuario automáticamente para simplificar el demo
    if (email && password && email.includes('@')) {
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name: email.split('@')[0], // Usar parte del email como nombre
        lastName: 'Usuario',
        rut: ''
      };

      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      setUser({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        lastName: newUser.lastName,
        rut: newUser.rut
      });
      return true;
    }
    
    return false;
  };

  const loginAdmin = (email: string): boolean => {
    // Login de administrador con cualquier email
    setUser({
      id: 'admin_' + Date.now().toString(),
      email: email,
      name: 'Administrador',
      lastName: 'Sistema',
      isAdmin: true
    });
    return true;
  };

  const register = (email: string, password: string, name: string, lastName: string, rut: string): boolean => {
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
      lastName,
      rut
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    setUser({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName,
      rut: newUser.rut
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
      loginAdmin,
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
