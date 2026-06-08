import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import AddTransaction from './components/AddTransaction';
import Dashboard from './components/Dashboard';
import FilterSection from './components/FilterSection';
import SettingsSection from './components/SettingsSection';
import SummaryCharts from './components/Summary&Charts';
import TransactionsList from './components/TransactionsList';
import Login from './Validation/Login';
import Register from './Validation/Register';

const isAuthenticated = () => localStorage.getItem('isAuthenticated') === 'true';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function MyRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/transactions" element={<TransactionsList />} />
        <Route path="/filter" element={<FilterSection />} />
        <Route path="/summary" element={<SummaryCharts />} />
        <Route path="/settings" element={<SettingsSection />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default MyRoutes;
