import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import MedicineCatalog from './pages/customer/MedicineCatalog';
import Cart from './pages/customer/Cart';
import OrderHistory from './pages/customer/OrderHistory';
import OrderTracking from './pages/customer/OrderTracking';
import UploadPrescription from './pages/customer/UploadPrescription';
import PharmacistDashboard from './pages/pharmacist/Dashboard';
import InventoryManagement from './pages/pharmacist/InventoryManagement';
import PrescriptionQueue from './pages/pharmacist/PrescriptionQueue';
import OrderManagement from './pages/pharmacist/OrderManagement';
import DeliveryDashboard from './pages/delivery/Dashboard';
import Layout from './components/common/Layout';

function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  switch (user.role) {
    case 'PHARMACIST': return <Navigate to="/admin/dashboard" />;
    case 'DELIVERY_AGENT': return <Navigate to="/delivery/dashboard" />;
    default: return <Navigate to="/customer/dashboard" />;
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<AppRedirect />} />

      {/* Customer Routes */}
      <Route path="/customer" element={<ProtectedRoute roles={['CUSTOMER']}><Layout role="CUSTOMER" /></ProtectedRoute>}>
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="medicines" element={<MedicineCatalog />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="orders/:id" element={<OrderTracking />} />
        <Route path="prescriptions" element={<UploadPrescription />} />
      </Route>

      {/* Pharmacist Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['PHARMACIST']}><Layout role="PHARMACIST" /></ProtectedRoute>}>
        <Route path="dashboard" element={<PharmacistDashboard />} />
        <Route path="prescriptions" element={<PrescriptionQueue />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
      </Route>

      {/* Delivery Routes */}
      <Route path="/delivery" element={<ProtectedRoute roles={['DELIVERY_AGENT']}><Layout role="DELIVERY_AGENT" /></ProtectedRoute>}>
        <Route path="dashboard" element={<DeliveryDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
