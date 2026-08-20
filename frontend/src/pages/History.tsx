import React, { useEffect, useState } from 'react';
import { History, Copy, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { decryptDataLocal } from '../utils/crypto';

interface HistoryItem {
  id: number;
  password?: string;
  encrypted_password?: string;
  generated_at: string;
}

export const PasswordHistoryPage: React.FC = () => {
  const { token, encryptionKey, isSimulated } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      if (isSimulated) {
        const stored = JSON.parse(localStorage.getItem('sim_histories') || '[]');
        setHistory(stored);
      } else {
        const res = await fetch("http://localhost:8000/history/", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear your generation logs?")) return;
    try {
      if (isSimulated) {
        localStorage.setItem('sim_histories', '[]');
      } else {
        await fetch("http://localhost:8000/history/clear", {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const decryptHistoryItem = async (id: number, encrypted: string) => {
    if (decryptedPasswords[id]) return;
    if (!encryptionKey) return;
    const dec = await decryptDataLocal(encrypted, encryptionKey);
    setDecryptedPasswords(prev => ({ ...prev, [id]: dec }));
  };

  const handleCopy = (id: number, passwordStr: string) => {
    navigator.clipboard.writeText(passwordStr);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    fetchHistory();
  }, [token, isSimulated]);

  useEffect(() => {
    if (!encryptionKey || isSimulated) return;
    history.forEach(async (item) => {
      if (item.encrypted_password) {
        decryptHistoryItem(item.id, item.encrypted_password);
      }
    });
  }, [history, encryptionKey]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Generation History</h1>
          <p className="text-xs text-cyber-muted font-semibold">Audits record of generated keys for security telemetry trace.</p>
        </div>
        <button
          onClick={handleClear}
          disabled={history.length === 0}
          className="glass-panel text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-cyber-border text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition"
        >
          <Trash2 size={14} /> Clear History
        </button>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-cyber-border/40 space-y-4 shadow-glow">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <span className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-cyber-muted border border-dashed border-cyber-border rounded-lg">
            <History size={32} className="text-cyber-border mb-2" />
            <p className="text-xs">No password generations logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cyber-border text-cyber-muted pb-2">
                  <th className="py-2">Generated Secret Password</th>
                  <th className="py-2">Timestamp</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border">
                {history.map((item) => {
                  const passValue = isSimulated ? item.password : decryptedPasswords[item.id];
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 font-mono text-white select-all">
                        {passValue || "••••••••••••••••"}
                      </td>
                      <td className="py-3 text-cyber-muted">
                        {new Date(item.generated_at).toLocaleString()}
                      </td>
                      <td className="py-3 text-right">
                        {passValue && (
                          <button
                            onClick={() => handleCopy(item.id, passValue)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyber-muted hover:text-white inline-flex transition"
                          >
                            {copiedId === item.id ? <Check size={14} className="text-cyber-green" /> : <Copy size={14} />}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
