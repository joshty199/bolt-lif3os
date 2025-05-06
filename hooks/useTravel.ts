import { useState } from 'react';
import { Trip } from '@/types';

// Mock data for demo purposes
const INITIAL_TRIPS: Trip[] = [
  {
    id: 'travel-1',
    destination: 'Paris',
    startDate: 'June 15, 2025',
    endDate: 'June 22, 2025',
    status: 'planning',
    activities: ['Visit Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
    notes: 'Need to book hotel and flights',
    isUpcoming: true,
    isPast: false,
  },
  {
    id: 'travel-2',
    destination: 'Tokyo',
    startDate: 'November 10, 2024',
    endDate: 'November 20, 2024',
    status: 'booked',
    activities: ['Visit Tokyo Tower', 'Shibuya Crossing', 'Mt. Fuji day trip'],
    notes: 'Flight booked, need to plan daily itinerary',
    isUpcoming: true,
    isPast: false,
  },
  {
    id: 'travel-3',
    destination: 'Barcelona',
    startDate: 'April 5, 2024',
    endDate: 'April 12, 2024',
    status: 'completed',
    activities: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
    notes: 'Great trip, would visit again!',
    isUpcoming: false,
    isPast: true,
  },
];

export function useTravel() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev => 
      prev.map(trip => 
        trip.id === id ? { ...trip, ...updates } : trip
      )
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  return {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
  };
}