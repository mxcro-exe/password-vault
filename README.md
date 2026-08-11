# SecurePass Pro 🔐

An advanced, premium-designed, client-side end-to-end encrypted password manager and security audit tool built with **React (TypeScript), Tailwind CSS, and FastAPI (Python)**.

---

## ✨ Features

- **🔒 End-to-End Client-Side Encryption**: Your master password never leaves your browser. Credentials are encrypted locally using AES-GCM before being sent to the server.
- **🛡️ Secure Key Derivation**: Master keys and authentication verifiers are derived using PBKDF2-HMAC-SHA256.
- **📊 Interactive Dashboard**: Full statistics of your passwords, classified by strength and category.
- **📁 Encrypted Vault**: Organize, search, edit, filter, and mark credentials as favorites. Export your vault securely to **JSON** or **CSV**.
- **🔑 Password & Passphrase Generator**: Generate cryptographically secure passwords or memorable multi-word passphrases with custom rules.
- **🧬 Password Strength Analyzer**: Real-time password strength assessment with feedback based on NIST/ISO security recommendations.
- **🚨 Breach Checker**: Verify if your passwords have been exposed in known third-party corporate data breaches.
- **📜 Policy Builder**: Easily build custom corporate password policies.
- **🎨 Ultra-Premium Cyberpunk UI**: Features smooth glassmorphic panels, glowing cyber accents, and an interactive Matrix-style digital rain background.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

### Backend
- **FastAPI** (Python Web Framework)
- **SQLAlchemy** (Database ORM)
- **SQLite** (Relational Database)
- **PyJWT** (Secure Token Authentication)

---

## 📂 Project Structure

```text
password generator/
├── backend/               # FastAPI Backend
│   ├── app/
│   │   ├── core/          # Security & JWT logic
│   │   ├── database/      # SQLite DB engine & models
│   │   ├── routers/       # API route handlers (Auth, Vault, History)
│   │   └── schemas/       # Request/Response validation schemas
│   ├── requirements.txt   # Python dependencies
│   └── start_backend.bat  # Starts FastAPI Server
│
├── frontend/              # Vite + React Frontend
│   ├── src/               # React TSX components & pages
│   ├── public/            # Static assets
│   ├── start_frontend.bat # Starts React frontend using local Node.js
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.ts     # Vite configuration
│
├── node-portable/         # Portable Node.js (runs without global installation)
├── start_project.bat      # Launches both servers in one click
└── README.md              # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

1. **Python 3.10+**: Make sure Python is installed on your computer.
2. **Node.js** (Optional): A portable version of Node.js is already bundled inside this project, so you can run the frontend even if you don't have Node.js installed globally!

---

### Run Locally (Windows)

Simply double-click the **`start_project.bat`** file in the root folder. 

This will automatically:
1. Start the FastAPI backend server on `http://localhost:8000`
2. Start the Vite React development server on `http://localhost:5173`

Your default browser will open (or you can navigate to) **[http://localhost:5173](http://localhost:5173)** to access the app.

---

### Manual Setup (Platform Independent)

#### 1. Setup Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security Architecture

SecurePass Pro uses a **Zero-Knowledge Architecture**:
1. **Derivation**: When you sign up or log in, your master password is run through PBKDF2 on the client side to generate:
   - An **Encryption Key** (kept strictly in memory).
   - An **Authentication Verifier** (hashed using PBKDF2 before sending to the server).
2. **Transmission**: Only the Authentication Verifier is sent to the server. The actual decryption key never leaves your device.
3. **Storage**: All passwords saved in the vault are encrypted with your Encryption Key inside the browser using AES. The backend database only stores ciphertexts.
