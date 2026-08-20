import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { encryptDataLocal } from '../utils/crypto';

export const PasswordGenerator: React.FC = () => {
  const { token, encryptionKey, isSimulated } = useAuth();
  
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [customChars, setCustomChars] = useState('');
  
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState('Medium');
  const [strengthColor, setStrengthColor] = useState('text-yellow-500');

  const generatePassword = () => {
    let charset = '';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) charset += uppers;
    if (useLower) charset += lowers;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;
    if (customChars) charset += customChars;

    if (excludeSimilar) {
      const similar = /[l1Io0O|]/g;
      charset = charset.replace(similar, '');
    }

    if (!charset) {
      setPassword('Select at least one character set');
      return;
    }

    let generated = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      generated += charset[randomValues[i] % charset.length];
    }

    setPassword(generated);
    setCopied(false);
    evaluateStrength(generated);
    saveToHistory(generated);
  };

  const evaluateStrength = (pass: string) => {
    if (pass.length < 8) {
      setStrengthLabel('Very Weak');
      setStrengthColor('text-rose-500');
    } else if (pass.length < 12) {
      setStrengthLabel('Weak');
      setStrengthColor('text-orange-500');
    } else if (pass.length < 16) {
      setStrengthLabel('Strong');
      setStrengthColor('text-emerald-500');
    } else {
      setStrengthLabel('Enterprise Grade');
      setStrengthColor('text-cyber-cyan');
    }
  };

  const saveToHistory = async (pass: string) => {
    try {
      if (isSimulated) {
        const histories = JSON.parse(localStorage.getItem('sim_histories') || '[]');
        histories.unshift({
          id: Date.now(),
          password: pass,
          generated_at: new Date().toISOString()
        });
        if (histories.length > 50) histories.pop();
        localStorage.setItem('sim_histories', JSON.stringify(histories));
      } else {
        if (!encryptionKey) return;
        const encrypted = await encryptDataLocal(pass, encryptionKey);
        await fetch("http://localhost:8000/history/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ encrypted_password: encrypted })
        });
      }
    } catch (e) {
      console.error("Failed to log history:", e);
    }
  };

  const copyToClipboard = () => {
    if (!password || password.startsWith('Select')) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar, customChars]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quantum Password Generator</h1>
        <p className="text-xs text-cyber-muted">Generate cryptographically secure random keys derived from browser entropy.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        <div className="relative glass-panel bg-black/40 border border-cyber-border rounded-lg p-4 flex items-center justify-between font-mono text-sm sm:text-base text-white select-all break-all pr-12 min-h-14">
          <span>{password}</span>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white transition"
              title="Copy to clipboard"
            >
              {copied ? <Check className="text-cyber-green" size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={generatePassword}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white transition"
              title="Regenerate"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-semibold px-1">
          <span className="text-cyber-muted">Telemetry Strength:</span>
          <span className={`font-mono ${strengthColor} flex items-center gap-1`}>
            {strengthLabel === 'Enterprise Grade' ? (
              <ShieldCheck size={14} className="animate-pulse" />
            ) : (
              <AlertTriangle size={14} />
            )}
            {strengthLabel}
          </span>
        </div>

        <div className="space-y-4 pt-4 border-t border-cyber-border">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-cyber-muted">
              <span>Entropy Bit Length</span>
              <span className="text-white font-mono">{length} Chars</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyber-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={e => setUseUpper(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={useLower}
                onChange={e => setUseLower(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={e => setUseNumbers(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Numeric Digits (0-9)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={e => setUseSymbols(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Special Symbols (!@#$...)</span>
            </label>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={e => setExcludeSimilar(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Exclude Similar Characters (l, 1, I, o, 0, O)</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted">Custom Characters (Optional)</label>
            <input
              type="text"
              value={customChars}
              onChange={e => setCustomChars(e.target.value)}
              placeholder="e.g. _-[].+*"
              className="glass-input w-full text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
