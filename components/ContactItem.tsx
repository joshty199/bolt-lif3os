import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Users, Clock, MessageCircle } from 'lucide-react-native';
import { Contact } from '@/types';

interface ContactItemProps {
  contact: Contact;
}

export default function ContactItem({ contact }: ContactItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {contact.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          {contact.company && (
            <Text style={styles.company}>{contact.company}</Text>
          )}
        </View>
        {contact.needsFollowUp && (
          <View style={styles.followUpBadge}>
            <Text style={styles.followUpText}>Follow Up</Text>
          </View>
        )}
      </View>
      
      {contact.notes && (
        <Text style={styles.notes}>
          {contact.notes}
        </Text>
      )}
      
      <View style={styles.footer}>
        {contact.lastContact && (
          <View style={styles.metaItem}>
            <Clock size={14} color="#64748B" />
            <Text style={styles.metaText}>
              Last contact: {contact.lastContact}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={16} color="#3B82F6" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#64748B',
  },
  followUpBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  followUpText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  notes: {
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 4,
  },
});