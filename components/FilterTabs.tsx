import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Filter {
  id: string;
  label: string;
}

interface FilterTabsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function FilterTabs({ filters, activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.tab,
            activeFilter === filter.id && styles.activeTab
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Text 
            style={[
              styles.tabText,
              activeFilter === filter.id && styles.activeTabText
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});