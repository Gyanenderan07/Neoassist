import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Database, 
  Play, 
  CheckCircle, 
  Zap, 
  Layers, 
  BookOpen, 
  Code
} from "lucide-react";

export const LandingPage = ({ onGetStarted, onTryQuery }) => {
  const [demoInput, setDemoInput] = useState("Show all records where cgpa > 8.5");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "10px 0" }}>
      {/* Top Banner Navigation */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "16px 32px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(12px)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        marginBottom: "40px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            width: "38px", 
            height: "38px", 
            background: "linear-gradient(135deg, var(--primary-terracotta) 0%, var(--primary-terracotta-hover) 100%)", 
            borderRadius: "10px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "white"
          }}>
            <Database size={20} />
          </div>
          <span className="brand-nura" style={{ fontSize: "1.25rem", color: "var(--text-espresso)" }}>
            NEOASSIST
          </span>
        </div>

        <nav style={{ display: "flex", gap: "28px", fontSize: "0.92rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>
          <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a>
          <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>How It Works</a>
          <a href="#schema" style={{ color: "inherit", textDecoration: "none" }}>Databases</a>
          <a href="#sheets" style={{ color: "inherit", textDecoration: "none" }}>Google Sheets Import</a>
        </nav>

        <button className="btn-primary" onClick={onGetStarted}>
          Get Started <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1.1fr 0.9fr", 
        gap: "40px", 
        alignItems: "center",
        padding: "20px 10px 50px 10px" 
      }}>
        <div>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 14px", 
            background: "var(--primary-terracotta-light)", 
            borderRadius: "20px",
            color: "var(--primary-terracotta)",
            fontWeight: 800,
            fontSize: "0.82rem",
            marginBottom: "20px"
          }}>
            <Sparkles size={15} /> AI POWERED TEXT-TO-SQL
          </div>

          <h1 style={{ 
            fontSize: "3.2rem", 
            fontWeight: 800, 
            lineHeight: 1.15, 
            letterSpacing: "-1.5px",
            color: "var(--text-espresso)",
            marginBottom: "20px" 
          }}>
            Natural Language <br />
            <span style={{ 
              background: "linear-gradient(135deg, var(--primary-terracotta) 0%, var(--accent-sand) 100%)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}>
              to SQL Conversion
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--text-slate-taupe)", lineHeight: 1.6, marginBottom: "32px", maxWidth: "520px" }}>
            Turn your everyday natural English questions into optimized, production-grade SQL queries and visual dashboards. No SQL required — just ask your data.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem" }} onClick={onGetStarted}>
              Launch Dashboard <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: "14px 24px", fontSize: "1.05rem" }}
              onClick={() => onTryQuery(demoInput)}
            >
              <Play size={18} color="var(--primary-terracotta)" /> Run Query Studio
            </button>
          </div>

          {/* Highlights */}
          <div style={{ display: "flex", gap: "24px", marginTop: "40px", color: "var(--text-slate-taupe)", fontSize: "0.88rem", fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="var(--accent-sage)" /> Instant In-Memory SQL
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="var(--accent-sage)" /> Google Sheets Ingestion
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="var(--accent-sage)" /> Voice Command Microphone
            </span>
          </div>
        </div>

        {/* Hero Preview Card */}
        <div style={{ position: "relative" }}>
          <div className="neo-card" style={{ 
            position: "relative", 
            zIndex: 1, 
            background: "#FFFFFF",
            padding: "28px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent-sage)" }}></span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-espresso)" }}>students_db (active)</span>
              </div>
              <span className="badge badge-sand">Interactive Preview</span>
            </div>

            <div style={{ 
              background: "var(--bg-linen)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "var(--radius-md)", 
              padding: "14px 18px", 
              marginBottom: "16px" 
            }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-slate-taupe)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Natural Language Question:
              </label>
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", fontWeight: 700, color: "var(--text-espresso)" }}
              />
            </div>

            <button 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}
              onClick={() => onTryQuery(demoInput)}
            >
              <Sparkles size={16} /> Convert to SQL & Run
            </button>

            <div className="code-box">
              <div className="code-box-header">
                <span>GENERATED SQL</span>
                <span>ANSI SQLite</span>
              </div>
              <div className="code-box-content">
                <span style={{ color: "var(--primary-terracotta)" }}>SELECT</span> * <br />
                <span style={{ color: "var(--primary-terracotta)" }}>FROM</span> students <br />
                <span style={{ color: "var(--primary-terracotta)" }}>WHERE</span> cgpa &gt; <span style={{ color: "#E0A96D" }}>8.5</span>;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "20px", 
        marginTop: "20px" 
      }}>
        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "var(--primary-terracotta-light)", padding: "12px", borderRadius: "12px", color: "var(--primary-terracotta)" }}>
            <Zap size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.98rem", marginBottom: "4px", color: "var(--text-espresso)" }}>Simple Queries</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>Ask questions in plain English or speak with voice recognition.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "var(--accent-sage-light)", padding: "12px", borderRadius: "12px", color: "var(--accent-sage)" }}>
            <Code size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.98rem", marginBottom: "4px", color: "var(--text-espresso)" }}>Accurate Results</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>Powered by Google Gemini AI with fallback for 100% reliability.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "var(--accent-sand-light)", padding: "12px", borderRadius: "12px", color: "#9C6B38" }}>
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.98rem", marginBottom: "4px", color: "var(--text-espresso)" }}>Google Sheets Ingestion</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>Import public sheet links, copy-paste rows, or upload CSV files.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "var(--bg-linen)", padding: "12px", borderRadius: "12px", color: "var(--text-espresso)" }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: "0.98rem", marginBottom: "4px", color: "var(--text-espresso)" }}>Learn & Explore</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>Inspect schemas, relationships, and visualize data via live charts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
