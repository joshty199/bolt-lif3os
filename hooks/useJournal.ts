import { useState } from 'react';
import { JournalEntry } from '@/types';

// Mock data for demo purposes
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    content: 'Today was productive. I completed most of my tasks ahead of schedule and had time for a quick workout.',
    date: 'Today',
    mood: 'productive',
    tags: ['work', 'productivity'],
    isToday: true,
    isThisWeek: true,
    hasMood: true,
  },
  {
    id: 'journal-2',
    content: 'Feeling a bit anxious about the upcoming presentation. Need to practice more tomorrow.',
    date: 'Yesterday',
    mood: 'anxious',
    tags: ['work', 'presentation'],
    isToday: false,
    isThisWeek: true,
    hasMood: true,
  },
  {
    id: 'journal-3',
    content: 'Had a great time at the park with friends. The weather was perfect for a picnic.',
    date: 'Last Saturday',
    mood: 'happy',
    tags: ['friends', 'weekend'],
    isToday: false,
    isThisWeek: false,
    hasMood: true,
  },
];

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(INITIAL_ENTRIES);

  const addJournalEntry = (entry: JournalEntry) => {
    // Update the entry with proper date flags
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const newEntry = {
      ...entry,
      isToday: true,
      isThisWeek: true,
      hasMood: !!entry.mood,
    };

    // Move existing "Today" entries to "Yesterday"
    const updatedEntries = entries.map(existingEntry => {
      if (existingEntry.isToday) {
        return {
          ...existingEntry,
          date: 'Yesterday',
          isToday: false,
          isThisWeek: true,
        };
      }
      return existingEntry;
    });

    setEntries([newEntry, ...updatedEntries]);
  };

  const addMoodEntry = (entry: JournalEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return {
    entries,
    addJournalEntry,
    addMoodEntry,
    updateEntry,
    deleteEntry,
  };
}