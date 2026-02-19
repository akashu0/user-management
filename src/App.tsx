import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import './App.css';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from 'sonner';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);


  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />




        {/* Placeholder Routes for Sidebar Navigation */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <h1 className="text-4xl font-black text-[#3D3462] mb-4">Dashboard</h1>
                  <p className="text-gray-400">Welcome to the Admin Dashboard overview.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <h1 className="text-4xl font-black text-[#3D3462] mb-4">Team Management</h1>
                  <p className="text-gray-400">Manage your team members here.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                  <h1 className="text-4xl font-black text-[#3D3462] mb-4">Settings</h1>
                  <p className="text-gray-400">Configure your application settings.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>
    </Router>
  );
}

export default App;
