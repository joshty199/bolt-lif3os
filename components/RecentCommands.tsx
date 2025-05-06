import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Command } from '@/types';
import { useCommandProcessor } from '@/hooks/useCommandProcessor';

interface RecentCommandsProps {
  commands: Command[];
}

export default function RecentCommands({ commands }: RecentCommandsProps) {
  const { processCommand } = useCommandProcessor();

  const handleCommandPress = (command: string) => {
    processCommand(command);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task':
        return '#3B82F6';
      case 'journal':
        return '#8B5CF6';
      case 'contact':
        return '#EC4899';
      case 'finance':
        return '#EF4444';
      case 'fitness':
        return '#10B981';
      case 'goal':
        return '#F59E0B';
      case 'travel':
        return '#0EA5E9';
      default:
        return '#64748B';
    }
  };

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case 'add':
        return '+';
      case 'view':
        return '👁️';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      default:
        return '•';
    }
  };

  if (commands.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent commands</Text>
        <Text style={styles.emptySubtext}>Your command history will appear here</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={commands.slice(0, 5)}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.commandCard} 
          onPress={() => handleCommandPress(item.text)}
        >
          <View style={[styles.intentIcon, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.intentIconText}>{getIntentIcon(item.intent)}</Text>
          </View>
          <Text style={styles.commandText} numberOfLines={1}>
            {item.text}
          </Text>
          <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  commandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  intentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  intentIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commandText: {
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 8,
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});