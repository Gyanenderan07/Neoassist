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
  Code,
  ShieldCheck
} from "lucide-react";

export const LandingPage = ({ onGetStarted, onTryQuery }) => {
  const [demoInput, setDemoInput] = useState("Show all students from the CSE department");
  const [demoGenerated, setDemoGenerated] = useState(false);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0" }}>
      {/* Top Banner Navigation */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "16px 32px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        border: "1px solid rgba(226, 232, 240, 0.8)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        marginBottom: "40px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            width: "38px", 
            height: "38px", 
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
            borderRadius: "10px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "white"
          }}>
            <Database size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.5px", color: "#0f172a" }}>
            NEO ASSIST
          </span>
        </div>

        <nav style={{ display: "flex", gap: "28px", fontSize: "0.92rem", fontWeight: 600, color: "#64748b" }}>
          <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a>
          <a href="#how" style={{ color: "inherit", textDecoration: "none" }}>How It Works</a>
          <a href="#schema" style={{ color: "inherit", textDecoration: "none" }}>Databases</a>
          <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>Use Cases</a>
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
        padding: "30px 20px 60px 20px" 
      }}>
        <div>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 14px", 
            background: "#eff6ff", 
            borderRadius: "20px",
            color: "#2563eb",
            fontWeight: 700,
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
            color: "#0f172a",
            marginBottom: "20px" 
          }}>
            Natural Language <br />
            <span style={{ 
              background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent" 
            }}>
              to SQL Conversion
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#475569", lineHeight: 1.6, marginBottom: "32px", maxWidth: "520px" }}>
            Turn your everyday natural English questions into optimized, production-grade SQL queries and visual dashboards. No SQL required — just ask your data.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <button className="btn-primary" style={{ padding: "14px 28px", fontSize: "1.05rem" }} onClick={onGetStarted}>
              Launch Dashboard <ArrowRight size={18} />
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: "14px 24px", fontSize: "1.05rem" }}
              onClick={() => {
                onTryQuery("Show all students from the CSE department");
              }}
            >
              <Play size={18} color="#2563eb" /> Run Demo Query
            </button>
          </div>

          {/* Highlights */}
          <div style={{ display: "flex", gap: "24px", marginTop: "40px", color: "#64748b", fontSize: "0.88rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="#16a34a" /> Instant Execution
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="#16a34a" /> Voice Dictation Enabled
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={16} color="#16a34a" /> In-Memory Database
            </span>
          </div>
        </div>

        {/* Hero Interactive 3D Graphic & Preview Card */}
        <div style={{ position: "relative" }}>
          {/* Pastel 3D Cylinders Graphic Simulation */}
          <div style={{ 
            position: "absolute", 
            top: "-30px", 
            right: "20px", 
            width: "120px", 
            height: "120px", 
            background: "radial-gradient(circle, #38bdf8 0%, #2563eb 80%)", 
            borderRadius: "50%", 
            filter: "blur(40px)", 
            opacity: 0.35, 
            zIndex: 0 
          }}></div>

          <div className="neo-card" style={{ 
            position: "relative", 
            zIndex: 1, 
            border: "1px solid rgba(226, 232, 240, 0.9)", 
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.12)",
            background: "#ffffff",
            padding: "28px"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }}></span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>students_db (active)</span>
              </div>
              <span className="badge badge-yellow">Interactive Preview</span>
            </div>

            {/* Input simulation */}
            <div style={{ 
              background: "#f8fafc", 
              border: "1px solid #e2e8f0", 
              borderRadius: "14px", 
              padding: "14px 18px", 
              marginBottom: "16px" 
            }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Natural Language Question:
              </label>
              <input
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}
              />
            </div>

            <button 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", marginBottom: "20px" }}
              onClick={() => {
                setDemoGenerated(true);
                onTryQuery(demoInput);
              }}
            >
              <Sparkles size={16} /> Convert to SQL & Execute
            </button>

            {/* Generated SQL snippet preview */}
            <div className="code-box">
              <div className="code-box-header">
                <span>GENERATED SQL</span>
                <span>ANSI SQLite</span>
              </div>
              <div className="code-box-content">
                <span style={{ color: "#38bdf8" }}>SELECT</span> * <br />
                <span style={{ color: "#38bdf8" }}>FROM</span> students <br />
                <span style={{ color: "#38bdf8" }}>WHERE</span> department = <span style={{ color: "#fef08a" }}>&apos;CSE&apos;</span>;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Pills / Cards matching mockup screen 1 */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "20px", 
        marginTop: "30px" 
      }}>
        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "#eff6ff", padding: "12px", borderRadius: "12px", color: "#2563eb" }}>
            <Zap size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "4px" }}>Simple Queries</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Ask questions in plain English or speak with voice recognition.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "#ecfdf5", padding: "12px", borderRadius: "12px", color: "#10b981" }}>
            <Code size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "4px" }}>Accurate Results</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Powered by Google Gemini AI with semantic fallback for 100% uptime.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "#faf5ff", padding: "12px", borderRadius: "12px", color: "#8b5cf6" }}>
            <Layers size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "4px" }}>Multiple Databases</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Pre-configured with students_db, sales_db & customizable containers.</p>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px" }}>
          <div style={{ background: "#fffbeb", padding: "12px", borderRadius: "12px", color: "#f59e0b" }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: "0.98rem", marginBottom: "4px" }}>Learn & Explore</h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Inspect SQL syntax, analyze schemas, and view real-time charts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
