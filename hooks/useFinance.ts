import { useState } from 'react';
import { Transaction, FinanceSummary } from '@/types';

// Mock data for demo purposes
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'finance-1',
    amount: 120.50,
    description: 'Grocery shopping',
    type: 'expense',
    category: 'Food',
    date: 'Today',
    isToday: true,
  },
  {
    id: 'finance-2',
    amount: 2500,
    description: 'Monthly salary',
    type: 'income',
    category: 'Salary',
    date: 'Yesterday',
    isToday: false,
  },
  {
    id: 'finance-3',
    amount: 45.99,
    description: 'Restaurant dinner',
    type: 'expense',
    category: 'Dining',
    date: 'Yesterday',
    isToday: false,
  },
  {
    id: 'finance-4',
    amount: 9.99,
    description: 'Streaming subscription',
    type: 'expense',
    category: 'Entertainment',
    date: 'Last week',
    isToday: false,
  },
];

const INITIAL_SUMMARY: FinanceSummary = {
  balance: 2324.52,
  income: 2500,
  expenses: 175.48,
  period: 'This week',
};

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [summary, setSummary] = useState<FinanceSummary>(INITIAL_SUMMARY);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    
    // Update summary based on new transaction
    const newSummary = { ...summary };
    
    if (transaction.type === 'income') {
      newSummary.income += transaction.amount;
      newSummary.balance += transaction.amount;
    } else {
      newSummary.expenses += transaction.amount;
      newSummary.balance -= transaction.amount;
    }
    
    setSummary(newSummary);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    // Would need more complex logic to properly update the summary
    // when updating existing transactions
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    // Would need to update summary accordingly
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return {
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}