import { getFromCookies, saveToCookies } from 'functions/cookies';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  name: string;
  shortName: string;
  pronouns: string;
  isFirstInteraction: boolean;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  setFirstInteractionComplete: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: '',
    shortName: '',
    pronouns: '',
    isFirstInteraction: true,
  });

  useEffect(() => {
    const cookiesUser = getFromCookies("mindump-user")
    if (cookiesUser) {
      const savedUser = JSON.parse(cookiesUser)
      if (savedUser) {
        setUser(savedUser)
      }
    }
  }, [])

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const setFirstInteractionComplete = () => {
    setUser(prev => ({ ...prev, isFirstInteraction: false }));
  };

  useEffect(() => {
    if (user) {
      saveToCookies("mindump-user", JSON.stringify(user))
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, updateUser, setFirstInteractionComplete }}>
      {children}
    </UserContext.Provider>
  );
}; 