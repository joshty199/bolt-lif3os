import { useCommandContext } from '@/context/CommandContext';
import { Command } from '@/types';

export function useCommandHistory() {
  const { commandHistory, addCommand, clearHistory } = useCommandContext();

  // Return the most recent commands
  const recentCommands = commandHistory.slice(0, 10);

  // Filter commands by module category
  const getCommandsByCategory = (category: Command['category']) => {
    return commandHistory.filter(cmd => cmd.category === category);
  };

  return {
    recentCommands,
    addCommand,
    clearHistory,
    getCommandsByCategory,
  };
}