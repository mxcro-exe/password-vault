import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LayoutWrapper } from './components/LayoutWrapper';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Vault } from './pages/Vault';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { PassphraseGenerator } from './pages/PassphraseGenerator';
import { PasswordAnalyzer } from './pages/PasswordAnalyzer';
import { BreachChecker } from './pages/BreachChecker';
import { PolicyBuilder } from './pages/PolicyBuilder';
import { TemplatesPage } from './pages/Templates';
import { PasswordHistoryPage } from './pages/History';
import { FavoritesPage } from './pages/Favorites';
import { SettingsPage } from './pages/Settings';
import { SecurityTipsPage } from './pages/SecurityTips';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <LayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
              <Route path="/generator" element={<ProtectedRoute><PasswordGenerator /></ProtectedRoute>} />
              <Route path="/passphrase" element={<ProtectedRoute><PassphraseGenerator /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute><PasswordAnalyzer /></ProtectedRoute>} />
              <Route path="/breach" element={<ProtectedRoute><BreachChecker /></ProtectedRoute>} />
              <Route path="/policy" element={<ProtectedRoute><PolicyBuilder /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><PasswordHistoryPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/tips" element={<ProtectedRoute><SecurityTipsPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
