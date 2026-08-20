import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, LayoutDashboard, Key, ShieldCheck, Database, 
  History, Star, FileText, Settings, HelpCircle, 
  Menu, X, Lock, FileKey2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Password Vault', path: '/vault', icon: Database },
    { name: 'Password Generator', path: '/generator', icon: Key },
    { name: 'Passphrase Gen', path: '/passphrase', icon: FileKey2 },
    { name: 'Password Analyzer', path: '/analyzer', icon: ShieldCheck },
    { name: 'Breach Checker', path: '/breach', icon: Shield },
    { name: 'Password Policy', path: '/policy', icon: FileText },
    { name: 'Templates', path: '/templates', icon: FileText },
    { name: 'History', path: '/history', icon: History },
    { name: 'Favorites', path: '/favorites', icon: Star },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Security Tips', path: '/tips', icon: HelpCircle },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-panel h-screen sticky top-0 left-0 flex flex-col justify-between z-30 border-r"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyber-border">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 font-extrabold text-lg text-white"
              >
                <Lock className="text-cyber-cyan h-6 w-6 animate-pulse" />
                <span>
                  SecurePass <span className="text-cyber-cyan">Pro</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-cyber-muted hover:text-white"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyber-blue/10 text-white border-l-2 border-cyber-cyan shadow-glow'
                    : 'text-cyber-muted hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cyber-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-150"
        >
          <X size={20} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};
