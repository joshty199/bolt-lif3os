import { createContext, useContext, useState, ReactNode } from 'react';
import { Command } from '@/types';

interface CommandContextType {
  commandHistory: Command[];
  addCommand: (command: Command) => void;
  clearHistory: () => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: ReactNode }) {
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);

  const addCommand = (command: Command) => {
    setCommandHistory(prev => [command, ...prev]);
  };

  const clearHistory = () => {
    setCommandHistory([]);
  };

  return (
    <CommandContext.Provider value={{ commandHistory, addCommand, clearHistory }}>
      {children}
    </CommandContext.Provider>
  );
}

export function useCommandContext() {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error('useCommandContext must be used within a CommandProvider');
  }
  return context;
}