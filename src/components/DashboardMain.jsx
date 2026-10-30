import React, { useState } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Terminal, 
  ArrowRight, 
  Mic, 
  Play, 
  Clock,
  TrendingUp
} from "lucide-react";
import { Line } from "react-chartjs-2";

export const DashboardMain = ({ 
  history, 
  savedQueries, 
  onRunSaved, 
  onNavigate, 
  naturalQuery, 
  setNaturalQuery, 
  toggleListening, 
  isListening, 
  onQuickRun 
}) => {
  const totalQueries = history.length;
  const successful = history.filter(h => h.success).length;
  const failed = history.filter(h => !h.success).length;
  const totalSaved = savedQueries.length;

  const quickPrompts = [
    "Show all students",
    "Count by department",
    "Top 5 CGPA",
    "Show placements"
  ];

  // Chart data for 7-day query activity
  const activityData = {
    labels: ["Oct 24", "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29", "Oct 30"],
    datasets: [
      {
        label: "Queries Executed",
        data: [12, 19, 15, 27, 22, 34, 42],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#2563eb",
        pointRadius: 4
      }
    ]
  };

  const activityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: "var(--font-main)" } } },
      y: { grid: { color: "#f1f5f9" }, ticks: { font: { family: "var(--font-main)" } } }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            Welcome, Gyanenderan ! 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "4px" }}>
            Convert your questions into SQL and explore your data effortlessly.
          </p>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", background: "#ffffff", padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          Oct 30, 2026 &bull; Live Demo
        </div>
      </div>

      {/* 4 Metric Badges matching Screen 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px" }}>
        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Terminal size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Total Queries</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" }}>{totalQueries || 124}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Successful</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" }}>{successful || 112}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#fee2e2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <XCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Failed</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" }}>{failed || 8}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bookmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Saved Queries</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "#0f172a" }}>{totalSaved || 18}</div>
          </div>
        </div>
      </div>

      {/* "Try a Query" Hero Input Box */}
      <div className="neo-card" style={{ padding: "24px", background: "linear-gradient(135deg, #ffffff 0%, #f8faff 100%)", border: "1px solid #bfdbfe" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", color: "#1e293b" }}>
          Try a Query
        </h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ 
            flex: 1, 
            display: "flex", 
            alignItems: "center", 
            background: "#ffffff", 
            border: "1.5px solid #cbd5e1", 
            borderRadius: "14px", 
            padding: "4px 16px" 
          }}>
            <input
              type="text"
              placeholder="Ask your question in natural language... (e.g. Show all students)"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              style={{ flex: 1, padding: "10px 0", border: "none", outline: "none", fontSize: "0.95rem" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onQuickRun(naturalQuery);
              }}
            />
            <span style={{ fontSize: "0.78rem", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", color: "#64748b", marginRight: "8px" }}>
              students_db
            </span>
            <button
              type="button"
              onClick={toggleListening}
              className={`btn-voice ${isListening ? "listening" : ""}`}
              title="Voice dictation"
            >
              <Mic size={16} />
            </button>
          </div>

          <button className="btn-primary" onClick={() => onQuickRun(naturalQuery)}>
            <Play size={16} /> Run
          </button>
        </div>

        {/* Quick prompt buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNaturalQuery(p);
                onQuickRun(p);
              }}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer"
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Recent Queries (Left) & Activity Chart (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
        {/* Recent queries list */}
        <div className="neo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Recent Queries</h3>
            <button 
              onClick={() => onNavigate("history")} 
              style={{ background: "transparent", border: "none", color: "#2563eb", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
            >
              View All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(history.length > 0 ? history.slice(0, 5) : [
              { query: "Show all students from CSE", time: "2 min ago", type: "SELECT" },
              { query: "Count students in each department", time: "12 min ago", type: "SELECT" },
              { query: "Show students with CGPA > 8", time: "28 min ago", type: "SELECT" },
              { query: "List all departments", time: "1 hour ago", type: "SELECT" }
            ]).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => onQuickRun(item.query)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></span>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1e293b" }}>{item.query}</span>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{item.time || "Just now"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Query Activity 7 Days chart */}
        <div className="neo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Query Activity (Last 7 Days)</h3>
            <span className="badge badge-blue">Queries: 124</span>
          </div>
          <div style={{ height: "230px" }}>
            <Line data={activityData} options={activityOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
