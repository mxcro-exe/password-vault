import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PolicyBuilder: React.FC = () => {
  const { token, isSimulated } = useAuth();

  const [policyName, setPolicyName] = useState("Corporate ISO-27001 Baseline");
  const [minLength, setMinLength] = useState(16);
  const [requireUpper, setRequireUpper] = useState(true);
  const [requireLower, setRequireLower] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (isSimulated) {
        const saved = JSON.parse(localStorage.getItem('sim_policy') || 'null');
        if (saved) {
          setPolicyName(saved.policy_name);
          setMinLength(saved.min_length);
          setRequireUpper(saved.require_uppercase);
          setRequireLower(saved.require_lowercase);
          setRequireNumbers(saved.require_numbers);
          setRequireSymbols(saved.require_symbols);
          setExcludeSimilar(saved.exclude_similar);
        }
      } else {
        const res = await fetch("http://localhost:8000/policy/", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPolicyName(data.policy_name);
          setMinLength(data.min_length);
          setRequireUpper(data.require_uppercase);
          setRequireLower(data.require_lowercase);
          setRequireNumbers(data.require_numbers);
          setRequireSymbols(data.require_symbols);
          setExcludeSimilar(data.exclude_similar);
        }
      }
    };
    fetchPolicy();
  }, [token, isSimulated]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      policy_name: policyName,
      min_length: minLength,
      require_uppercase: requireUpper,
      require_lowercase: requireLower,
      require_numbers: requireNumbers,
      require_symbols: requireSymbols,
      exclude_similar: excludeSimilar
    };

    try {
      if (isSimulated) {
        localStorage.setItem('sim_policy', JSON.stringify(payload));
      } else {
        await fetch("http://localhost:8000/policy/", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Enterprise Password Policy Builder</h1>
        <p className="text-xs text-cyber-muted">Define compliance parameters and password complexity mandates for organizational users.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        {savedSuccess && (
          <div className="p-3 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Policy updated and enforced across all vault item validators.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted">Policy Document Name</label>
            <input
              type="text"
              required
              value={policyName}
              onChange={e => setPolicyName(e.target.value)}
              className="glass-input w-full text-xs font-semibold"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-cyber-muted">
              <span>Mandatory Minimum Length</span>
              <span className="text-cyber-cyan font-mono">{minLength} Characters</span>
            </div>
            <input
              type="range"
              min="10"
              max="32"
              value={minLength}
              onChange={e => setMinLength(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyber-border"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={requireUpper}
                onChange={e => setRequireUpper(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Require at least one uppercase letter (A-Z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={requireLower}
                onChange={e => setRequireLower(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Require at least one lowercase letter (a-z)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={requireNumbers}
                onChange={e => setRequireNumbers(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Require at least one numerical digit (0-9)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={requireSymbols}
                onChange={e => setRequireSymbols(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Require special symbols (!@#$%^&*)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={e => setExcludeSimilar(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Enforce exclusion of easily confused characters (l, 1, I, O, 0)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn-cyber py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Save size={16} /> Enforce Corporate Policy Rules
          </button>
        </form>
      </div>
    </div>
  );
};
