import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, List, CirclePlus as PlusCircle } from 'lucide-react-native';
import { Trip } from '@/types';

interface TripItemProps {
  trip: Trip;
}

export default function TripItem({ trip }: TripItemProps) {
  const getStatusColor = () => {
    switch (trip.status) {
      case 'planning':
        return '#F59E0B';
      case 'booked':
        return '#3B82F6';
      case 'completed':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const getStatusText = () => {
    switch (trip.status) {
      case 'planning':
        return 'Planning';
      case 'booked':
        return 'Booked';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.destination}>{trip.destination}</Text>
        <View 
          style={[
            styles.statusBadge, 
            { backgroundColor: `${getStatusColor()}20` }
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#64748B" />
          <Text style={styles.dateText}>
            {trip.startDate && trip.endDate 
              ? `${trip.startDate} - ${trip.endDate}`
              : 'Dates not set'
            }
          </Text>
        </View>
      </View>
      
      {trip.activities && trip.activities.length > 0 && (
        <View style={styles.activitiesContainer}>
          <View style={styles.activitiesHeader}>
            <List size={16} color="#64748B" />
            <Text style={styles.activitiesTitle}>Activities</Text>
          </View>
          {trip.activities.slice(0, 2).map((activity, index) => (
            <Text key={index} style={styles.activityItem}>• {activity}</Text>
          ))}
          {trip.activities.length > 2 && (
            <Text style={styles.moreActivities}>
              +{trip.activities.length - 2} more activities
            </Text>
          )}
        </View>
      )}
      
      {trip.status === 'planning' && (
        <TouchableOpacity style={styles.addButton}>
          <PlusCircle size={16} color="#3B82F6" />
          <Text style={styles.addButtonText}>Add activities</Text>
        </TouchableOpacity>
      )}
      
      {trip.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {trip.notes}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  destination: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  activitiesContainer: {
    marginBottom: 12,
  },
  activitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 8,
  },
  activityItem: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    paddingLeft: 8,
  },
  moreActivities: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
});