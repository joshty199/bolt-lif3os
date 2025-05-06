import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Plane, MapPin, Calendar, TrendingUp, Globe, Compass, Map, Navigation } from 'lucide-react-native';
import TripItem from '@/components/TripItem';
import FilterTabs from '@/components/FilterTabs';
import EmptyState from '@/components/EmptyState';
import { useTravel } from '@/hooks/useTravel';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function TravelScreen() {
  const { trips } = useTravel();
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All Trips' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'planning', label: 'Planning' },
    { id: 'past', label: 'Past' }
  ];

  const travelStats = [
    {
      icon: <Globe size={24} color="#3B82F6" />,
      label: 'Countries',
      value: '12',
      subtitle: 'Visited',
      color: '#DBEAFE'
    },
    {
      icon: <Plane size={24} color="#F59E0B" />,
      label: 'Trips',
      value: '3',
      subtitle: 'This Year',
      color: '#FEF3C7'
    },
    {
      icon: <Map size={24} color="#10B981" />,
      label: 'Places',
      value: '48',
      subtitle: 'Explored',
      color: '#D1FAE5'
    },
    {
      icon: <Calendar size={24} color="#8B5CF6" />,
      label: 'Days',
      value: '120',
      subtitle: 'Traveled',
      color: '#EDE9FE'
    }
  ];

  const nextAdventure = {
    image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
    title: 'Mediterranean Adventure',
    description: 'Your upcoming trip to Greece includes island hopping across Santorini, Mykonos, and Crete. All accommodations are booked.',
    stats: [
      { label: 'Duration', value: '15 days' },
      { label: 'Cities', value: '4' },
      { label: 'Activities', value: '12' }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Travel & Adventures</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Compass size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Plan Trip</Text>
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
          {travelStats.map((stat, index) => (
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

        <View style={styles.adventureCard}>
          <Image 
            source={{ uri: nextAdventure.image }}
            style={styles.adventureImage}
          />
          <View style={styles.adventureContent}>
            <Text style={styles.adventureTitle}>{nextAdventure.title}</Text>
            <Text style={styles.adventureDescription}>
              {nextAdventure.description}
            </Text>
            <View style={styles.adventureStats}>
              {nextAdventure.stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.adventureStatValue}>{stat.value}</Text>
                  <Text style={styles.adventureStatLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Trips</Text>
            <TouchableOpacity>
              <Navigation size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          {trips.length > 0 ? (
            trips.map((trip) => (
              <TripItem key={trip.id} trip={trip} />
            ))
          ) : (
            <EmptyState 
              title="No trips planned yet" 
              message="Start planning your next adventure"
              icon="plane"
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
    marginLeft: 8,
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
  adventureCard: {
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
  adventureImage: {
    width: '100%',
    height: 200,
  },
  adventureContent: {
    padding: 16,
  },
  adventureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  adventureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  adventureStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  adventureStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  adventureStatLabel: {
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