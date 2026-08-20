import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Master Password
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials. Please verify your master key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-md p-8 rounded-2xl border border-cyber-border/40 shadow-glow relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-3xl" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-cyber-cyan/10 rounded-xl text-cyber-cyan mb-3">
            <Shield size={32} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Secure Vault</h2>
          <p className="text-xs text-cyber-muted mt-1">Provide your master credentials to unlock records.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted">Corporate Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="glass-input w-full pl-10 text-sm"
              />
            </div>
          </div>

          {/* Master Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-cyber-muted">Master Password</label>
              <Link to="/" className="text-[10px] text-cyber-cyan hover:underline">Forgot Master Key?</Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-muted">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="glass-input w-full pl-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-cyber-muted hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cyber py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Decrypt & Unlock"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-cyber-muted">
          First time here?{" "}
          <Link to="/signup" className="text-cyber-cyan font-semibold hover:underline">Create Master Account</Link>
        </div>
      </motion.div>
    </div>
  );
};
