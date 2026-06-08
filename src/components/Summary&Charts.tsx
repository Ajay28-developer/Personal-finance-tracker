import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import Navbar from './Navbar';

const CHART_COLORS = [
  '#0d6efd',
  '#198754',
  '#ffc107',
  '#dc3545',
  '#0dcaf0',
  '#6f42c1',
  '#fd7e14',
  '#20c997',
  '#d63384',
  '#6c757d',
];

const SummaryCharts: React.FC = () => {
  const { transactions, currency, balance, totalIncome, totalExpense } = useTransactions();

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map.set(t.category, (map.get(t.category) || 0) + t.amount);
      });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const existing = map.get(key) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expense += t.amount;
      }
      map.set(key, existing);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => {
        const [year, m] = month.split('-');
        const label = new Date(Number(year), Number(m) - 1).toLocaleDateString(undefined, {
          month: 'short',
          year: '2-digit',
        });
        return { month: label, income: data.income, expense: data.expense };
      });
  }, [transactions]);

  const summaryCards = [
    { title: 'Total Income', value: totalIncome, color: 'success', icon: 'bi-graph-up-arrow' },
    { title: 'Total Expense', value: totalExpense, color: 'danger', icon: 'bi-graph-down-arrow' },
    { title: 'Current Balance', value: balance, color: 'primary', icon: 'bi-piggy-bank' },
  ];

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Summary & Charts"
        subtitle="Visual insights into your spending patterns"
      />

      <div className="row g-4 mb-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="col-12 col-md-4">
            <div className={`stat-card stat-card-${card.color}`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="stat-label mb-1">{card.title}</p>
                  <h3 className="stat-value mb-0">
                    {currency}
                    {Math.abs(card.value).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h3>
                </div>
                <div className={`stat-icon bg-${card.color}`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 bg-card-custom h-100">
            <div className="card-header bg-transparent border-0 px-4 py-3">
              <h5 className="fw-bold mb-0">Expenses by Category</h5>
            </div>
            <div className="card-body" style={{ minHeight: '320px' }}>
              {expenseByCategory.length === 0 ? (
                <div className="text-center py-5 text-muted">No expense data to display.</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {expenseByCategory.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `${currency}${Number(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 bg-card-custom h-100">
            <div className="card-header bg-transparent border-0 px-4 py-3">
              <h5 className="fw-bold mb-0">Monthly Income & Expenses</h5>
            </div>
            <div className="card-body" style={{ minHeight: '320px' }}>
              {monthlyData.length === 0 ? (
                <div className="text-center py-5 text-muted">No monthly data to display.</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        `${currency}${Number(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      }
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#198754" radius={[6, 6, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#dc3545" radius={[6, 6, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCharts;
