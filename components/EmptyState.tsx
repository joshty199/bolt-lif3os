import { View, Text, StyleSheet } from 'react-native';
import { BookOpen, ClipboardList, Users, DollarSign, Dumbbell, Target, Plane } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'book-open':
        return <BookOpen size={48} color="#94A3B8" />;
      case 'clipboard-list':
        return <ClipboardList size={48} color="#94A3B8" />;
      case 'users':
        return <Users size={48} color="#94A3B8" />;
      case 'dollar-sign':
        return <DollarSign size={48} color="#94A3B8" />;
      case 'dumbbell':
        return <Dumbbell size={48} color="#94A3B8" />;
      case 'target':
        return <Target size={48} color="#94A3B8" />;
      case 'plane':
        return <Plane size={48} color="#94A3B8" />;
      default:
        return <ClipboardList size={48} color="#94A3B8" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});