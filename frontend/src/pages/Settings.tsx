import React, { useState } from 'react';
import { Shield, Clock, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [clipboardTimer, setClipboardTimer] = useState('30');
  const [defaultLength, setDefaultLength] = useState('16');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('setting_clipboard_timer', clipboardTimer);
    localStorage.setItem('setting_default_length', defaultLength);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Preferences</h1>
        <p className="text-xs text-cyber-muted">Customize security behavior, clipboard auto-purge triggers, and display parameters.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        {saved && (
          <div className="p-3 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Preferences updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="space-y-1.5">
            <label className="text-cyber-muted font-semibold flex items-center gap-1.5">
              <Clock size={14} className="text-cyber-cyan" /> Clipboard Protection Auto-Clear Timer
            </label>
            <select
              value={clipboardTimer}
              onChange={e => setClipboardTimer(e.target.value)}
              className="glass-input w-full text-xs"
            >
              <option value="15">15 Seconds (Aggressive Security)</option>
              <option value="30">30 Seconds (Recommended)</option>
              <option value="60">60 Seconds</option>
              <option value="0">Disabled (Not Recommended)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-cyber-muted font-semibold flex items-center gap-1.5">
              <Shield size={14} className="text-cyber-cyan" /> Default Generator Character Length
            </label>
            <select
              value={defaultLength}
              onChange={e => setDefaultLength(e.target.value)}
              className="glass-input w-full text-xs"
            >
              <option value="12">12 Characters</option>
              <option value="16">16 Characters (Standard Enterprise)</option>
              <option value="24">24 Characters</option>
              <option value="32">32 Characters (Maximum Resilience)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-cyber-border">
            <div>
              <span className="text-white font-semibold block">Interface Theme</span>
              <span className="text-cyber-muted text-[10px]">Toggle between Cybersecurity Dark mode and Light mode.</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="glass-panel px-3 py-1.5 border border-cyber-border rounded-lg text-cyber-cyan hover:text-white transition font-semibold"
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-cyber-border">
            <div>
              <span className="text-white font-semibold block">Security System Alerts</span>
              <span className="text-cyber-muted text-[10px]">Receive notifications regarding weak passwords or breach updates.</span>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
              className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-cyber py-2.5 font-bold text-xs"
          >
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
};
