import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useCommandProcessor } from '@/hooks/useCommandProcessor';

const SUGGESTION_GROUPS = [
  {
    id: 'tasks',
    title: 'Tasks',
    suggestions: [
      'Add task: Buy groceries tomorrow at 5pm',
      'Show all high priority tasks',
      'Remind me to call mom at 7pm',
    ]
  },
  {
    id: 'journal',
    title: 'Journal',
    suggestions: [
      'Journal entry: Today I felt productive',
      'Track mood: feeling energetic today',
      'Show my journal entries from last week',
    ]
  },
  {
    id: 'fitness',
    title: 'Fitness',
    suggestions: [
      'Log workout: 30 minutes of running',
      'Record weight: 165 pounds',
      'Track meal: salmon salad for lunch',
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    suggestions: [
      'Record expense: $34.50 for lunch',
      'Set budget: $200 for dining out this month',
      'Show my spending from last week',
    ]
  }
];

export default function CommandSuggestions() {
  const { processCommand } = useCommandProcessor();

  const handleSuggestionPress = (suggestion: string) => {
    processCommand(suggestion);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Try These Commands</Text>
      <FlatList
        data={SUGGESTION_GROUPS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.suggestionGroup}>
            <Text style={styles.groupTitle}>{item.title}</Text>
            {item.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText} numberOfLines={1}>
                  "{suggestion}"
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  suggestionGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 12,
  },
  suggestionItem: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1E293B',
  },
});