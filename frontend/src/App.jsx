import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="loading-spinner w-8 h-8 border-4 border-gray-200 border-t-primary-600"></div>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route component - redirects to dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Login />
                  </React.Suspense>
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Register />
                  </React.Suspense>
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<LoadingSpinner />}>
                    <Dashboard />
                  </React.Suspense>
                </ProtectedRoute>
              } 
            />

            {/* Redirect root - check authentication first */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Navigate to="/dashboard" replace />
                </PublicRoute>
              }
            />

            {/* Catch all other routes */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a 
                      href="/dashboard" 
                      className="text-primary-600 hover:text-primary-500 font-medium"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
