import { View, Text, StyleSheet } from 'react-native';
import { CalendarDays } from 'lucide-react-native';
import { JournalEntry } from '@/types';

interface JournalEntryProps {
  entry: JournalEntry;
}

export default function JournalEntryComponent({ entry }: JournalEntryProps) {
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😔';
      case 'anxious':
        return '😰';
      case 'energetic':
        return '⚡';
      case 'calm':
        return '😌';
      case 'productive':
        return '💪';
      default:
        return '😐';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <CalendarDays size={14} color="#64748B" />
          <Text style={styles.date}>{entry.date}</Text>
        </View>
        {entry.mood && (
          <View style={styles.moodContainer}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
            <Text style={styles.mood}>{entry.mood}</Text>
          </View>
        )}
      </View>
      <Text style={styles.content}>{entry.content}</Text>
      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {entry.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  mood: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  content: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#3B82F6',
  },
});