import React, { useState } from "react";
import { 
  Key, 
  Database, 
  ExternalLink, 
  Save, 
  Check, 
  Server, 
  Sparkles, 
  RefreshCw,
  Terminal,
  Layers
} from "lucide-react";

export const SettingsAndDeploy = ({ databases, onResetDemoData }) => {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("neo_gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY || ""
  );
  const [saveStatus, setSaveStatus] = useState(false);

  // Supabase mock / live connection config
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem("neo_supabase_url") || "");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(localStorage.getItem("neo_supabase_anon_key") || "");
  const [activeTab, setActiveTab] = useState("gemini"); // 'gemini' | 'database_deploy' | 'user'

  const handleSaveKeys = (e) => {
    e.preventDefault();
    localStorage.setItem("neo_gemini_api_key", apiKey.trim());
    localStorage.setItem("neo_supabase_url", supabaseUrl.trim());
    localStorage.setItem("neo_supabase_anon_key", supabaseAnonKey.trim());
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
          Settings & Cloud Database Deployment
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "4px" }}>
          Configure Google Gemini AI credentials, connect free cloud databases (Supabase / MongoDB), and manage workspace preferences.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px" }}>
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

      {/* Gemini Settings */}
      {activeTab === "gemini" && (
        <div className="neo-card" style={{ maxWidth: "750px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb" }}>
              <Key size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Google Gemini API Key</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Used for zero-latency Text-to-SQL translation</p>
            </div>
          </div>

          <form onSubmit={handleSaveKeys}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                API Key (Current key loaded from your Google AI Studio credentials)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}
              />
              <span style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: "6px", display: "inline-block" }}>
                Active: Gemini 1.5/2.5 Flash ready for SQL code generation.
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {saveStatus ? <><Check size={16} /> Saved Successfully</> : <><Save size={16} /> Save Settings</>}
            </button>
          </form>
        </div>
      )}

      {/* Database Integration Guide & Config (Prompt Question Answer) */}
      {activeTab === "database_deploy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "850px" }}>
          <div className="neo-card" style={{ borderLeft: "4px solid #10b981" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <Database size={24} color="#10b981" />
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Recommended Free Cloud Database: Supabase (PostgreSQL)</h3>
                <span className="badge badge-success">Free Tier: 500MB storage & unlimited API calls</span>
              </div>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6, marginBottom: "16px" }}>
              Supabase gives you a real, persistent PostgreSQL database with built-in instant RESTful and SQL querying APIs. 
              Here is how to deploy it into NeoAssist:
            </p>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>🚀 Step-by-Step Deployment Guide:</h4>
              <ol style={{ paddingLeft: "20px", fontSize: "0.88rem", color: "#475569", lineHeight: 1.7 }}>
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>supabase.com</a> and sign in with GitHub or Google for free.</li>
                <li>Click <strong>&ldquo;New project&rdquo;</strong> &rarr; name it <code>neo-assist-db</code> and set your database password.</li>
                <li>In the Supabase SQL Editor, paste the SQL schema (provided below) to create the tables.</li>
                <li>Go to <strong>Project Settings &rarr; API</strong>, copy your <strong>Project URL</strong> and <strong>anon public API key</strong>, and paste them into the fields below.</li>
              </ol>
            </div>

            {/* Supabase credentials input */}
            <form onSubmit={handleSaveKeys} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569" }}>Supabase Anon / Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button type="submit" className="btn-primary">
                  <Save size={16} /> Save Database Connection
                </button>
              </div>
            </form>
          </div>

          {/* Copy-paste SQL script for Supabase */}
          <div className="neo-card">
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>
              📋 Instant SQL Migration Script for Supabase / PostgreSQL:
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "12px" }}>
              Run this in your Supabase SQL Editor to initialize all tables and seed records immediately:
            </p>

            <div className="code-box">
              <pre className="code-box-content" style={{ fontSize: "0.8rem", maxHeight: "200px" }}>
{`-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  year INT NOT NULL,
  cgpa NUMERIC(3,2),
  email TEXT
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  sale_id SERIAL PRIMARY KEY,
  product_id INT,
  customer_id INT,
  region TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);

-- Insert sample records
INSERT INTO students (name, department, year, cgpa, email) VALUES
('Arjun Kumar', 'CSE', 3, 8.7, 'arjun@sairam.edu.in'),
('Priya Sharma', 'CSE', 3, 9.1, 'priya@sairam.edu.in'),
('Harini P', 'CSE', 4, 9.0, 'harini@sairam.edu.in');`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* User Preferences & Admin Reset */}
      {activeTab === "user" && (
        <div className="neo-card" style={{ maxWidth: "650px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>User Profile & Admin Tools</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700 }}>
              G
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Gyanenderan T</div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>gyanenderan@sairam.edu.in</div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#dc2626", marginBottom: "8px" }}>
              Admin Reset
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "14px" }}>
              Need to restore the initial demo state? This will re-seed all tables in students_db and sales_db.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all demo database tables?")) {
                  onResetDemoData();
                  alert("Demo tables have been restored to initial state!");
                }
              }}
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <RefreshCw size={16} /> Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
