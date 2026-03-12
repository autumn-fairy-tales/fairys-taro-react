import { createContext, ReactNode, useContext } from 'react';

export const ValtioContext = createContext(undefined);

export function ValtioContextProvider<T>({ value, children }: { value: T; children?: ReactNode }) {
  return <ValtioContext.Provider value={value}>{children}</ValtioContext.Provider>;
}

export function useValtioContext<T>() {
  const context = useContext<T>(ValtioContext);
  if (!context) {
    throw new Error('useValtioContext must be used within a ValtioContextProvider');
  }
  return context;
}
