import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const userString = localStorage.getItem('user');
  const userEmail = userString ? (JSON.parse(userString) as { email: string }).email : 'User';

  return (
    <header className="navbar navbar-expand-md border-bottom px-3 py-2 bg-card-custom shadow-sm">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3">
        <button
          className="btn btn-primary d-lg-none"
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list"></i>
        </button>


        <div className="d-flex ms-auto text-end gap-3">
          <div className="text-end d-none d-sm-block">
            <div className="fw-bold text-truncate text-sm" style={{ maxWidth: '150px' }}>
              {userEmail.split('@')[0]}
            </div>
            <div className="text-muted small">{userEmail}</div>
          </div>
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '40px', height: '40px' }}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
