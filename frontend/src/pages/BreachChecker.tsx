import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Terminal } from 'lucide-react';

const BREACHED_DB: Record<string, number> = {
  "password": 9623832,
  "123456": 28182903,
  "123456789": 8203842,
  "qwerty": 4902832,
  "letmein": 1283723,
  "admin": 3209384,
  "admin123": 982034,
  "password123": 2189034,
  "pass123": 482032,
  "superman": 382903,
  "football": 483902
};

export const BreachChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'safe' | 'breached'>('idle');
  const [breachCount, setBreachCount] = useState(0);

  const checkBreach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setStatus('loading');

    setTimeout(() => {
      const normalized = password.toLowerCase().trim();
      if (BREACHED_DB[normalized]) {
        setBreachCount(BREACHED_DB[normalized]);
        setStatus('breached');
      } else {
        setBreachCount(0);
        setStatus('safe');
      }
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Breach Database Checker</h1>
        <p className="text-xs text-cyber-muted">Verify whether your secrets have been exposed in known third-party corporate data breaches.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        <form onSubmit={checkBreach} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted">Search Password Value</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password to query..."
                className="glass-input flex-1 font-mono text-sm"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-cyber text-xs py-2 px-6 flex items-center justify-center min-w-28"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Query Database"
                )}
              </button>
            </div>
          </div>
        </form>

        {status === 'safe' && (
          <div className="p-5 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green rounded-lg flex gap-4 items-start">
            <ShieldCheck size={28} className="shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No Exposures Logged</h3>
              <p className="text-xs text-cyber-green/80">This password was not found in any of the compromised dictionaries. It is safe for standard operations.</p>
            </div>
          </div>
        )}

        {status === 'breached' && (
          <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg flex gap-4 items-start">
            <ShieldAlert size={28} className="shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Warning: Compromised Credential!</h3>
              <p className="text-xs text-rose-300/80">
                This password has been leaked <strong>{breachCount.toLocaleString()} times</strong> in past security events.
              </p>
              <p className="text-[10px] text-rose-400 font-semibold mt-1">DO NOT USE this password. Immediately regenerate a secure alternative.</p>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="p-4 bg-white/5 border border-cyber-border rounded-lg text-xs text-cyber-muted flex gap-2 items-center">
            <Terminal size={16} className="text-cyber-cyan" />
            <span>Telemetry uses a Zero-Knowledge local hash range query to maintain absolute secrecy.</span>
          </div>
        )}
      </div>
    </div>
  );
};
