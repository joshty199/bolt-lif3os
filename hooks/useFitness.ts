import { useState } from 'react';
import { Activity, FitnessSummary } from '@/types';

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'fitness-1',
    description: '5K morning run',
    type: 'workout',
    date: 'Today',
    details: {
      duration: 30,
      caloriesBurned: 320,
      distance: 5,
      pace: '6:00/km'
    },
  },
  {
    id: 'fitness-2',
    description: 'Grilled chicken salad',
    type: 'meal',
    date: 'Today',
    details: {
      calories: 450,
      protein: 35,
      carbs: 20,
      fat: 15,
      ingredients: ['Chicken breast', 'Mixed greens', 'Olive oil', 'Balsamic']
    },
  },
  {
    id: 'fitness-3',
    description: 'Upper body strength',
    type: 'workout',
    date: 'Yesterday',
    details: {
      duration: 45,
      caloriesBurned: 280,
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8-10', weight: '70kg' },
        { name: 'Pull-ups', sets: 4, reps: '8-10' },
        { name: 'Shoulder Press', sets: 3, reps: '10-12', weight: '25kg' }
      ]
    },
  },
  {
    id: 'fitness-4',
    description: 'Body measurements',
    type: 'metric',
    date: 'This week',
    details: {
      weight: 75.5,
      bodyFat: 15.2,
      muscle: 35.8,
      measurements: {
        chest: 98,
        waist: 82,
        hips: 95
      }
    },
  },
];

const INITIAL_SUMMARY: FitnessSummary = {
  workoutsCompleted: 5,
  workoutsPlanned: 4,
  caloriesBurned: 1850,
  period: 'This week',
  trends: {
    volume: '+12%',
    intensity: 'Maintaining',
    consistency: 'Improving'
  }
};

export function useFitness() {
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [summary, setSummary] = useState<FitnessSummary>(INITIAL_SUMMARY);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
    
    if (activity.type === 'workout') {
      setSummary(prev => ({
        ...prev,
        workoutsCompleted: prev.workoutsCompleted + 1,
        caloriesBurned: prev.caloriesBurned + (activity.details?.caloriesBurned || 0),
      }));
    }
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  return {
    activities,
    summary,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}