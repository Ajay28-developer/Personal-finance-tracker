import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/add-transaction', label: 'Add Transaction', icon: 'bi-plus-circle' },
  { path: '/transactions', label: 'Transactions List', icon: 'bi-list-ul' },
  { path: '/filter', label: 'Filter Section', icon: 'bi-funnel' },
  { path: '/summary', label: 'Summary & Charts', icon: 'bi-bar-chart-line' },
  { path: '/settings', label: 'Settings', icon: 'bi-gear' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={onClose}
          role="presentation"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand px-4 py-4">
          <div className="d-flex align-items-center gap-2">
            <div className="brand-icon">
              <i className="bi bi-wallet2"></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Expensy</h5>
              <small className="text-muted">Finance Tracker</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* <div className="sidebar-footer px-4 py-3 mt-auto">
          <small className="text-muted">© 2026 Expensy</small>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
