import React, { createContext, useContext, useState, useEffect } from 'react';
import { deriveMasterKeys, generateSalt } from '../utils/crypto';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  encryptionKey: string | null; // AES key kept only in memory
  isAuthenticated: boolean;
  isSimulated: boolean;
  loading: boolean;
  login: (email: string, masterPass: string) => Promise<void>;
  signup: (email: string, masterPass: string) => Promise<void>;
  logout: () => void;
  verifyMasterKey: (masterPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = "http://localhost:8000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('email'));
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if backend is available
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
          setIsSimulated(false);
          console.log("SecurePass Pro API: Online");
        } else {
          setIsSimulated(true);
          console.log("SecurePass Pro API: Offline. Using client simulation.");
        }
      } catch (err) {
        setIsSimulated(true);
        console.log("SecurePass Pro API: Offline. Using client simulation.");
      } finally {
        setLoading(false);
      }
    };
    checkBackend();
  }, []);

  const login = async (email: string, masterPass: string) => {
    setLoading(true);
    try {
      if (isSimulated) {
        // Simulated local database check
        const users = JSON.parse(localStorage.getItem('sim_users') || '{}');
        const userData = users[email];
        if (!userData) {
          throw new Error("User does not exist");
        }
        
        const { encryptionKeyHex, authVerifierHex } = await deriveMasterKeys(masterPass, userData.salt);
        if (userData.verifier !== authVerifierHex) {
          throw new Error("Invalid password");
        }

        setToken("simulated-jwt-token-key");
        setUserEmail(email);
        setEncryptionKey(encryptionKeyHex);
        localStorage.setItem('token', "simulated-jwt-token-key");
        localStorage.setItem('email', email);
        localStorage.setItem('sim_salt', userData.salt);
      } else {
        // 1. Fetch Salt
        const saltRes = await fetch(`${API_BASE}/auth/salt?email=${encodeURIComponent(email)}`);
        if (!saltRes.ok) throw new Error("Could not retrieve salt");
        const { salt } = await saltRes.json();

        // 2. Derive Key
        const { encryptionKeyHex, authVerifierHex } = await deriveMasterKeys(masterPass, salt);

        // 3. Login with derived authentication verifier
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: authVerifierHex })
        });

        if (!loginRes.ok) {
          throw new Error("Incorrect email or password");
        }

        const data = await loginRes.json();
        setToken(data.access_token);
        setUserEmail(email);
        setEncryptionKey(encryptionKeyHex);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('email', email);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, masterPass: string) => {
    setLoading(true);
    try {
      const salt = generateSalt();
      const { encryptionKeyHex, authVerifierHex } = await deriveMasterKeys(masterPass, salt);

      if (isSimulated) {
        const users = JSON.parse(localStorage.getItem('sim_users') || '{}');
        if (users[email]) {
          throw new Error("User already exists");
        }
        users[email] = {
          salt,
          verifier: authVerifierHex
        };
        localStorage.setItem('sim_users', JSON.stringify(users));
        
        // Auto-login
        setToken("simulated-jwt-token-key");
        setUserEmail(email);
        setEncryptionKey(encryptionKeyHex);
        localStorage.setItem('token', "simulated-jwt-token-key");
        localStorage.setItem('email', email);
        localStorage.setItem('sim_salt', salt);
      } else {
        const registerRes = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password: authVerifierHex, // bcrypt password hash
            master_password_salt: salt,
            master_password_verifier: authVerifierHex
          })
        });

        if (!registerRes.ok) {
          const err = await registerRes.json();
          throw new Error(err.detail || "Registration failed");
        }

        // Auto-login after registration
        await login(email, masterPass);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setEncryptionKey(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const verifyMasterKey = async (masterPass: string): Promise<boolean> => {
    if (!userEmail) return false;
    try {
      if (isSimulated) {
        const users = JSON.parse(localStorage.getItem('sim_users') || '{}');
        const userData = users[userEmail];
        if (!userData) return false;
        
        const { authVerifierHex } = await deriveMasterKeys(masterPass, userData.salt);
        return userData.verifier === authVerifierHex;
      } else {
        const saltRes = await fetch(`${API_BASE}/auth/salt?email=${encodeURIComponent(userEmail)}`);
        if (!saltRes.ok) return false;
        const { salt } = await saltRes.json();
        
        const { authVerifierHex } = await deriveMasterKeys(masterPass, salt);
        const res = await fetch(`${API_BASE}/auth/verify-verifier`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ verifier: authVerifierHex })
        });
        return res.ok;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      userEmail,
      encryptionKey,
      isAuthenticated: !!token,
      isSimulated,
      loading,
      login,
      signup,
      logout,
      verifyMasterKey
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
