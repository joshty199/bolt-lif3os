import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { FinanceSummary as FinanceSummaryType } from '@/types';

interface FinanceSummaryProps {
  summary: FinanceSummaryType;
}

export default function FinanceSummary({ summary }: FinanceSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${summary.balance.toFixed(2)}</Text>
        <Text style={styles.periodText}>{summary.period}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.incomeIcon]}>
            <TrendingUp size={16} color="#10B981" />
          </View>
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statAmount}>+${summary.income.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <TrendingDown size={16} color="#EF4444" />
          </View>
          <View>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={styles.statAmount}>-${summary.expenses.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  balanceContainer: {
    padding: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: '#D1FAE5',
  },
  expenseIcon: {
    backgroundColor: '#FEE2E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
});