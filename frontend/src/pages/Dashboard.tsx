import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, Database, Star, Clock, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Stats {
  total_saved: number;
  favorites_count: number;
  history_count: number;
  security_score: number;
  recent_activity: any[];
}

export const Dashboard: React.FC = () => {
  const { token, encryptionKey, isSimulated } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total_saved: 0,
    favorites_count: 0,
    history_count: 0,
    security_score: 85,
    recent_activity: []
  });
  const [recentVaultItems, setRecentVaultItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isSimulated) {
          const vaultItems = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
          const histories = JSON.parse(localStorage.getItem('sim_histories') || '[]');
          
          const total = vaultItems.length;
          const favorites = vaultItems.filter((i: any) => i.is_favorite).length;
          const histCount = histories.length;
          
          const recentAct = [
            { id: 1, action: "VAULT_AUDIT", timestamp: new Date().toISOString() },
            { id: 2, action: "DASHBOARD_LOAD", timestamp: new Date().toISOString() }
          ];

          setStats({
            total_saved: total,
            favorites_count: favorites,
            history_count: histCount,
            security_score: total === 0 ? 100 : Math.max(45, 100 - (0 * 15)),
            recent_activity: recentAct
          });
          
          const sorted = [...vaultItems]
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 3);
          
          const decryptedSorted = sorted.map((item) => {
            return { ...item, decTitle: item.title };
          });

          setRecentVaultItems(decryptedSorted);
        } else {
          const statsRes = await fetch("http://localhost:8000/dashboard/stats", {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(data);
          }

          const vaultRes = await fetch("http://localhost:8000/vault/?limit=3", {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (vaultRes.ok) {
            const items = await vaultRes.json();
            setRecentVaultItems(items.slice(0, 3));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, encryptionKey, isSimulated]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.security_score / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Command Center</h1>
          <p className="text-xs text-cyber-muted">Dashboard telemetry audit logs and credential statistics.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/vault" className="btn-cyber text-xs py-2 px-4 flex items-center gap-2">
            <Database size={14} /> Open Vault
          </Link>
          <Link to="/generator" className="glass-panel hover:bg-white/5 border border-cyber-border text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition duration-200">
            <Key size={14} /> Quick Generate
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl flex items-center justify-between border-l-4 border-l-cyber-cyan shadow-glow">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider block">Security Score</span>
                <span className="text-3xl font-extrabold text-white">{stats.security_score}%</span>
                <span className="text-[10px] text-cyber-green flex items-center gap-1">
                  <CheckCircle2 size={12} /> Compliant
                </span>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-white/10 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-cyber-cyan fill-none transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute font-bold text-sm text-white">
                  {stats.security_score}%
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl flex items-center justify-between border-l-4 border-l-cyber-blue shadow-glow">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider block">Saved Passwords</span>
                <span className="text-3xl font-extrabold text-white">{stats.total_saved}</span>
                <p className="text-[10px] text-cyber-muted mt-2">Passwords securely stored in zero-knowledge database.</p>
              </div>
              <div className="p-4 bg-cyber-blue/10 rounded-xl text-cyber-blue">
                <Database size={24} />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl flex items-center justify-between border-l-4 border-l-cyber-purple shadow-glow">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider block">Bookmarked Favorites</span>
                <span className="text-3xl font-extrabold text-white">{stats.favorites_count}</span>
                <p className="text-[10px] text-cyber-muted mt-2">Bookmarked for immediate, rapid credentials access.</p>
              </div>
              <div className="p-4 bg-cyber-purple/10 rounded-xl text-cyber-purple">
                <Star size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-white">Recently Modified Passwords</h3>
                <Link to="/vault" className="text-xs text-cyber-cyan hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-cyber-border text-cyber-muted pb-2">
                      <th className="py-2">Platform</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Modified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-border">
                    {recentVaultItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-cyber-muted">
                          No credentials saved yet. Get started by saving one!
                        </td>
                      </tr>
                    ) : (
                      recentVaultItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-all">
                          <td className="py-3 font-semibold text-white">{item.title}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] border border-cyber-border font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 text-cyber-muted">
                            {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-4">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Clock className="text-cyber-cyan" size={18} /> System Audit Trail
              </h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {stats.recent_activity.length === 0 ? (
                  <p className="text-xs text-cyber-muted text-center py-6">No recent actions logged.</p>
                ) : (
                  stats.recent_activity.map((act) => (
                    <div key={act.id} className="flex justify-between items-start text-[11px] p-2 rounded bg-white/5 border border-cyber-border">
                      <div>
                        <span className="font-semibold text-white block">{act.action}</span>
                        <span className="text-cyber-muted text-[10px]">{act.ip_address || "Client Browser"}</span>
                      </div>
                      <span className="text-[10px] text-cyber-muted">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {stats.security_score < 75 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-center gap-3">
              <ShieldAlert size={24} className="text-rose-500 animate-bounce shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Weak Infrastructure Password Vulnerability</h4>
                <p className="text-xs text-rose-300/80">Some of your passwords do not comply with the corporate policy rule constraints. Click here to audit details.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
