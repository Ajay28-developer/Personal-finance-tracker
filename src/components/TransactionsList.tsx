import React, { useState } from 'react';
import { CATEGORIES, useTransactions } from '../context/TransactionContext';
import type { Transaction } from '../context/TransactionContext';
import Navbar from './Navbar';

const getCategoryBadgeClass = (category: string) => {
  if (category === 'Salary' || category === 'Freelance') return 'bg-success-soft text-success';
  if (category === 'Food' || category === 'Shopping') return 'bg-warning-soft text-warning';
  if (category === 'Rent' || category === 'Utilities') return 'bg-info-soft text-info';
  return 'bg-primary-soft text-primary';
};

const emptyForm = {
  title: '',
  amount: '',
  type: 'expense' as 'income' | 'expense',
  category: '',
  date: '',
};

const TransactionsList: React.FC = () => {
  const { searchedTransactions, currency, updateTransaction, deleteTransaction } = useTransactions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      title: transaction.title,
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editForm.title.trim() || !editForm.amount || Number(editForm.amount) <= 0 || !editForm.category || !editForm.date) {
      alert('Please fill all required fields with valid values.');
      return;
    }

    updateTransaction(editingId, {
      title: editForm.title.trim(),
      amount: Number(editForm.amount),
      type: editForm.type,
      category: editForm.category,
      date: editForm.date,
    });
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      if (editingId === id) cancelEdit();
    }
  };

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Transactions List"
        subtitle={`Showing ${searchedTransactions.length} transaction(s)`}
      />

      <div className="card border-0 shadow-sm rounded-4 bg-card-custom overflow-hidden">
        <div className="card-body p-0">
          {searchedTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-table text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No transactions found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light-custom">
                  <tr className="text-sm text-muted">
                    <th className="px-4 py-3 border-0">Title</th>
                    <th className="px-4 py-3 border-0">Amount</th>
                    <th className="px-4 py-3 border-0">Type</th>
                    <th className="px-4 py-3 border-0">Category</th>
                    <th className="px-4 py-3 border-0">Date</th>
                    <th className="px-4 py-3 border-0 text-center" style={{ width: '140px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchedTransactions.map((t) => {
                    const isEditing = editingId === t.id;
                    const isIncome = t.type === 'income';

                    if (isEditing) {
                      return (
                        <tr key={t.id} className="edit-row">
                          <td className="px-4 py-2">
                            <input
                              className="form-control form-control-sm"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              className="form-control form-control-sm"
                              value={editForm.amount}
                              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select
                              className="form-select form-select-sm"
                              value={editForm.type}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  type: e.target.value as 'income' | 'expense',
                                })
                              }
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              className="form-select form-select-sm"
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            >
                              <option value="">Select</option>
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button className="btn btn-primary btn-sm me-1" onClick={saveEdit}>
                              Save
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                              Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={t.id} className="border-bottom">
                        <td className="px-4 py-3 fw-semibold">{t.title}</td>
                        <td className={`px-4 py-3 fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                          {isIncome ? '+' : '-'}
                          {currency}
                          {t.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${isIncome ? 'bg-success' : 'bg-danger'}`}>
                            {isIncome ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge badge-category ${getCategoryBadgeClass(t.category)}`}>
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {new Date(t.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => startEdit(t)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(t.id)}
                          >
                            <i className="bi bi-trash3"></i>
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

export default TransactionsList;
