import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Wallet,
  Crown,
  Gift,
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  
  const sections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: 'Manage your personal information',
          action: () => {},
        },
        {
          icon: Shield,
          label: 'Security',
          description: 'Password, 2FA, and login settings',
          action: () => {},
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Configure your notification preferences',
          action: () => {},
        },
      ],
    },
    {
      title: 'Subscription & Billing',
      items: [
        {
          icon: Crown,
          label: 'Current Plan',
          description: 'Pro Plan - $9.99/month',
          badge: 'Active',
          action: () => {},
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage your payment options',
          action: () => {},
        },
        {
          icon: Wallet,
          label: 'Billing History',
          description: 'View past invoices and payments',
          action: () => {},
        },
        {
          icon: Gift,
          label: 'Redeem Code',
          description: 'Use a promo or gift code',
          action: () => {},
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Account Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {sections.map((section, sectionIndex) => (
          <View 
            key={section.title} 
            style={[
              styles.section,
              sectionIndex === sections.length - 1 && styles.lastSection
            ]}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.settingIcon}>
                    <item.icon size={20} color="#4361EE" />
                  </View>
                  
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDescription}>
                      {item.description}
                    </Text>
                  </View>

                  {item.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  ) : (
                    <ChevronRight size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  badge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});