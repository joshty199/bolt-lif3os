import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import ModuleInsight from '@/components/ModuleInsight';
import RecentCommands from '@/components/RecentCommands';
import { useCommandHistory } from '@/hooks/useCommandHistory';
import CommandSuggestions from '@/components/CommandSuggestions';
import { Brain, Sun, Cloud, Moon } from 'lucide-react-native';

export default function HomeScreen() {
  const { recentCommands } = useCommandHistory();
  const [greeting, setGreeting] = useState('');
  const [weatherIcon, setWeatherIcon] = useState<React.ReactNode>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
      setWeatherIcon(<Sun size={24} color="#F59E0B" />);
    } else if (hour < 17) {
      setGreeting('Good afternoon');
      setWeatherIcon(<Cloud size={24} color="#60A5FA" />);
    } else {
      setGreeting('Good evening');
      setWeatherIcon(<Moon size={24} color="#6366F1" />);
    }
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          {weatherIcon}
        </View>
        <Text style={styles.subtitle}>What can I help you with today?</Text>
      </View>

      <View style={styles.aiSection}>
        <View style={styles.aiHeader}>
          <Brain size={20} color="#4361EE" />
          <Text style={styles.aiTitle}>AI Assistant Insights</Text>
        </View>
        <View style={styles.aiCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg' }}
            style={styles.aiImage}
          />
          <Text style={styles.aiText}>
            Based on your recent activity, I notice you've been consistent with your workouts. 
            Would you like me to adjust your nutrition plan to support your increased activity level?
          </Text>
        </View>
      </View>

      <CommandSuggestions />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <RecentCommands commands={recentCommands} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Overview</Text>
        <View style={styles.insightsContainer}>
          <ModuleInsight 
            title="Tasks"
            count="4"
            subtitle="due today"
            color="#4361EE"
          />
          <ModuleInsight 
            title="Finance"
            count="$542"
            subtitle="spent this week"
            color="#EF4444"
          />
          <ModuleInsight 
            title="Fitness"
            count="2/3"
            subtitle="workouts completed"
            color="#10B981"
          />
          <ModuleInsight 
            title="Recovery"
            count="85%"
            subtitle="sleep quality"
            color="#8B5CF6"
          />
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionCards}>
          {['Log Workout', 'Track Meal', 'Add Task', 'Journal Entry'].map((action, index) => (
            <View key={index} style={styles.actionCard}>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
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
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'right',
  },
  aiSection: {
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiImage: {
    width: '100%',
    height: 120,
  },
  aiText: {
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  insightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActions: {
    marginBottom: 24,
  },
  actionCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionCard: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});