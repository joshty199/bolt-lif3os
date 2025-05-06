import { View, Text, StyleSheet } from 'react-native';

interface ModuleInsightProps {
  title: string;
  count: string;
  subtitle: string;
  color: string;
}

export default function ModuleInsight({ title, count, subtitle, color }: ModuleInsightProps) {
  return (
    <View style={[styles.container, { width: '48%' }]}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
  },
  title: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
});