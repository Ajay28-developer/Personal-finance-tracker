import React from 'react';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <div className="page-header mb-4">
      <h2 className="fw-bold mb-1">{title}</h2>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </div>
  );
};

export default Navbar;
