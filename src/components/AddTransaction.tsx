import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, useTransactions } from '../context/TransactionContext';
import Navbar from './Navbar';

interface FormState {
  title: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

const AddTransaction: React.FC = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      title: form.title.trim(),
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    });

    setForm({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0],
    });

    navigate('/transactions');
  };

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Add Transaction"
        subtitle="Record a new income or expense entry"
      />

      <div className="card border-0 shadow-sm rounded-4 bg-card-custom">
        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Title *</label>
              <input
                type="text"
                name="title"
                className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Grocery shopping"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Amount *</label>
              <input
                type="number"
                name="amount"
                min="0.01"
                step="0.01"
                className={`form-control form-control-lg ${errors.amount ? 'is-invalid' : ''}`}
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
              />
              {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Type *</label>
              <select
                name="type"
                className="form-select form-select-lg"
                value={form.type}
                onChange={handleChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select
                name="category"
                className={`form-select form-select-lg ${errors.category ? 'is-invalid' : ''}`}
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Date *</label>
              <input
                type="date"
                name="date"
                className={`form-control form-control-lg ${errors.date ? 'is-invalid' : ''}`}
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            <div className="col-12 d-flex gap-2 pt-2">
              <button type="submit" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-plus-lg me-2"></i>
                Add Transaction
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4"
                onClick={() =>
                  setForm({
                    title: '',
                    amount: '',
                    type: 'expense',
                    category: '',
                    date: new Date().toISOString().split('T')[0],
                  })
                }
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
