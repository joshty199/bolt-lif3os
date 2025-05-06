import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Dumbbell, UtensilsCrossed, TrendingUp, Heart, ChartBar as BarChart3 } from 'lucide-react-native';
import ActivityItem from '@/components/ActivityItem';
import FilterTabs from '@/components/FilterTabs';
import FitnessSummary from '@/components/FitnessSummary';
import EmptyState from '@/components/EmptyState';
import { useFitness } from '@/hooks/useFitness';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function FitnessScreen() {
  const { activities, summary } = useFitness();
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'Overview' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'metrics', label: 'Progress' }
  ];

  const todayStats = [
    {
      icon: <Heart size={24} color="#EF4444" />,
      label: 'Recovery',
      value: '85%',
      subtitle: 'Optimal',
      color: '#FEE2E2'
    },
    {
      icon: <Dumbbell size={24} color="#3B82F6" />,
      label: 'Training Load',
      value: '6.8',
      subtitle: 'Moderate',
      color: '#DBEAFE'
    },
    {
      icon: <UtensilsCrossed size={24} color="#10B981" />,
      label: 'Calories',
      value: '2,340',
      subtitle: 'Within Target',
      color: '#D1FAE5'
    },
    {
      icon: <TrendingUp size={24} color="#8B5CF6" />,
      label: 'Progress',
      value: '+2.5%',
      subtitle: 'This Week',
      color: '#EDE9FE'
    }
  ];

  const weeklyProgress = {
    image: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg',
    title: 'Strong Week!',
    description: 'You\'ve completed 5 workouts this week, exceeding your goal by 25%. Keep up the momentum!',
    stats: [
      { label: 'Workouts', value: '5/4', trend: 'up' },
      { label: 'Volume', value: '12,450 kg', trend: 'up' },
      { label: 'Calories', value: '2,340/day', trend: 'neutral' }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Fitness & Nutrition</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Log Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FilterTabs 
        filters={filters} 
        activeFilter={filter} 
        onFilterChange={setFilter} 
      />

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {todayStats.map((stat, index) => (
            <View 
              key={index} 
              style={[styles.statCard, { backgroundColor: stat.color }]}
            >
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <Image 
            source={{ uri: weeklyProgress.image }}
            style={styles.progressImage}
          />
          <View style={styles.progressContent}>
            <Text style={styles.progressTitle}>{weeklyProgress.title}</Text>
            <Text style={styles.progressDescription}>
              {weeklyProgress.description}
            </Text>
            <View style={styles.progressStats}>
              {weeklyProgress.stats.map((stat, index) => (
                <View key={index} style={styles.progressStat}>
                  <Text style={styles.progressStatValue}>{stat.value}</Text>
                  <Text style={styles.progressStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <BarChart3 size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <EmptyState 
              title="No activities logged yet" 
              message="Start tracking your fitness journey by logging your first activity"
              icon="dumbbell"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 24,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: CARD_WIDTH,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressImage: {
    width: '100%',
    height: 160,
  },
  progressContent: {
    padding: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  progressDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
});