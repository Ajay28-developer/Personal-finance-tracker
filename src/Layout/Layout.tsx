import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-wrapper">
        <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="main-content p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
