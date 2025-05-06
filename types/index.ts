// Command Processing Types
export interface Command {
  id: string;
  text: string;
  intent: 'add' | 'view' | 'update' | 'delete';
  category: 'task' | 'journal' | 'contact' | 'finance' | 'fitness' | 'goal' | 'travel';
  timestamp: Date;
  timeAgo: string;
}

// Task Types
export interface TaskAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
  priority?: 'high' | 'medium' | 'low';
  isToday?: boolean;
  parentTaskId?: string;
  followUpTasks?: Task[];
  attachments?: TaskAttachment[];
}

// Journal Types
export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  mood?: string;
  tags?: string[];
  isToday?: boolean;
  isThisWeek?: boolean;
  hasMood?: boolean;
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  company?: string;
  notes?: string;
  lastContact?: string;
  isRecent?: boolean;
  needsFollowUp?: boolean;
}

// Finance Types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category?: string;
  date: string;
  isToday?: boolean;
}

export interface FinanceSummary {
  balance: number;
  income: number;
  expenses: number;
  period: string;
}

// Fitness Types
export interface Activity {
  id: string;
  description: string;
  type: 'workout' | 'meal' | 'metric';
  date: string;
  details?: Record<string, any>;
}

export interface FitnessSummary {
  workoutsCompleted: number;
  workoutsPlanned: number;
  caloriesBurned?: number;
  period: string;
}

// Travel Types
export interface Trip {
  id: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  status: 'planning' | 'booked' | 'completed';
  activities?: string[];
  notes?: string;
  isUpcoming?: boolean;
  isPast?: boolean;
}