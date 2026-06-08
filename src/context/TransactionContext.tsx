import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export const CATEGORIES = [
  'Salary',
  'Freelance',
  'Food',
  'Rent',
  'Utilities',
  'Shopping',
  'Transport',
  'Entertainment',
  'Healthcare',
  'Other',
] as const;

const dummyTransactions: Transaction[] = [
  {
    id: 'd1',
    title: 'Monthly Salary',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: '2026-06-01',
  },
  {
    id: 'd2',
    title: 'Grocery Shopping',
    amount: 150,
    type: 'expense',
    category: 'Food',
    date: '2026-06-02',
  },
  {
    id: 'd3',
    title: 'House Rent',
    amount: 1200,
    type: 'expense',
    category: 'Rent',
    date: '2026-06-03',
  },
  {
    id: 'd4',
    title: 'Freelance Project',
    amount: 850,
    type: 'income',
    category: 'Freelance',
    date: '2026-06-04',
  },
  {
    id: 'd5',
    title: 'Electricity Bill',
    amount: 90,
    type: 'expense',
    category: 'Utilities',
    date: '2026-06-05',
  },
];

interface SettingsState {
  currency: string;
  budget: number;
  darkMode: boolean;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  clearAllData: () => void;
  currency: string;
  setCurrency: (value: string) => void;
  budget: number;
  setBudget: (value: number) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  searchedTransactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const getUserKey = (suffix: string) => {
  const userString = localStorage.getItem('user');
  if (!userString) return `guest_${suffix}`;
  const user = JSON.parse(userString) as { email: string };
  return `${user.email}_${suffix}`;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<SettingsState>({
    currency: '$',
    budget: 5000,
    darkMode: false,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const txKey = getUserKey('transactions');
  const settingsKey = getUserKey('settings');

  useEffect(() => {
    const storedTx = localStorage.getItem(txKey);
    const storedSettings = localStorage.getItem(settingsKey);

    if (storedTx) {
      setTransactions(JSON.parse(storedTx) as Transaction[]);
    } else {
      setTransactions(dummyTransactions);
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings) as SettingsState);
    }
  }, [txKey, settingsKey]);

  useEffect(() => {
    localStorage.setItem(txKey, JSON.stringify(transactions));
  }, [transactions, txKey]);

  useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }, [settings, settingsKey]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', settings.darkMode);
  }, [settings.darkMode]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...transaction } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllData = () => {
    setTransactions([]);
    localStorage.removeItem(txKey);
  };

  const setCurrency = (currency: string) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const setBudget = (budget: number) => {
    setSettings((prev) => ({ ...prev, budget }));
  };

  const setDarkMode = (darkMode: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode }));
  };

  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const searchedTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllData,
    currency: settings.currency,
    setCurrency,
    budget: settings.budget,
    setBudget,
    darkMode: settings.darkMode,
    setDarkMode,
    searchQuery,
    setSearchQuery,
    searchedTransactions,
    ...totals,
  };

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
