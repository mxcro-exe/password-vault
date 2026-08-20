import React, { useState } from 'react';
import { Sun, Moon, Bell, Search, ShieldCheck, HardDrive } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { userEmail, isSimulated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, text: "Security Score audit complete. 94% strength.", time: "5m ago" },
    { id: 2, text: "New password generated for Amazon.", time: "1h ago" },
  ];

  return (
    <header className="glass-panel sticky top-0 right-0 z-20 flex items-center justify-between px-6 py-4 border-b">
      {/* Search bar */}
      <div className="relative w-80 hidden md:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-cyber-muted">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Global vault search..."
          className="glass-input w-full pl-10 pr-4 py-1.5 text-sm"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold glass-panel text-cyber-cyan border-cyber-cyan/30">
          {isSimulated ? (
            <>
              <HardDrive size={14} className="animate-pulse" />
              <span>Simulated Offline Storage</span>
            </>
          ) : (
            <>
              <ShieldCheck size={14} className="text-cyber-green animate-bounce" />
              <span>Zero-Knowledge API Online</span>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-white/5 text-cyber-muted hover:text-white relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-cyan rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel border border-cyber-border rounded-lg shadow-xl overflow-hidden z-50">
              <div className="px-4 py-2 border-b border-cyber-border bg-white/5 font-semibold text-sm">
                Notifications
              </div>
              <div className="divide-y divide-cyber-border">
                {mockNotifications.map(n => (
                  <div key={n.id} className="p-3 text-xs hover:bg-white/5 transition-all">
                    <p className="text-white">{n.text}</p>
                    <span className="text-cyber-muted mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-cyber-muted hover:text-white"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-cyber-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-cyan to-cyber-blue flex items-center justify-center font-bold text-sm text-white shadow-glow">
            {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'SP'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Admin User</p>
            <p className="text-[10px] text-cyber-muted leading-tight">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
