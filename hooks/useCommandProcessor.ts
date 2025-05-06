import { useState } from 'react';
import { useTasks } from './useTasks';
import { useJournal } from './useJournal';
import { useCommandHistory } from './useCommandHistory';
import { generateId } from '@/utils/helpers';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export function useCommandProcessor() {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  
  const { addTask } = useTasks();
  const { addJournalEntry } = useJournal();
  const { addCommand } = useCommandHistory();

  const extractTaskInfo = (text: string) => {
    const data: any = {};
    
    // Extract task title - everything after "task" until a keyword or end
    const titleMatch = text.match(/(?:create|add|new)\s+task\s+(.+?)(?:\s+(?:due|at|on|tomorrow|today|priority)|$)/i);
    data.title = titleMatch ? titleMatch[1].trim() : null;

    // Extract due date
    if (text.toLowerCase().includes('tomorrow')) {
      data.dueDate = 'Tomorrow';
    } else if (text.toLowerCase().includes('today')) {
      data.dueDate = 'Today';
    }

    // Extract time
    const timeMatch = text.match(/at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    if (timeMatch) {
      let time = timeMatch[1].toLowerCase();
      // Standardize time format
      if (!time.includes(':')) time += ':00';
      if (!time.includes('am') && !time.includes('pm')) time += ' pm';
      data.dueTime = time;
    }

    // Extract priority
    if (text.toLowerCase().includes('high priority')) {
      data.priority = 'high';
    } else if (text.toLowerCase().includes('medium priority')) {
      data.priority = 'medium';
    } else if (text.toLowerCase().includes('low priority')) {
      data.priority = 'low';
    }

    return data;
  };

  const processCommand = async (commandText: string) => {
    setProcessingState('processing');
    setLastCommand(commandText);
    
    try {
      const lowercaseText = commandText.toLowerCase();
      
      // Task creation command detection
      if (lowercaseText.includes('create task') || 
          lowercaseText.includes('add task') || 
          lowercaseText.includes('new task')) {
        
        const taskInfo = extractTaskInfo(commandText);
        
        if (!taskInfo.title) {
          setProcessingState('error');
          return;
        }

        const task = {
          id: generateId(),
          title: taskInfo.title,
          completed: false,
          dueDate: taskInfo.dueDate,
          dueTime: taskInfo.dueTime,
          priority: taskInfo.priority,
          isToday: taskInfo.dueDate === 'Today'
        };

        addTask(task);
        
        addCommand({
          id: generateId(),
          text: commandText,
          intent: 'add',
          category: 'task',
          timestamp: new Date(),
          timeAgo: 'Just now'
        });

        setProcessingState('success');
        return;
      }

      // Journal entry command detection
      if (lowercaseText.includes('create journal') || 
          lowercaseText.includes('add journal') || 
          lowercaseText.includes('new journal')) {
        
        // Extract content after "journal entry" or "journal note"
        const contentMatch = commandText.match(/(?:journal\s+(?:entry|note))\s+(.+?)(?:\s+(?:mood|feeling|tag)|$)/i);
        if (!contentMatch) {
          setProcessingState('error');
          return;
        }

        const entry = {
          id: generateId(),
          content: contentMatch[1].trim(),
          date: 'Today',
          isToday: true,
          isThisWeek: true,
          hasMood: false
        };

        addJournalEntry(entry);
        
        addCommand({
          id: generateId(),
          text: commandText,
          intent: 'add',
          category: 'journal',
          timestamp: new Date(),
          timeAgo: 'Just now'
        });

        setProcessingState('success');
        return;
      }

      setProcessingState('error');
      
    } catch (error) {
      console.error('Error processing command:', error);
      setProcessingState('error');
    }
  };

  return {
    processCommand,
    processingState,
    lastCommand,
  };
}