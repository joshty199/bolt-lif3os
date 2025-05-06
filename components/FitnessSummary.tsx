import { View, Text, StyleSheet } from 'react-native';
import { FitnessSummary as FitnessSummaryType } from '@/types';

interface FitnessSummaryProps {
  summary: FitnessSummaryType;
}

export default function FitnessSummary({ summary }: FitnessSummaryProps) {
  const progressPercent = (summary.workoutsCompleted / summary.workoutsPlanned) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Fitness Progress</Text>
        <Text style={styles.periodText}>{summary.period}</Text>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressValue}>
            {summary.workoutsCompleted}/{summary.workoutsPlanned}
          </Text>
          <Text style={styles.progressLabel}>workouts completed</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${progressPercent}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
        </View>
      </View>
      
      {summary.caloriesBurned !== undefined && (
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.caloriesBurned}</Text>
            <Text style={styles.statLabel}>calories burned</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  periodText: {
    fontSize: 14,
    color: '#64748B',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressTextContainer: {
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
  },
  statsSection: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
});