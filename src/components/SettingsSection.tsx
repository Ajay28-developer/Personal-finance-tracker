import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../context/TransactionContext';
import Navbar from './Navbar';

const CURRENCIES = [
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: '¥', label: 'JPY (¥)' },
];

const SettingsSection: React.FC = () => {
  const navigate = useNavigate();
  const {
    currency,
    setCurrency,
    budget,
    setBudget,
    darkMode,
    setDarkMode,
    clearAllData,
    transactionCount,
  } = useTransactions();

  const [localBudget, setLocalBudget] = useState(String(budget));

  const handleSaveBudget = () => {
    const value = Number(localBudget);
    if (value > 0) {
      setBudget(value);
      alert('Monthly budget updated successfully!');
    } else {
      alert('Please enter a valid budget amount.');
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        'This will permanently delete all your transactions. Are you sure?'
      )
    ) {
      clearAllData();
      alert('All transaction data has been cleared.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="animate-fade-in">
      <Navbar
        title="Settings"
        // subtitle="Customize your expense tracker preferences"
      />

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-card-custom h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi me-2 text-primary"></i>
                Preferences
              </h5>

              <div className="setting-item d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 className="mb-1 fw-semibold">Dark Mode</h6>
                  <p className="text-muted small mb-0">Toggle dark theme for the app</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Currency</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.symbol} value={c.symbol}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label fw-semibold">Monthly Budget</label>
                <div className="input-group">
                  <span className="input-group-text">{currency}</span>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={localBudget}
                    onChange={(e) => setLocalBudget(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button" onClick={handleSaveBudget}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-card-custom h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi  me-2 text-primary"></i>
                Account & Data
              </h5>

              <div className="mb-4 p-3 rounded-3 bg-light-custom">
                <p className="mb-1 text-muted small">Stored Transactions</p>
                <h4 className="fw-bold mb-0">{transactionCount}</h4>
              </div>

              <div className="d-grid gap-3">
                <button className="btn btn-outline-danger" onClick={handleClearData}>
                  <i className="bi bi-trash3 me-2"></i>
                  Clear All Data
                </button>
                <button className="btn btn-primary" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>

              <p className="text-muted small mt-3 mb-0">
                Logging out keeps your transaction data saved. You can sign back in anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
