import React, { createContext, useContext, useState } from 'react';

interface UserPreferencesContextType {
  classLevel: string;
  setClassLevel: (level: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [classLevel, setClassLevel] = useState('');

  return (
    <UserPreferencesContext.Provider value={{ classLevel, setClassLevel }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}