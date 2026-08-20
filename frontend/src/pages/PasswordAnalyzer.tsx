import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Terminal } from 'lucide-react';
import { checkPasswordStrength } from '../components/PassStrengthMeter';

export const PasswordAnalyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzePassword = (pass: string) => {
    if (!pass) {
      setAnalysis(null);
      return;
    }

    const { score, label, color, feedback } = checkPasswordStrength(pass);
    
    let charsetSize = 0;
    if (/[a-z]/.test(pass)) charsetSize += 26;
    if (/[A-Z]/.test(pass)) charsetSize += 26;
    if (/[0-9]/.test(pass)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pass)) charsetSize += 33;

    const entropy = charsetSize > 0 ? Math.round(pass.length * Math.log2(charsetSize)) : 0;

    let crackingTime = "Instant";
    if (entropy > 0) {
      const totalGuesses = Math.pow(charsetSize, pass.length);
      const secondsToCrack = totalGuesses / 1e12;

      if (secondsToCrack < 1) {
        crackingTime = "Under 1 second";
      } else if (secondsToCrack < 60) {
        crackingTime = `${Math.round(secondsToCrack)} seconds`;
      } else if (secondsToCrack < 3600) {
        crackingTime = `${Math.round(secondsToCrack / 60)} minutes`;
      } else if (secondsToCrack < 86400) {
        crackingTime = `${Math.round(secondsToCrack / 3600)} hours`;
      } else if (secondsToCrack < 31536000) {
        crackingTime = `${Math.round(secondsToCrack / 86400)} days`;
      } else if (secondsToCrack < 31536000000) {
        crackingTime = `${Math.round(secondsToCrack / 31536000)} years`;
      } else {
        crackingTime = "Centuries / Millennia";
      }
    }

    const warnings: string[] = [];
    if (/^[A-Za-z]+$/.test(pass)) warnings.push("Alphabetic only: Add digits or symbols to double complexity.");
    if (/^[0-9]+$/.test(pass)) warnings.push("Numeric only: Extreme brute force risk. Add characters.");
    if (/(.)\1\1/.test(pass)) warnings.push("Repeated characters: Triple repeats detected (e.g. 'aaa').");
    
    const commonSequences = ["123", "abc", "qwe", "asd", "password", "admin", "letmein"];
    commonSequences.forEach(seq => {
      if (pass.toLowerCase().includes(seq)) {
        warnings.push(`Sequence/Dictionary term match: Contains '${seq}'`);
      }
    });

    setAnalysis({
      score,
      label,
      color,
      feedback,
      entropy,
      crackingTime,
      warnings
    });
  };

  useEffect(() => {
    analyzePassword(password);
  }, [password]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Advanced Password Telemetry & Analyzer</h1>
        <p className="text-xs text-cyber-muted">Audit password resilience matrices, estimate brute force cracking metrics, and identify vulnerabilities.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-cyber-muted">Input Secret Password to Analyze</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Type your password..."
            className="glass-input w-full font-mono text-sm sm:text-base"
          />
        </div>

        {analysis ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cyber-border">
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-lg bg-black/30 border border-cyber-border">
                <span className="text-[10px] text-cyber-muted uppercase tracking-wider block font-semibold">Brute-Force Estimate</span>
                <span className="text-lg font-bold text-white block mt-1">{analysis.crackingTime}</span>
                <span className="text-[9px] text-cyber-muted">Assumes GPU compute cluster executing 10^12 cryptanalytic hashes/sec.</span>
              </div>

              <div className="glass-panel p-4 rounded-lg bg-black/30 border border-cyber-border">
                <span className="text-[10px] text-cyber-muted uppercase tracking-wider block font-semibold">Information Entropy</span>
                <span className="text-lg font-bold text-cyber-cyan block mt-1">{analysis.entropy} Bits</span>
                <span className="text-[9px] text-cyber-muted">Bits of entropy measure mathematical unpredictability of this value.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-lg bg-black/30 border border-cyber-border space-y-2">
                <span className="text-[10px] text-cyber-muted uppercase tracking-wider block font-semibold">Audited Resilience</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${analysis.color}`} />
                  <span className="font-bold text-white">{analysis.label}</span>
                </div>
              </div>

              {analysis.warnings.length > 0 && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg space-y-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-rose-300">
                    <ShieldAlert size={14} /> Pattern Vulnerabilities Detected
                  </div>
                  <ul className="text-[10px] text-rose-300/80 list-disc list-inside space-y-0.5">
                    {analysis.warnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.warnings.length === 0 && password.length >= 14 && (
                <div className="p-4 bg-cyber-green/10 border border-cyber-green/20 text-cyber-green rounded-lg flex items-center gap-2 text-xs">
                  <ShieldCheck size={16} />
                  <span>Passes pattern audits. No repetition, sequences, or word-list matches.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center text-cyber-muted border border-dashed border-cyber-border rounded-lg">
            <Terminal size={32} className="text-cyber-border animate-pulse mb-2" />
            <p className="text-xs">Provide a password value above to trigger telemetric cryptanalysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};
