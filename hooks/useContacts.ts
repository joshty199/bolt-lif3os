import { useState } from 'react';
import { Contact } from '@/types';

// Mock data for demo purposes
const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    company: 'Tech Innovations',
    notes: 'Met at conference, interested in collaboration',
    lastContact: '2 days ago',
    isRecent: true,
    needsFollowUp: true,
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    company: 'Design Studio',
    notes: 'Potential client for new project',
    lastContact: 'Last week',
    isRecent: false,
    needsFollowUp: true,
  },
  {
    id: 'contact-3',
    name: 'Emily Rodriguez',
    company: 'Marketing Agency',
    notes: 'College friend, catch up quarterly',
    lastContact: '1 month ago',
    isRecent: false,
    needsFollowUp: false,
  },
];

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);

  const addContact = (contact: Contact) => {
    setContacts(prev => [contact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, ...updates } : contact
      )
    );
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
  };
}