import React from 'react';
import { Link } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import Navbar from './Navbar';

const getCategoryBadgeClass = (category: string) => {
  if (category === 'Salary' || category === 'Freelance') return 'bg-success-soft text-success';
  if (category === 'Food' || category === 'Shopping') return 'bg-warning-soft text-warning';
  if (category === 'Rent' || category === 'Utilities') return 'bg-info-soft text-info';
  return 'bg-primary-soft text-primary';
};

const Dashboard: React.FC = () => {
  const {
    currency,
    balance,
    totalIncome,
    totalExpense,
    searchedTransactions,
  } = useTransactions();

  const displayTransactions = searchedTransactions.slice(0, 5);

  const cards = [
    {
      title: 'Current Balance',
      value: balance,
      icon: 'bi-wallet2',
      color: 'primary',
      prefix: balance >= 0 ? '' : '-',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: 'bi-arrow-down-circle',
      color: 'success',
      prefix: '+',
    },
    {
      title: 'Total Expense',
      value: totalExpense,
      icon: 'bi-arrow-up-circle',
      color: 'danger',
      prefix: '-',
    },
  ];

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Dashboard"
      // subtitle="Overview of your finances and recent activity"
      />

      <div className="row g-4 mb-4 justify-content-center">
        {cards.map((card) => (
          <div key={card.title} className="col-12 col-sm-6 col-md-4">
            <div className={`stat-card stat-card-${card.color}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="stat-label mb-1">{card.title}</p>
                  <h3 className="stat-value mb-0">
                    {`${card.prefix}${currency}${Math.abs(card.value).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
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

      <div className="card border-0 shadow-sm rounded-4 bg-card-custom">
        <div className="card-header bg-transparent border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Recent Transactions</h5>
          <Link to="/transactions" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="card-body p-0">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-3">No transactions yet.</p>
              <Link to="/add-transaction" className="btn btn-primary">
                Add Your First Transaction
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light-custom">
                  <tr className="text-sm text-muted">
                    <th className="px-4 py-3 border-0">Title</th>
                    <th className="px-4 py-3 border-0">Category</th>
                    <th className="px-4 py-3 border-0">Type</th>
                    <th className="px-4 py-3 border-0">Date</th>
                    <th className="px-4 py-3 border-0 text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map((t) => {
                    const isIncome = t.type === 'income';
                    return (
                      <tr key={t.id} className="border-bottom">
                        <td className="px-4 py-3 fw-semibold">{t.title}</td>
                        <td className="px-4 py-3">
                          <span className={`badge badge-category ${getCategoryBadgeClass(t.category)}`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${isIncome ? 'bg-success' : 'bg-danger'}`}>
                            {isIncome ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {new Date(t.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className={`px-4 py-3 text-end fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                          {isIncome ? '+' : '-'}
                          {currency}
                          {t.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
