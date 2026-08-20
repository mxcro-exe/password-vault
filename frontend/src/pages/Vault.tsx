import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Plus, Eye, EyeOff, Copy, Check, Trash2, 
  Edit2, Star, Download, Key, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { encryptDataLocal, decryptDataLocal } from '../utils/crypto';

interface VaultItem {
  id: number;
  title: string;
  url: string;
  email: string;
  username: string;
  encrypted_password: string;
  category: string;
  notes: string;
  is_favorite: boolean;
  tags: string;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  "All", "Google", "Microsoft", "Facebook", "Instagram", "GitHub", 
  "LinkedIn", "Amazon", "Netflix", "Banking", "Office", "Gaming", 
  "Development", "WiFi", "Others"
];

export const Vault: React.FC = () => {
  const { token, encryptionKey, isSimulated } = useAuth();
  
  const [items, setItems] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [showDrawer, setShowDrawer] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Others');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<number, string>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchVault = async () => {
    setLoading(true);
    try {
      if (isSimulated) {
        const stored = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
        setItems(stored);
      } else {
        const res = await fetch("http://localhost:8000/vault/", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, [token, isSimulated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptionKey) {
      alert("Master decryption key missing! Log in again.");
      return;
    }

    try {
      const encryptedPassword = await encryptDataLocal(password, encryptionKey);
      
      const payload = {
        title,
        url,
        email,
        username,
        encrypted_password: encryptedPassword,
        category,
        notes,
        is_favorite: isFavorite,
        tags
      };

      if (isSimulated) {
        let stored = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
        if (editId) {
          stored = stored.map((item: any) => 
            item.id === editId 
              ? { ...item, ...payload, updated_at: new Date().toISOString() }
              : item
          );
        } else {
          stored.push({
            id: Date.now(),
            ...payload,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        localStorage.setItem('sim_vault_items', JSON.stringify(stored));
      } else {
        const urlEndpoint = editId ? `http://localhost:8000/vault/${editId}` : "http://localhost:8000/vault/";
        const method = editId ? 'PUT' : 'POST';
        
        const res = await fetch(urlEndpoint, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Could not save item");
      }

      resetForm();
      fetchVault();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: VaultItem) => {
    setEditId(item.id);
    setTitle(item.title);
    setUrl(item.url || '');
    setEmail(item.email || '');
    setUsername(item.username || '');
    setCategory(item.category);
    setNotes(item.notes || '');
    setTags(item.tags || '');
    setIsFavorite(item.is_favorite);
    
    if (encryptionKey) {
      decryptDataLocal(item.encrypted_password, encryptionKey).then(dec => setPassword(dec));
    }
    
    setShowDrawer(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this secret?")) return;
    try {
      if (isSimulated) {
        const stored = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
        const filtered = stored.filter((item: any) => item.id !== id);
        localStorage.setItem('sim_vault_items', JSON.stringify(filtered));
      } else {
        await fetch(`http://localhost:8000/vault/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      fetchVault();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (item: VaultItem) => {
    try {
      const payload = { is_favorite: !item.is_favorite };
      if (isSimulated) {
        const stored = JSON.parse(localStorage.getItem('sim_vault_items') || '[]');
        const updated = stored.map((i: any) => i.id === item.id ? { ...i, ...payload } : i);
        localStorage.setItem('sim_vault_items', JSON.stringify(updated));
      } else {
        await fetch(`http://localhost:8000/vault/${item.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }
      fetchVault();
    } catch (err) {
      console.error(err);
    }
  };

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

  const generateRandomPasswordInForm = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let generated = '';
    const randomBytes = new Uint32Array(16);
    window.crypto.getRandomValues(randomBytes);
    for (let i = 0; i < 16; i++) {
      generated += charset[randomBytes[i] % charset.length];
    }
    setPassword(generated);
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setUrl('');
    setEmail('');
    setUsername('');
    setPassword('');
    setCategory('Others');
    setNotes('');
    setTags('');
    setIsFavorite(false);
    setShowDrawer(false);
  };

  const handleExport = async (format: 'JSON' | 'CSV' | 'TXT') => {
    if (!encryptionKey) return;
    
    const decryptedItems = await Promise.all(items.map(async (item) => {
      const decPass = await decryptDataLocal(item.encrypted_password, encryptionKey);
      return {
        title: item.title,
        url: item.url,
        email: item.email,
        username: item.username,
        password: decPass,
        category: item.category,
        notes: item.notes,
        tags: item.tags
      };
    }));

    let dataStr = '';
    let mimeType = 'application/json';
    let filename = `securepass_export_${Date.now()}`;

    if (format === 'JSON') {
      dataStr = JSON.stringify(decryptedItems, null, 2);
      filename += '.json';
    } else if (format === 'CSV') {
      const headers = ["Title", "URL", "Email", "Username", "Password", "Category", "Notes", "Tags"];
      const rows = decryptedItems.map(i => [
        `"${i.title}"`, `"${i.url}"`, `"${i.email}"`, `"${i.username}"`, 
        `"${i.password}"`, `"${i.category}"`, `"${i.notes}"`, `"${i.tags}"`
      ]);
      dataStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv';
      filename += '.csv';
    } else {
      dataStr = decryptedItems.map(i => 
        `Title: ${i.title}\nURL: ${i.url}\nUser: ${i.username}\nPass: ${i.password}\n---\n`
      ).join('\n');
      mimeType = 'text/plain';
      filename += '.txt';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.username && item.username.toLowerCase().includes(search.toLowerCase())) ||
      (item.url && item.url.toLowerCase().includes(search.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesFavorite = !filterFavorites || item.is_favorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Password Vault</h1>
          <p className="text-xs text-cyber-muted">End-to-end client-side encrypted credentials manager.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => handleExport('CSV')} 
            className="glass-panel text-cyber-muted hover:text-white border border-cyber-border text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => handleExport('JSON')} 
            className="glass-panel text-cyber-muted hover:text-white border border-cyber-border text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition"
          >
            <Download size={14} /> Export JSON
          </button>
          <button
            onClick={() => { resetForm(); setShowDrawer(true); }}
            className="btn-cyber text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Plus size={16} /> Add Secret
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
                : 'glass-panel text-cyber-muted border border-cyber-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-muted">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search credentials..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="glass-input w-full pl-9 py-2 text-xs"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-cyber-muted cursor-pointer select-none shrink-0">
          <input
            type="checkbox"
            checked={filterFavorites}
            onChange={e => setFilterFavorites(e.target.checked)}
            className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
          />
          <span>Show Favorites Only</span>
        </label>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-cyber-border rounded-xl">
          <Database size={40} className="text-cyber-border mb-2" />
          <p className="text-xs text-cyber-muted">No vault secrets match your query parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="glass-panel p-5 rounded-xl border border-cyber-border flex flex-col justify-between space-y-4 hover:border-cyber-cyan/30 transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-cyber-border text-cyber-cyan font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => toggleFavorite(item)} 
                    className={`p-1 rounded hover:bg-white/5 ${item.is_favorite ? 'text-amber-400' : 'text-cyber-muted hover:text-white'}`}
                  >
                    <Star size={14} fill={item.is_favorite ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-1 rounded hover:bg-rose-500/10 text-cyber-muted hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                {item.url && (
                  <a 
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-cyber-cyan hover:underline flex items-center gap-1 leading-tight"
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
                      onClick={() => { navigator.clipboard.writeText(item.username); }}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                      title="Copy Username"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs font-mono pt-1.5 border-t border-cyber-border/20">
                  <span className="text-white select-all">
                    {decryptedPasswords[item.id] ? decryptedPasswords[item.id] : "••••••••••••"}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleDecryptPassword(item.id, item.encrypted_password)}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                      title="Reveal Password"
                    >
                      {decryptedPasswords[item.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                    <button 
                      onClick={() => copyPassword(item.id, item.encrypted_password)}
                      className="p-1 rounded hover:bg-white/5 text-cyber-muted hover:text-white"
                      title="Copy Password"
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

      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg glass-panel h-screen border-l border-cyber-border p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-cyber-border pb-4">
                <h2 className="text-lg font-bold text-white">
                  {editId ? "Modify Credential" : "Add Secret Key"}
                </h2>
                <button onClick={resetForm} className="text-cyber-muted hover:text-white text-xs font-semibold">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-cyber-muted font-semibold">Title/Platform Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-cyber-muted font-semibold">Target Domain URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="e.g. console.aws.amazon.com"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-cyber-muted font-semibold">Associated Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. admin@company.com"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-cyber-muted font-semibold">Account Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. aws-root-admin"
                    className="glass-input w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-cyber-muted font-semibold">Decrypted Password</label>
                    <button 
                      type="button" 
                      onClick={generateRandomPasswordInForm}
                      className="text-cyber-cyan hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Key size={12} /> Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Type or generate secure credential..."
                    className="glass-input w-full font-mono text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-cyber-muted font-semibold">Classification Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="glass-input w-full text-xs"
                    >
                      {CATEGORIES.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-cyber-muted font-semibold">Tags (Comma Sep)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      placeholder="e.g. prod, cloud"
                      className="glass-input w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-cyber-muted font-semibold">Secret Secure Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Provide additional details or backup key info..."
                    rows={3}
                    className="glass-input w-full"
                  />
                </div>

                <label className="flex items-center gap-2 text-cyber-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={e => setIsFavorite(e.target.checked)}
                    className="w-4 h-4 rounded border-cyber-border bg-black/40 text-cyber-cyan focus:ring-cyber-cyan"
                  />
                  <span>Mark as favorite for quick access</span>
                </label>

                <button
                  type="submit"
                  className="w-full btn-cyber py-2.5 font-bold text-sm"
                >
                  {editId ? "Save Changes" : "Commit Vault Entry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
