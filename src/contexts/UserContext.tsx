import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import "dayjs/locale/ca";
import "dayjs/locale/en";
import { mindumpApi } from 'api/mindumpApi';
import { getUserSession, clearUserSession } from 'functions/auth';
import isoWeek from "dayjs/plugin/isoWeek";
import localeData from 'dayjs/plugin/localeData';
import timezone from "dayjs/plugin/timezone";
import localizedFormat from 'dayjs/plugin/localizedFormat';
import i18n from 'i18next';

dayjs.extend(localeData);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);


export interface User {
  token?: string
  name?: string;
  user_uuid?: string;
  timezone?: string;
  language?: string;
  context?: UserContextData
}

export interface UserContextData {
  user_uuid?: string;
  job?: string;
  tags?: string;
  description?: string;
  age?: string;
  hobbies?: string;
  app_usage?: string;
  timezone?: string;
  language?: string;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
  logout: () => void
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
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>()

  useEffect(() => {
    const localToken = getUserSession()
    if (localToken) {
      setToken(localToken)
    }
  }, [])

  useEffect(() => {
    if (user.token) {
      setToken(user.token)
    }
  }, [user.token])

  useEffect(() => {
    if (user?.language) {
      if (["es", "en", "ca"].includes(user.language)) {
        dayjs.locale(user.language);
        i18n.changeLanguage(user.language);
      } else {
        i18n.changeLanguage("es");
        dayjs.locale("es");
      }
    }
  }, [user?.language])

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const logout = () => {
    setUser({})
    setToken(null)
    clearUserSession()
  }
  useEffect(() => {
    if (token) {
      setLoading(true)
      mindumpApi.authWithGoogle(token).then((googleResponse) => {
        mindumpApi.getUser(googleResponse.user_uuid).then((response) => {
          if (response) {
            setUser({ token, ...response })
          } else {
            const userObject = { token, name: googleResponse.name, user_uuid: googleResponse.user_uuid }
            setUser(userObject)
            mindumpApi.saveUser(userObject)
          }
        }).finally(() => {
          setLoading(false)
        })
      }).catch(() => {
        setLoading(false)
      })
    }
  }, [token])

  return (
    <UserContext.Provider value={{ user, updateUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}; 