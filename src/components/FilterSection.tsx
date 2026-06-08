import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import Navbar from './Navbar';

const getCategoryBadgeClass = (category: string) => {
  if (category === 'Salary' || category === 'Freelance') return 'bg-success-soft text-success';
  if (category === 'Food' || category === 'Shopping') return 'bg-warning-soft text-warning';
  if (category === 'Rent' || category === 'Utilities') return 'bg-info-soft text-info';
  return 'bg-primary-soft text-primary';
};

const FilterSection: React.FC = () => {
  const { transactions, currency, deleteTransaction } = useTransactions();

  // Local filter states
  const [category, setCategory] = useState<string>('');
  const [type, setType] = useState<string>('all');
  const [date, setDate] = useState<string>('');

  // Active filter states (applied after clicking Apply)
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    type: 'all',
    date: '',
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilters({
      category,
      type,
      date,
    });
  };

  const handleReset = () => {
    setCategory('');
    setType('all');
    setDate('');
    setActiveFilters({
      category: '',
      type: 'all',
      date: '',
    });
  };

  // Filter logic
  const filteredTransactions = transactions.filter((t) => {
    // Category filter
    if (activeFilters.category && t.category !== activeFilters.category) {
      return false;
    }
    // Type filter
    if (activeFilters.type !== 'all' && t.type !== activeFilters.type) {
      return false;
    }
    // Date filter
    if (activeFilters.date && t.date !== activeFilters.date) {
      return false;
    }
    return true;
  });

  // Extract all unique categories present in the current database for easy selection
  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category)));

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Filter Section"
        subtitle="Refine your transactions using category, type, and date filters"
      />

      {/* Filter Control Box */}
      <div className="card border-0 shadow-sm rounded-4 bg-card-custom mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleApply} className="row g-3">
            {/* Category selection */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-muted text-sm">Category</label>
              <select
                className="form-select bg-light-custom border-0 shadow-none py-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Type selection */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-muted text-sm">Transaction Type</label>
              <select
                className="form-select bg-light-custom border-0 shadow-none py-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income Only (+)</option>
                <option value="expense">Expense Only (-)</option>
              </select>
            </div>

            {/* Date selection */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-muted text-sm">Date</label>
              <input
                type="date"
                className="form-control bg-light-custom border-0 shadow-none py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-1">
              <button
                type="button"
                className="btn btn-outline-secondary px-4 py-2 border-0 bg-transparent text-muted"
                onClick={handleReset}
              >
                Reset Filters
              </button>
              <button type="submit" className="btn btn-primary px-4 py-2">
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filtered Results Table */}
      <div className="card border-0 shadow-sm rounded-4 bg-card-custom overflow-hidden">
        <div className="card-header bg-transparent border-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Filtered Results</h5>
          <span className="badge bg-primary rounded-pill">
            {filteredTransactions.length} results
          </span>
        </div>

        <div className="card-body p-0">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-filter-circle text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No transactions match the selected filters.</p>
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
                    <th className="px-4 py-3 border-0 text-center" style={{ width: '100px' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => {
                    const isIncome = t.type === 'income';
                    return (
                      <tr key={t.id} className="border-bottom">
                        <td className="px-4 py-3 fw-semibold text-sm">
                          {t.title}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge badge-category ${getCategoryBadgeClass(t.category)}`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isIncome ? (
                            <span className="badge bg-success text-white">Income</span>
                          ) : (
                            <span className="badge bg-danger text-white">Expense</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted text-sm">
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
                        <td className="px-4 py-3 text-center">
                          <button
                            className="btn btn-outline-danger btn-sm border-0 bg-transparent"
                            onClick={() => {
                              if (window.confirm('Delete this transaction?')) {
                                deleteTransaction(t.id);
                              }
                            }}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
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

export default FilterSection;
