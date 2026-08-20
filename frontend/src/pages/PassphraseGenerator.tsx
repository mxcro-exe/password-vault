import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const WORD_LIST = [
  "antigravity", "quantum", "cyber", "secure", "pass", "vault", "encrypt", "decrypt", "matrix",
  "shield", "terminal", "nexus", "pulse", "beacon", "grid", "plasma", "laser", "nebula",
  "galaxy", "vector", "orbital", "proton", "neuron", "silicon", "matrix", "binary", "cipher",
  "syntax", "compile", "kernel", "daemon", "server", "router", "switch", "client", "packet",
  "protocol", "token", "session", "cookie", "storage", "cloud", "backup", "restore", "format",
  "stable", "active", "dynamic", "static", "logic", "source", "output", "input", "system",
  "vortex", "cascade", "phantom", "echo", "shadow", "ghost", "spirit", "mirage", "prism",
  "aurora", "comet", "meteor", "asteroid", "planet", "stellar", "cosmic", "infinity", "vector",
  "horizon", "vertex", "pixel", "render", "vector", "graphics", "texture", "shader", "buffer",
  "engine", "driver", "sensor", "robotic", "device", "mobile", "network", "signal", "channel"
];

export const PassphraseGenerator: React.FC = () => {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);

  const [passphrase, setPassphrase] = useState('');
  const [copied, setCopied] = useState(false);
  const [entropyBits, setEntropyBits] = useState(0);

  const generatePassphrase = () => {
    let chosenWords: string[] = [];
    const randomArray = new Uint32Array(wordCount);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < wordCount; i++) {
      let word = WORD_LIST[randomArray[i] % WORD_LIST.length];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      chosenWords.push(word);
    }

    if (includeNumber) {
      const numRandom = new Uint32Array(1);
      window.crypto.getRandomValues(numRandom);
      const number = numRandom[0] % 100;
      chosenWords.push(number.toString());
    }

    const result = chosenWords.join(separator);
    setPassphrase(result);
    setCopied(false);

    const entropyPerWord = Math.log2(WORD_LIST.length);
    let totalEntropy = entropyPerWord * wordCount;
    if (includeNumber) {
      totalEntropy += Math.log2(100);
    }
    setEntropyBits(Math.round(totalEntropy));
  };

  const copyToClipboard = () => {
    if (!passphrase) return;
    navigator.clipboard.writeText(passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassphrase();
  }, [wordCount, separator, capitalize, includeNumber]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Memorable Passphrase Generator</h1>
        <p className="text-xs text-cyber-muted">Generate mnemonic passphrases that are mathematically hard to crack but simple to memorize.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-6 shadow-glow">
        <div className="relative glass-panel bg-black/40 border border-cyber-border rounded-lg p-4 flex items-center justify-between font-mono text-sm sm:text-base text-white select-all break-all pr-12 min-h-14">
          <span>{passphrase}</span>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white transition"
              title="Copy to clipboard"
            >
              {copied ? <Check className="text-cyber-green" size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={generatePassphrase}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white transition"
              title="Regenerate"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-semibold px-1">
          <span className="text-cyber-muted">Cryptographic Entropy:</span>
          <span className="font-mono text-cyber-cyan">{entropyBits} Bits (Strong)</span>
        </div>

        <div className="space-y-4 pt-4 border-t border-cyber-border">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-cyber-muted">
              <span>Mnemonic Word Count</span>
              <span className="text-white font-mono">{wordCount} Words</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={wordCount}
              onChange={e => setWordCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-cyber-cyan border border-cyber-border"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted">Separator Character</label>
            <select
              value={separator}
              onChange={e => setSeparator(e.target.value)}
              className="glass-input w-full text-xs"
            >
              <option value="-">Hyphen (-)</option>
              <option value=".">Dot (.)</option>
              <option value="_">Underscore (_)</option>
              <option value=" ">Space ( )</option>
              <option value="">None</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={capitalize}
                onChange={e => setCapitalize(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Capitalize Words (Title Case)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer text-xs text-cyber-muted select-none">
              <input
                type="checkbox"
                checked={includeNumber}
                onChange={e => setIncludeNumber(e.target.checked)}
                className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
              />
              <span>Append Secure Random Number (0-99)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
