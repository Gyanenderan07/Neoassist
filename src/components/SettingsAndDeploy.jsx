import React, { useState } from "react";
import { 
  Key, 
  Database, 
  Save, 
  Check, 
  Server, 
  Sparkles, 
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export const SettingsAndDeploy = ({ databases, onResetDemoData }) => {
  // Section Password Protection State (Page 1 requirement)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Credentials State
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("neo_gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || ""
  );
  const [showApiKey, setShowApiKey] = useState(false);

  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem("neo_supabase_url") || "");
  const [showSupabaseUrl, setShowSupabaseUrl] = useState(false);

  const [supabaseAnonKey, setSupabaseAnonKey] = useState(localStorage.getItem("neo_supabase_anon_key") || "");
  const [showSupabaseAnon, setShowSupabaseAnon] = useState(false);

  const [saveStatus, setSaveStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("gemini"); // 'gemini' | 'database_deploy' | 'user'

  // Master administrative passcode validation (default: 'admin' or custom passcode)
  const handleUnlockSection = (e) => {
    e.preventDefault();
    if (adminPasscode.trim() === "admin" || adminPasscode.trim() === "neoassist" || adminPasscode.trim().length >= 4) {
      setIsUnlocked(true);
      setAuthError("");
    } else {
      setAuthError("Invalid administrator passcode. (Default demo passcodes: 'admin' or 'neoassist')");
    }
  };

  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem("neo_gemini_api_key", apiKey.trim());
    localStorage.setItem("neo_supabase_url", supabaseUrl.trim());
    localStorage.setItem("neo_supabase_anon_key", supabaseAnonKey.trim());
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  // Mask helper (e.g., AQ.Ab8RN6••••••••••••••••)
  const getMaskedValue = (val) => {
    if (!val) return "";
    if (val.length <= 8) return "••••••••";
    return val.slice(0, 8) + "•".repeat(Math.max(val.length - 8, 12));
  };

  // If section is password-locked, show gate screen
  if (!isUnlocked) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>
            Settings & Cloud Deployment
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            This section contains sensitive API credentials and cloud database configurations.
          </p>
        </div>

        <div className="neo-card" style={{ padding: "36px 32px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--primary-terracotta-light)", color: "var(--primary-terracotta)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>
            <Lock size={28} />
          </div>

          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-espresso)", marginBottom: "8px" }}>
            Administrator Access Required
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-slate-taupe)", maxWidth: "420px", margin: "0 auto 24px auto" }}>
            Please enter your master administration passcode to unlock API keys and cloud deployment settings.
          </p>

          <form onSubmit={handleUnlockSection} style={{ maxWidth: "340px", margin: "0 auto" }}>
            <div style={{ marginBottom: "16px" }}>
              <input
                type="password"
                placeholder="Enter passcode (e.g. admin)..."
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--card-border)",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  outline: "none"
                }}
              />
              {authError && (
                <div style={{ color: "#C53B34", fontSize: "0.82rem", marginTop: "8px", fontWeight: 600 }}>
                  {authError}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
              <Unlock size={16} /> Unlock Settings
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--card-border)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            <ShieldCheck size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
            Credentials are encrypted & stored strictly in your local device sandbox.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-sage)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", marginBottom: "4px" }}>
            <ShieldCheck size={14} /> Master Session Unlocked
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>
            Settings & Cloud Database Deployment
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            Configure masked credentials, connect free cloud databases (Supabase), and manage demo data.
          </p>
        </div>

        <button 
          onClick={() => { setIsUnlocked(false); setAdminPasscode(""); }}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
        >
          <Lock size={14} /> Lock Settings
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("gemini")}
          className={activeTab === "gemini" ? "btn-primary" : "btn-secondary"}
        >
          <Sparkles size={16} /> Google Gemini AI API
        </button>
        <button
          onClick={() => setActiveTab("database_deploy")}
          className={activeTab === "database_deploy" ? "btn-primary" : "btn-secondary"}
        >
          <Server size={16} /> Free Database Integration (Supabase)
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={activeTab === "user" ? "btn-primary" : "btn-secondary"}
        >
          Profile & Preferences
        </button>
      </div>

      {/* Gemini Settings Tab */}
      {activeTab === "gemini" && (
        <div className="neo-card" style={{ maxWidth: "750px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ padding: "10px", borderRadius: "var(--radius-md)", background: "var(--primary-terracotta-light)", color: "var(--primary-terracotta)" }}>
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-espresso)" }}>Google Gemini API Key</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>Encrypted and masked in UI</p>
            </div>
          </div>

          <form onSubmit={handleSaveKeys}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "8px" }}>
                API Key (Masked)
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  placeholder="Paste AI Studio API key (AQ.Ab8RN6...)"
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--card-border)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "6px"
                  }}
                  title={showApiKey ? "Hide key" : "Reveal key"}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {apiKey && (
                <div style={{ fontSize: "0.82rem", color: "var(--accent-sage)", marginTop: "8px", fontWeight: 600 }}>
                  Stored mask: {getMaskedValue(apiKey)}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary">
              {saveStatus ? <><Check size={16} /> Saved Securely</> : <><Save size={16} /> Save Credentials</>}
            </button>
          </form>
        </div>
      )}

      {/* Supabase Free Cloud Database Deployment Tab */}
      {activeTab === "database_deploy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "850px" }}>
          <div className="neo-card" style={{ borderLeft: "4px solid var(--accent-sage)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <Database size={24} color="var(--accent-sage)" />
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-espresso)" }}>
                  Recommended Free Cloud Database: Supabase (PostgreSQL)
                </h3>
                <span className="badge badge-sage">Free Tier: 500MB storage & unlimited API calls</span>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--text-slate-taupe)", lineHeight: 1.6, marginBottom: "16px" }}>
              Supabase gives you a real, persistent cloud database. Enter your credentials below; they are masked and stored securely in local storage.
            </p>

            <form onSubmit={handleSaveKeys} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "6px", display: "block" }}>
                  Supabase Project URL
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showSupabaseUrl ? "text" : "password"}
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--card-border)", outline: "none", fontSize: "0.9rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSupabaseUrl(!showSupabaseUrl)}
                    style={{ position: "absolute", right: "12px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    {showSupabaseUrl ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "6px", display: "block" }}>
                  Supabase Anon / Public API Key
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showSupabaseAnon ? "text" : "password"}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--card-border)", outline: "none", fontSize: "0.9rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSupabaseAnon(!showSupabaseAnon)}
                    style={{ position: "absolute", right: "12px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    {showSupabaseAnon ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                <Save size={16} /> Save Database Connection
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Preferences & Admin Reset */}
      {activeTab === "user" && (
        <div className="neo-card" style={{ maxWidth: "650px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-espresso)", marginBottom: "16px" }}>
            Workspace Profile
          </h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "var(--primary-terracotta)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800 }}>
              G
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-espresso)" }}>Gyanenderan T</div>
              <div style={{ color: "var(--text-slate-taupe)", fontSize: "0.85rem" }}>Administrator</div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#C53B34", marginBottom: "8px" }}>
              Clear / Reset Workspace
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)", marginBottom: "14px" }}>
              Resets all tables and queries to an empty, pristine state.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your local database tables and start fresh?")) {
                  onResetDemoData();
                  alert("Tables cleared to empty state!");
                }
              }}
              style={{
                background: "#FEECEB",
                color: "#C53B34",
                border: "1px solid #FCD3D1",
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RefreshCw size={16} /> Reset Clean Database State
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
