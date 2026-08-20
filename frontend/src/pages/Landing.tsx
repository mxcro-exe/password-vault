import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Lock, Server, Terminal, ChevronRight, Award, Zap, HelpCircle } from 'lucide-react';

export const Landing: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const features = [
    { icon: Lock, title: "Zero-Knowledge Encryption", desc: "Your master password is never stored or transmitted. All data is encrypted locally using AES-256-GCM before leaving your device." },
    { icon: Key, title: "Custom Policy compliance", desc: "Build enterprise password policies. Enforce rules for employee complexity, characters, length, and history caps." },
    { icon: Shield, title: "Dark Web Audits", desc: "Verify credentials in real-time against compromise databases without revealing plaintext credentials." },
    { icon: Terminal, title: "Developer API Templates", desc: "Quick-start templates for SSH keys, database credentials, developer access tokens, and cloud configurations." },
    { icon: Zap, title: "Automated Clipboard Clear", desc: "Mitigate shoulder-surfing threats with automated memory purge and clipboard clear timing configurations." },
    { icon: Server, title: "Encrypted Backups", desc: "Export records securely to encrypted JSON file formats or readable enterprise CSV formats." }
  ];

  const stats = [
    { value: "99.99%", label: "Platform Uptime" },
    { value: "256-Bit", label: "AES Military Grade" },
    { value: "Zero", label: "Plaintext Passwords Stored" },
    { value: "100K+", label: "PBKDF2 Key Iterations" }
  ];

  const faqs = [
    { q: "What is Zero-Knowledge encryption?", a: "Zero-Knowledge means only you hold the keys to unlock your passwords. The master password never travels to our servers; it is hashed and derived locally in your browser. If a hacker breaches our servers, they get useless ciphertext." },
    { q: "How does the simulated offline mode work?", a: "If our FastAPI service is offline or not installed, SecurePass Pro switches to secure browser localStorage sandbox. This allows recruiters to preview the app without complex databases." },
    { q: "Is the database secure?", a: "Yes. All vault items stored in SQLite are double-encrypted on the client side, then structured under authenticated user tokens on the backend." }
  ];

  return (
    <div className="min-h-screen text-cyber-text relative bg-transparent overflow-y-auto">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-cyber-border">
        <div className="flex items-center gap-2 font-extrabold text-xl text-white">
          <Shield className="text-cyber-cyan h-6 w-6 animate-pulse" />
          <span>SecurePass <span className="text-cyber-cyan">Pro</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-cyber-muted hover:text-white transition">Sign In</Link>
          <Link to="/signup" className="btn-cyber text-sm py-1.5 px-4">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-cyber-cyan border-cyber-cyan/30 text-xs font-semibold mb-6 shadow-glow"
        >
          <Award size={14} /> Enterprise Password Security Suite
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Next Generation Zero-Knowledge <br />
          <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
            Enterprise Password Vault
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-cyber-muted max-w-2xl mx-auto mt-6 text-base sm:text-lg"
        >
          SecurePass Pro guards your corporate keys with premium browser-side WebCrypto encryption. Real-time auditing, compliance testing, and custom security rules for IT teams.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Link to="/signup" className="btn-cyber flex items-center gap-2">
            Get Started <ChevronRight size={16} />
          </Link>
          <Link to="/login" className="glass-panel hover:bg-white/5 border border-cyber-border text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300">
            Enterprise Login
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-panel p-6 rounded-xl text-center shadow-glow">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-cyber-cyan">{stat.value}</h3>
              <p className="text-xs text-cyber-muted mt-2 font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Full-Spectrum Password Defense</h2>
          <p className="text-cyber-muted mt-2">Enterprise-grade capabilities engineered for compliance and security.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: 'rgba(6,182,212,0.4)' }}
              className="glass-panel p-6 rounded-xl border border-cyber-border transition-all duration-300 flex flex-col items-start"
            >
              <div className="p-3 rounded-lg bg-cyber-cyan/10 text-cyber-cyan mb-4">
                <feat.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white">{feat.title}</h3>
              <p className="text-sm text-cyber-muted mt-2 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
            <HelpCircle className="text-cyber-cyan" /> Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-lg overflow-hidden border border-cyber-border">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-5 font-semibold text-white flex justify-between items-center hover:bg-white/5 transition"
              >
                <span>{faq.q}</span>
                <ChevronRight size={18} className={`transform transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-sm text-cyber-muted leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-border bg-black/40 py-10 text-center text-xs text-cyber-muted relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-extrabold text-sm text-white">
            <Shield className="text-cyber-cyan h-4 w-4" />
            <span>SecurePass Pro</span>
          </div>
          <p>© 2026 SecurePass Pro Inc. All Rights Reserved. Derived with WebCrypto API.</p>
        </div>
      </footer>
    </div>
  );
};
