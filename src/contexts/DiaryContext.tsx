import type { DailyEvent } from 'components/EventHistory';
import { getFromCookies, saveToCookies } from 'functions/cookies';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DiaryContextType {
  entries: DailyEvent[];
  setEntries: (entries: DailyEvent[]) => void;
  updateEntry: (isoString: string, newEntry: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a EventsProvider');
  }
  return context;
};

interface diaryProviderProps {
  children: ReactNode;
}

export const DiaryProvider: React.FC<diaryProviderProps> = ({ children }) => {
    const [entries, setEntries] = useState<DailyEvent[]>([]);


  useEffect(() => {
    const cookiesEntries = getFromCookies("mindump-entries")
    if (cookiesEntries) {
      const savedEntries = JSON.parse(cookiesEntries)

      if (savedEntries) {
        setEntries(savedEntries)
      }
    }
  }, [])

  const updateEntry = (isoString: string, newEntry: string[]) => {
    const newEntries = [
      ...entries.filter(entry => entry.date !== isoString),
      { date: isoString, events: newEntry }
      ].sort((a: DailyEvent, b: DailyEvent) => a.date.localeCompare(b.date))

      setEntries(newEntries)
  };

  useEffect(() => {
    if (entries && entries.length) {
      saveToCookies("mindump-entries", JSON.stringify(entries))
    }
  }, [entries])

  return (
    <DiaryContext.Provider value={{ entries, setEntries, updateEntry }}>
      {children}
    </DiaryContext.Provider>
  );
}; 