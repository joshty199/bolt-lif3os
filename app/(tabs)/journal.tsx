import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SquarePen as PenSquare, Hash } from 'lucide-react-native';
import JournalEntry from '@/components/JournalEntry';
import EmptyState from '@/components/EmptyState';
import NewJournalModal from '@/components/NewJournalModal';
import { useJournal } from '@/hooks/useJournal';

export default function JournalScreen() {
  const { entries, addJournalEntry } = useJournal();
  const [filter, setFilter] = useState('all');
  const [isNewEntryModalVisible, setIsNewEntryModalVisible] = useState(false);
  
  const filters = [
    { id: 'all', label: 'All Entries' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'mood', label: 'Mood Tracking' }
  ];

  const moodInsights = {
    image: 'https://images.pexels.com/photos/3758104/pexels-photo-3758104.jpeg',
    title: 'Weekly Mood Analysis',
    description: 'Your mood has been consistently positive this week. Journal entries show increased productivity and creativity.',
    stats: [
      { label: 'Entries', value: '12', trend: 'up' },
      { label: 'Avg Mood', value: '4.2/5', trend: 'up' },
      { label: 'Consistency', value: '85%', trend: 'neutral' }
    ]
  };

  const popularTags = ['productivity', 'goals', 'reflection', 'gratitude'];

  const filteredEntries = entries.filter(entry => {
    switch (filter) {
      case 'today':
        return entry.isToday;
      case 'week':
        return entry.isThisWeek;
      case 'mood':
        return entry.hasMood;
      default:
        return true;
    }
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Journal & Reflection</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsNewEntryModalVisible(true)}
          >
            <PenSquare size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>New Entry</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {filters.map((filterItem) => (
            <TouchableOpacity
              key={filterItem.id}
              style={[
                styles.filterChip,
                filter === filterItem.id && styles.filterChipActive
              ]}
              onPress={() => setFilter(filterItem.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === filterItem.id && styles.filterTextActive
                ]}
              >
                {filterItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.insightCard}>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>{moodInsights.title}</Text>
            <Text style={styles.insightDescription}>
              {moodInsights.description}
            </Text>
            <View style={styles.insightStats}>
              {moodInsights.stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.tagsSection}>
          <View style={styles.tagHeader}>
            <Hash size={16} color="#64748B" />
            <Text style={styles.tagTitle}>Popular Tags</Text>
          </View>
          <View style={styles.tagContainer}>
            {popularTags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <JournalEntry key={entry.id} entry={entry} />
            ))
          ) : (
            <EmptyState 
              title="Start Your Journal" 
              message="Begin your journaling journey by writing your first entry"
              icon="book-open"
            />
          )}
        </View>
      </View>

      <NewJournalModal
        visible={isNewEntryModalVisible}
        onClose={() => setIsNewEntryModalVisible(false)}
        onSave={addJournalEntry}
      />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#4361EE',
  },
  filterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  insightCard: {
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
  insightContent: {
    padding: 16,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#4361EE',
    fontSize: 14,
    fontWeight: '500',
  },
  entriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'right',
  },
});