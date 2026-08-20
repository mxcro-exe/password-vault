import React from 'react';
import { HelpCircle, ShieldCheck, Key, Lock, Smartphone, RefreshCw } from 'lucide-react';

export const SecurityTipsPage: React.FC = () => {
  const tips = [
    {
      icon: Lock,
      title: "Use Unique Passwords Everywhere",
      desc: "Never reuse a password across multiple platforms. If one website suffers a breach, credential stuffing attacks will immediately compromise all connected accounts."
    },
    {
      icon: Smartphone,
      title: "Enable Hardware Multi-Factor Authentication (MFA)",
      desc: "Pair your master password vault with time-based OTPs (TOTP) or FIDO2/YubiKey hardware keys. SMS-based 2FA is vulnerable to SIM swapping."
    },
    {
      icon: Key,
      title: "Never Store Plaintext Secrets",
      desc: "Avoid keeping plain text files, sticky notes, or unencrypted spreadsheets containing passwords. Always rely on zero-knowledge WebCrypto vaults."
    },
    {
      icon: RefreshCw,
      title: "Rotate Exposed Keys Immediately",
      desc: "You don't need to rotate passwords on an arbitrary 30-day schedule unless compromise is suspected. Focus on creating longer, higher-entropy keys."
    },
    {
      icon: ShieldCheck,
      title: "Audit Password Strength Regularly",
      desc: "Use the built-in Telemetry Analyzer to check for repeated patterns, sequential strings, or dictionary terms in your existing vault items."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="text-cyber-cyan" size={24} /> Cybersecurity Best Practices & Tips
        </h1>
        <p className="text-xs text-cyber-muted">Guidelines for maintaining institutional threat defense and personal identity safety.</p>
      </div>

      <div className="space-y-4">
        {tips.map((tip, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-cyber-border space-y-2 hover:border-cyber-cyan/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyber-cyan/10 text-cyber-cyan rounded-lg">
                <tip.icon size={20} />
              </div>
              <h3 className="font-bold text-white text-base">{tip.title}</h3>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed pl-12">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
