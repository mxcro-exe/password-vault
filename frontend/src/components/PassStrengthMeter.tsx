import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface PassStrengthMeterProps {
  password?: string;
  onStrengthChange?: (score: number) => void;
}

export const checkPasswordStrength = (pass: string): {
  score: number; // 0 to 4
  label: string;
  color: string;
  bgColor: string;
  feedback: string[];
} => {
  if (!pass) {
    return { score: 0, label: "Empty", color: "bg-slate-700", bgColor: "text-slate-700", feedback: [] };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length checks
  if (pass.length >= 8) {
    score += 1;
  } else {
    feedback.push("Make it at least 8 characters long.");
  }

  if (pass.length >= 14) {
    score += 1;
  }

  // Complexity checks
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[^A-Za-z0-9]/.test(pass);

  const characterClasses = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

  if (characterClasses >= 3) {
    score += 1;
  } else {
    feedback.push("Mix uppercase, lowercase, numbers, and symbols.");
  }

  if (characterClasses === 4 && pass.length >= 12) {
    score += 1;
  }

  // Final evaluations
  if (score === 0) {
    return { score: 0, label: "Very Weak", color: "bg-rose-500", bgColor: "text-rose-500", feedback: [...feedback, "Highly vulnerable to brute force."] };
  } else if (score === 1) {
    return { score: 1, label: "Weak", color: "bg-orange-500", bgColor: "text-orange-500", feedback: [...feedback, "Brute-force crackable in minutes."] };
  } else if (score === 2) {
    return { score: 2, label: "Medium", color: "bg-yellow-500", bgColor: "text-yellow-500", feedback: [...feedback, "Decent security. Add length for better safety."] };
  } else if (score === 3) {
    return { score: 3, label: "Strong", color: "bg-emerald-500", bgColor: "text-emerald-500", feedback };
  } else {
    return { score: 4, label: "Enterprise Grade", color: "bg-cyber-cyan", bgColor: "text-cyber-cyan", feedback: ["Meets compliance recommendations (NIST/ISO)."] };
  }
};

export const PassStrengthMeter: React.FC<PassStrengthMeterProps> = ({ password = "", onStrengthChange }) => {
  const { score, label, color, feedback } = checkPasswordStrength(password);

  React.useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(score);
    }
  }, [score, onStrengthChange]);

  const strengthBars = Array.from({ length: 4 }).map((_, i) => {
    let filled = i < score;
    return (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
          filled ? color : 'bg-white/10'
        }`}
      />
    );
  });

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-cyber-muted">Password Strength:</span>
        <span className={`flex items-center gap-1 font-mono transition-colors`}>
          {score < 2 ? (
            <ShieldAlert size={12} className="text-rose-500" />
          ) : score < 4 ? (
            <Shield size={12} className="text-yellow-500" />
          ) : (
            <ShieldCheck size={12} className="text-cyber-cyan animate-pulse" />
          )}
          {label}
        </span>
      </div>

      {/* Strength bars */}
      <div className="flex gap-1">
        {strengthBars}
      </div>

      {/* Feedback list */}
      {feedback.length > 0 && password.length > 0 && (
        <ul className="text-[10px] text-cyber-muted space-y-0.5 list-disc list-inside">
          {feedback.slice(0, 2).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
