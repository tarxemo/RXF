import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import FarmsPage from '../pages/FarmsPage';
import LivestockPage from '../pages/LivestockPage';
import UsersPage from '../pages/UsersPage';
import FinancialDashboard from '../pages/FinancialDashboard';
import CropsPage from '../pages/CropsPage';
import ExpensesPage from '../pages/ExpensesPage';
import ProductionPage from '../pages/ProductionPage';
import ReportsPage from '../pages/ReportsPage';
import SalesPage from '../pages/SalesPage';
import AssetsPage from '../pages/AssetsPage';
import AssetProductsPage from '../pages/ProductsPage';
import DashboardPage from '../pages/DashboardPage';


const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/livestocks" element={<LivestockPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/financials" element={<FinancialDashboard />} />
        <Route path="/crops" element={<CropsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/productions" element={<ProductionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/products" element={<AssetProductsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
  );
};

export default AppRoutes;