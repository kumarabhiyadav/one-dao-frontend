// App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import ProductDisplay from './pages/ProductPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmail from './pages/VerifyOTPPage';
import { AlertProvider } from './provider/AlertProvider';



// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('userToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper component (only accessible when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('userToken');
  
  if (token) {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add any initial auth check logic here
    // For example, verify token validity with backend
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>;
  }

  return (
    <AlertProvider>
    <Router>
      <Routes>
        {/* Public routes - only accessible when not logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        <Route path="/verify-email" element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <ProductDisplay />
          </ProtectedRoute>
        } />

        <Route path="/" element={
          localStorage.getItem('userToken') 
            ? <Navigate to="/products" replace />
            : <Navigate to="/login" replace />
        } />

        {/* Catch all other routes and redirect to appropriate page */}
        <Route path="*" element={
          localStorage.getItem('userToken') 
            ? <Navigate to="/products" replace />
            : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
    </AlertProvider>
  );
}

export default App;