import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { DollarSign, Wallet, CreditCard, ChartPie as PieChart, TrendingUp, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import TransactionItem from '@/components/TransactionItem';
import FilterTabs from '@/components/FilterTabs';
import EmptyState from '@/components/EmptyState';
import { useFinance } from '@/hooks/useFinance';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function FinanceScreen() {
  const { transactions, summary } = useFinance();
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'Overview' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'budgets', label: 'Budgets' }
  ];

  const monthlyInsight = {
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
    title: 'Financial Health',
    description: 'You\'re under budget in most categories. Consider allocating the surplus to your investment goals.',
    stats: [
      { label: 'Spending', value: '-12%', trend: 'down' },
      { label: 'Savings', value: '+24%', trend: 'up' },
      { label: 'Net Worth', value: '+8%', trend: 'up' }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Finance & Budget</Text>
        </View>
        
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.addButton}>
            <Receipt size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
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
            source={{ uri: monthlyInsight.image }}
            style={styles.insightImage}
          />
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>{monthlyInsight.title}</Text>
            <Text style={styles.insightDescription}>
              {monthlyInsight.description}
            </Text>
            <View style={styles.insightStats}>
              {monthlyInsight.stats.map((stat, index) => (
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <PieChart size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <EmptyState 
              title="No transactions yet" 
              message="Start tracking your finances by adding your first transaction"
              icon="dollar-sign"
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
});