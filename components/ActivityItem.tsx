import { View, Text, StyleSheet } from 'react-native';
import { Dumbbell, UtensilsCrossed, ArrowRight, Weight } from 'lucide-react-native';
import { Activity } from '@/types';

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const renderIcon = () => {
    switch (activity.type) {
      case 'workout':
        return <Dumbbell size={16} color="#10B981" />;
      case 'meal':
        return <UtensilsCrossed size={16} color="#8B5CF6" />;
      case 'metric':
        return <Weight size={16} color="#3B82F6" />;
      default:
        return <Dumbbell size={16} color="#10B981" />;
    }
  };

  const getTypeText = () => {
    switch (activity.type) {
      case 'workout':
        return 'Workout';
      case 'meal':
        return 'Nutrition';
      case 'metric':
        return 'Measurement';
      default:
        return 'Activity';
    }
  };

  const getIconBackground = () => {
    switch (activity.type) {
      case 'workout':
        return '#D1FAE5';
      case 'meal':
        return '#EDE9FE';
      case 'metric':
        return '#DBEAFE';
      default:
        return '#D1FAE5';
    }
  };

  const getDetailText = () => {
    if (!activity.details) return null;
    
    switch (activity.type) {
      case 'workout':
        if (activity.details.duration) {
          return `${activity.details.duration} minutes`;
        }
        return null;
      case 'meal':
        if (activity.details.calories) {
          return `${activity.details.calories} calories`;
        }
        return null;
      case 'metric':
        if (activity.details.value && activity.details.unit) {
          return `${activity.details.value} ${activity.details.unit}`;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
        {renderIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{activity.description}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.type}>{getTypeText()}</Text>
          {getDetailText() && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.details}>{getDetailText()}</Text>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{activity.date}</Text>
        <ArrowRight size={16} color="#94A3B8" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    color: '#64748B',
  },
  separator: {
    fontSize: 14,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  details: {
    fontSize: 14,
    color: '#64748B',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 4,
  },
});