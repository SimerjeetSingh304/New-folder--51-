import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import AddJob from './pages/AddJob';
import Aptitude from './pages/Aptitude';
import AddProblem from './pages/AddProblem';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Skills from './pages/Skills';

// Loading spinner shown while AuthContext validates token
const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a',
    flexDirection: 'column',
    gap: '16px',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '3px solid #1e293b',
      borderTopColor: '#7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#475569', fontSize: '14px', fontWeight: '500' }}>Loading DevTracker...</p>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route — redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/add"
          element={
            <ProtectedRoute>
              <AddJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id/edit"
          element={
            <ProtectedRoute>
              <AddJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/aptitude"
          element={
            <ProtectedRoute>
              <Aptitude />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
