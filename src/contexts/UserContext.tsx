import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import "dayjs/locale/es"; // importa el locale deseado
import { mindumpApi } from 'api/mindumpApi';

export interface User {
  name?: string;
  user_uuid?: string;
  timezone?: string;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
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
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    dayjs.locale("es");
  }, [])

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (user && user.user_uuid) {
      mindumpApi.getUser(user.user_uuid).then((response) => {
        if (response) {
          updateUser(response)
        } else {
          mindumpApi.saveUser(user).then((response) => {
            console.log(response)
          })
        }
      })
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}; 