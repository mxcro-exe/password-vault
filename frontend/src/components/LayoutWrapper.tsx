import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MatrixRain } from './MatrixRain';
import { useAuth } from '../context/AuthContext';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Public pages that don't need sidebar/header (landing page, auth pages)
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  if (isPublicPage || !isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <MatrixRain />
        <main className="w-full min-h-screen">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-cyber-bg">
      <MatrixRain />
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-80px)]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
