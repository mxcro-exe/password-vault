import React, { useEffect, useState } from 'react';
import { Star, Eye, EyeOff, Copy, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { decryptDataLocal } from '../utils/crypto';

export const FavoritesPage: React.FC = () => {
  const { token, encryptionKey, isSimulated } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      if (isSimulated) {
        const stored = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
        const favs = stored.filter((i: any) => i.is_favorite);
        setFavorites(favs);
      } else {
        const res = await fetch("http://localhost:8000/vault/?is_favorite=true", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token, isSimulated]);

  const toggleDecryptPassword = async (id: number, encrypted: string) => {
    if (decryptedPasswords[id]) {
      const updated = { ...decryptedPasswords };
      delete updated[id];
      setDecryptedPasswords(updated);
    } else {
      if (!encryptionKey) return;
      const dec = await decryptDataLocal(encrypted, encryptionKey);
      setDecryptedPasswords(prev => ({ ...prev, [id]: dec }));
    }
  };

  const copyPassword = (id: number, encrypted: string) => {
    if (!encryptionKey) return;
    decryptDataLocal(encrypted, encryptionKey).then(dec => {
      navigator.clipboard.writeText(dec);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="text-amber-400" size={24} fill="currentColor" /> Bookmarked Favorites
        </h1>
        <p className="text-xs text-cyber-muted">Instant access to critical enterprise keys and high-frequency credentials.</p>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center text-cyber-muted border border-dashed border-cyber-border rounded-xl">
          <Star size={32} className="text-cyber-border mb-2" />
          <p className="text-xs">No favorites bookmarked yet. Click the star icon in your vault to pin items here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel p-5 rounded-xl border border-cyber-border space-y-4 hover:border-amber-400/30 transition-all shadow-md"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <Star size={16} className="text-amber-400" fill="currentColor" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                {item.url && (
                  <a 
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-cyber-cyan hover:underline flex items-center gap-1"
                  >
                    {item.url} <ExternalLink size={10} />
                  </a>
                )}
              </div>

              <div className="space-y-2 bg-black/20 p-3 rounded-lg border border-cyber-border/40">
                {item.username && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-cyber-muted font-mono">{item.username}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.username)}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs font-mono pt-1.5 border-t border-cyber-border/20">
                  <span className="text-white">
                    {decryptedPasswords[item.id] ? decryptedPasswords[item.id] : "••••••••••••"}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleDecryptPassword(item.id, item.encrypted_password)}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                    >
                      {decryptedPasswords[item.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button 
                      onClick={() => copyPassword(item.id, item.encrypted_password)}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                    >
                      {copiedId === item.id ? <Check size={12} className="text-cyber-green" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
