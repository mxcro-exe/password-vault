import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Landmark, Share2, Gamepad2, Server, Key, Code, ChevronRight } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  const templates = [
    { title: "Corporate Email", icon: Mail, desc: "Standard template for GSuite, Office 365, or webmail infrastructure credentials.", category: "Office" },
    { title: "Bank Account", icon: Landmark, desc: "Secure multi-factor financial logins, routing numbers, and PIN storage.", category: "Banking" },
    { title: "Social Platform", icon: Share2, desc: "Social media handles, 2FA recovery backup codes, and platform keys.", category: "Office" },
    { title: "Gaming Account", icon: Gamepad2, desc: "Steam, Epic, Discord, and gaming portal accounts.", category: "Gaming" },
    { title: "Server Credentials", icon: Server, desc: "SSH root keys, Linux sudo passwords, and IP host access tokens.", category: "Development" },
    { title: "API Keys & Tokens", icon: Key, desc: "Stripe, OpenAI, AWS IAM access secrets, and OAuth client credentials.", category: "Development" },
    { title: "Developer Environment", icon: Code, desc: "Database URLs, Git repository SSH tokens, and Docker registry credentials.", category: "Development" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Credential Templates</h1>
        <p className="text-xs text-cyber-muted">Pre-configured field templates for rapid vault entry creation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, idx) => (
          <div 
            key={idx}
            onClick={() => navigate('/vault')}
            className="glass-panel p-6 rounded-xl border border-cyber-border hover:border-cyber-cyan/40 transition-all cursor-pointer group space-y-4 shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 bg-cyber-cyan/10 rounded-lg text-cyber-cyan w-fit group-hover:scale-110 transition-transform">
                <tpl.icon size={22} />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-cyber-cyan transition-colors">{tpl.title}</h3>
              <p className="text-xs text-cyber-muted leading-relaxed">{tpl.desc}</p>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-semibold text-cyber-cyan pt-2">
              <span>Use Template</span> <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
