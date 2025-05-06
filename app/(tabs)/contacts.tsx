import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Users, UserPlus, Star, Phone, Mail, Calendar, TrendingUp } from 'lucide-react-native';
import ContactItem from '@/components/ContactItem';
import FilterTabs from '@/components/FilterTabs';
import EmptyState from '@/components/EmptyState';
import { useContacts } from '@/hooks/useContacts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ContactsScreen() {
  const { contacts } = useContacts();
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All Contacts' },
    { id: 'recent', label: 'Recent' },
    { id: 'follow-up', label: 'Follow Up' },
    { id: 'favorites', label: 'Favorites' }
  ];

  const relationshipInsights = {
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    title: 'Network Growth',
    description: 'Your professional network has grown by 15% this month. 8 follow-ups scheduled for this week.',
    stats: [
      { label: 'New Connections', value: '+12', trend: 'up' },
      { label: 'Follow-ups', value: '8', trend: 'up' },
      { label: 'Response Rate', value: '92%', trend: 'up' }
    ]
  };

  const quickStats = [
    {
      icon: <Users size={24} color="#3B82F6" />,
      label: 'Total',
      value: '248',
      subtitle: 'Contacts',
      color: '#DBEAFE'
    },
    {
      icon: <Star size={24} color="#F59E0B" />,
      label: 'Key',
      value: '12',
      subtitle: 'Relationships',
      color: '#FEF3C7'
    },
    {
      icon: <Phone size={24} color="#10B981" />,
      label: 'Recent',
      value: '18',
      subtitle: 'Interactions',
      color: '#D1FAE5'
    },
    {
      icon: <Calendar size={24} color="#8B5CF6" />,
      label: 'Pending',
      value: '5',
      subtitle: 'Follow-ups',
      color: '#EDE9FE'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts & Network</Text>
        <TouchableOpacity style={styles.addButton}>
          <UserPlus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FilterTabs 
        filters={filters} 
        activeFilter={filter} 
        onFilterChange={setFilter} 
      />

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
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

        <View style={styles.insightCard}>
          <Image 
            source={{ uri: relationshipInsights.image }}
            style={styles.insightImage}
          />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>{relationshipInsights.title}</Text>
            <Text style={styles.insightDescription}>
              {relationshipInsights.description}
            </Text>
            <View style={styles.insightStats}>
              {relationshipInsights.stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.insightStatValue}>{stat.value}</Text>
                  <Text style={styles.insightStatLabel}>{stat.label}</Text>
                  {stat.trend === 'up' && <TrendingUp size={16} color="#10B981" />}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact List</Text>
          
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))
          ) : (
            <EmptyState 
              title="No contacts yet" 
              message="Start building your network by adding your first contact"
              icon="users"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'right',
    flex: 1,
    marginRight: 16,
  },
  addButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  insightImage: {
    width: '100%',
    height: 160,
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
    flexDirection: 'row',
  },
  insightStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 4,
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  section: {
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