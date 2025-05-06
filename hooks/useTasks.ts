import { useState } from 'react';
import { Task } from '@/types';

// Mock data for demo purposes
const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finish weekly report',
    description: 'Complete and submit the quarterly performance analysis',
    completed: false,
    dueDate: 'Today',
    dueTime: '5:00 PM',
    priority: 'high',
    isToday: true,
    followUpTasks: [
      {
        id: 'task-1-1',
        title: 'Review with team',
        description: 'Go through the report with the team for feedback',
        completed: false,
        dueDate: 'Today',
        dueTime: '3:00 PM',
        priority: 'medium',
        isToday: true,
        parentTaskId: 'task-1'
      },
      {
        id: 'task-1-2',
        title: 'Submit to management',
        description: 'Send the final version to management',
        completed: false,
        dueDate: 'Tomorrow',
        dueTime: '10:00 AM',
        priority: 'high',
        isToday: false,
        parentTaskId: 'task-1'
      }
    ]
  },
  {
    id: 'task-2',
    title: 'Call dentist',
    description: 'Schedule annual checkup appointment',
    completed: false,
    dueDate: 'Tomorrow',
    priority: 'medium',
    isToday: false,
  },
  {
    id: 'task-3',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    completed: true,
    isToday: true,
  },
  {
    id: 'task-4',
    title: 'Research vacation destinations',
    description: 'Look for beach locations for summer trip',
    completed: false,
    dueDate: 'Next week',
    priority: 'low',
    isToday: false,
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = (task: Task) => {
    setTasks(prev => {
      const newTasks = [...prev];
      
      if (task.parentTaskId) {
        // Find the parent task and add this as a follow-up
        const parentIndex = newTasks.findIndex(t => t.id === task.parentTaskId);
        if (parentIndex !== -1) {
          if (!newTasks[parentIndex].followUpTasks) {
            newTasks[parentIndex].followUpTasks = [];
          }
          // Inherit the isToday status based on the due date
          task.isToday = task.dueDate === 'Today';
          newTasks[parentIndex].followUpTasks?.push(task);
          return newTasks;
        }
      }
      
      // If no parent task or parent not found, add as top-level task
      task.isToday = task.dueDate === 'Today';
      return [task, ...prev];
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const updateTaskAndFollowUps = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === id) {
            const updatedTask = { ...task, ...updates };
            // Update isToday based on dueDate if it changed
            if (updates.dueDate !== undefined) {
              updatedTask.isToday = updates.dueDate === 'Today';
            }
            return updatedTask;
          }
          if (task.followUpTasks) {
            return {
              ...task,
              followUpTasks: updateTaskAndFollowUps(task.followUpTasks)
            };
          }
          return task;
        });
      };
      return updateTaskAndFollowUps(newTasks);
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const deleteTaskAndFollowUps = (tasks: Task[]): Task[] => {
        return tasks.filter(task => {
          if (task.id === id) {
            return false;
          }
          if (task.followUpTasks) {
            task.followUpTasks = deleteTaskAndFollowUps(task.followUpTasks);
          }
          return true;
        });
      };
      return deleteTaskAndFollowUps(newTasks);
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const toggleTaskAndFollowUps = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === id) {
            return { ...task, completed: !task.completed };
          }
          if (task.followUpTasks) {
            return {
              ...task,
              followUpTasks: toggleTaskAndFollowUps(task.followUpTasks)
            };
          }
          return task;
        });
      };
      return toggleTaskAndFollowUps(newTasks);
    });
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}