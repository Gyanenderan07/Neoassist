import React, { useState } from "react";
import { Database, Lock, Mail, User, Eye, EyeOff, ArrowRight, X } from "lucide-react";

export const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("gyanenderan@sairam.edu.in");
  const [fullName, setFullName] = useState("Gyanenderan T");
  const [password, setPassword] = useState("••••••••••••");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signed in successfully as ${email}!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px", padding: "36px 32px" }}>
        {/* Header / Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px", position: "relative" }}>
          <button 
            onClick={onClose} 
            style={{ position: "absolute", right: 0, top: 0, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            <X size={20} />
          </button>

          <div style={{ 
            width: "48px", 
            height: "48px", 
            background: "linear-gradient(135deg, var(--primary-terracotta) 0%, var(--primary-terracotta-hover) 100%)", 
            borderRadius: "14px", 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "white",
            marginBottom: "12px",
            boxShadow: "0 6px 16px rgba(200, 90, 50, 0.25)"
          }}>
            <Database size={24} />
          </div>

          <h2 className="brand-nura" style={{ fontSize: "1.45rem", color: "var(--text-espresso)" }}>NEOASSIST</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-slate-taupe)", marginTop: "4px" }}>
            {mode === "login" ? "Welcome Back! Login to continue" : "Create Your Account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {mode === "signup" && (
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontSize: "0.9rem", outline: "none" }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontSize: "0.9rem", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontSize: "0.9rem", outline: "none" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-slate-taupe)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            {mode === "login" && (
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); }} style={{ color: "var(--primary-terracotta)", textDecoration: "none", fontWeight: 700 }}>
                Forgot password?
              </a>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "6px" }}>
            {mode === "login" ? "Login" : "Create Account"} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--card-border)" }}></div>
          <span style={{ position: "relative", background: "#FFFFFF", padding: "0 12px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            or continue with
          </span>
        </div>

        {/* Social auth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            type="button"
            className="btn-secondary" 
            style={{ width: "100%", justifyContent: "center", fontSize: "0.88rem" }}
            onClick={() => { alert("Google Sign-In verified!"); onClose(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/></svg>
            Sign in with Google
          </button>
          <button 
            type="button"
            className="btn-secondary" 
            style={{ width: "100%", justifyContent: "center", fontSize: "0.88rem" }}
            onClick={() => { alert("GitHub Sign-In verified!"); onClose(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Sign in with GitHub
          </button>
        </div>

        {/* Toggle Mode */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => setMode("signup")} 
                style={{ background: "transparent", border: "none", color: "var(--primary-terracotta)", fontWeight: 800, cursor: "pointer" }}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button 
                onClick={() => setMode("login")} 
                style={{ background: "transparent", border: "none", color: "var(--primary-terracotta)", fontWeight: 800, cursor: "pointer" }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
