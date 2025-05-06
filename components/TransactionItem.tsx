import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react-native';
import { Transaction } from '@/types';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.iconContainer, 
          isIncome ? styles.incomeIconBg : styles.expenseIconBg
        ]}
      >
        {isIncome ? (
          <ArrowUpRight size={16} color="#10B981" />
        ) : (
          <ArrowDownRight size={16} color="#EF4444" />
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        {transaction.category && (
          <Text style={styles.category}>{transaction.category}</Text>
        )}
      </View>
      
      <View style={styles.rightContent}>
        <Text 
          style={[
            styles.amount, 
            isIncome ? styles.incomeText : styles.expenseText
          ]}
        >
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        <View style={styles.dateContainer}>
          <Calendar size={12} color="#94A3B8" />
          <Text style={styles.date}>{transaction.date}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIconBg: {
    backgroundColor: '#D1FAE5',
  },
  expenseIconBg: {
    backgroundColor: '#FEE2E2',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#64748B',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#94A3B8',
    marginLeft: 4,
  },
});