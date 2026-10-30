import React from "react";
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  Mic, 
  Play, 
  TrendingUp,
  Inbox
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
  // Live computed counters strictly from real user activity (Page 5 requirement)
  const totalQueries = history.length;
  const successful = history.filter(h => h.success).length;
  const failed = history.filter(h => !h.success).length;
  const totalSaved = savedQueries.length;

  // Real 7-day query grouping from actual user history timestamps
  const getDayCounts = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels = [];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
    }

    history.forEach(item => {
      if (item.timestamp) {
        const itemDate = new Date(item.timestamp);
        const diffDays = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          counts[6 - diffDays]++;
        }
      }
    });

    return { labels, counts };
  };

  const { labels: dayLabels, counts: dayCounts } = getDayCounts();

  const activityData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Real Queries Executed",
        data: dayCounts,
        borderColor: "#C85A32",
        backgroundColor: "rgba(200, 90, 50, 0.08)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#C85A32",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 5
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
      x: { grid: { display: false }, ticks: { font: { family: "var(--font-main)" }, color: "#6B665E" } },
      y: { 
        beginAtZero: true, 
        grid: { color: "rgba(44, 38, 29, 0.06)" }, 
        ticks: { stepSize: 1, font: { family: "var(--font-main)" }, color: "#6B665E" } 
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>
            Welcome, Gyanenderan ! 👋
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            Convert natural language into accurate SQL and explore your database live.
          </p>
        </div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-slate-taupe)", background: "#FFFFFF", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--card-border)" }}>
          Live Session &bull; Real-Time Sync
        </div>
      </div>

      {/* 4 Metric Badges - Real computed counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px" }}>
        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--primary-terracotta-light)", color: "var(--primary-terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Terminal size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Total Queries</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-espresso)" }}>{totalQueries}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--accent-sage-light)", color: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Successful</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-espresso)" }}>{successful}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#FEECEB", color: "#C53B34", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <XCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Failed</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-espresso)" }}>{failed}</div>
          </div>
        </div>

        <div className="neo-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--accent-sand-light)", color: "var(--accent-sand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bookmark size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Saved Queries</div>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--text-espresso)" }}>{totalSaved}</div>
          </div>
        </div>
      </div>

      {/* "Try a Query" Hero Input Box with dynamic placeholder */}
      <div className="neo-card" style={{ padding: "24px", border: "1.5px solid rgba(200, 90, 50, 0.2)" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px", color: "var(--text-espresso)" }}>
          Try a Natural Language Query
        </h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ 
            flex: 1, 
            display: "flex", 
            alignItems: "center", 
            background: "var(--bg-cream)", 
            border: "1.5px solid var(--card-border)", 
            borderRadius: "var(--radius-md)", 
            padding: "4px 16px" 
          }}>
            <input
              type="text"
              placeholder='e.g., "Add 5 new students in AIDS department" or "Show all records where cgpa > 8.5"...'
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              style={{ flex: 1, padding: "10px 0", border: "none", outline: "none", fontSize: "0.95rem", color: "var(--text-espresso)", background: "transparent" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onQuickRun(naturalQuery);
              }}
            />
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
      </div>

      {/* Grid: Recent Queries (Left) & Live Activity Chart (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
        {/* Recent queries list */}
        <div className="neo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-espresso)" }}>Recent User Queries</h3>
            {history.length > 0 && (
              <button 
                onClick={() => onNavigate("history")} 
                style={{ background: "transparent", border: "none", color: "var(--primary-terracotta)", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                View Full Log
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "36px 16px", color: "var(--text-muted)" }}>
                <Inbox size={26} style={{ display: "block", margin: "0 auto 8px auto", opacity: 0.4 }} />
                <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>No recent queries executed yet.</p>
                <p style={{ fontSize: "0.8rem", marginTop: "2px" }}>Type or speak a question above to see real activity.</p>
              </div>
            ) : (
              history.slice(0, 5).map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => onQuickRun(item.query)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-linen)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.success ? "var(--accent-sage)" : "#C53B34" }}></span>
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-espresso)" }}>{item.query}</span>
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-slate-taupe)" }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Query Activity 7 Days chart */}
        <div className="neo-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-espresso)" }}>Query Activity (Last 7 Days)</h3>
            <span className="badge badge-terracotta">Real-Time: {totalQueries} executed</span>
          </div>
          <div style={{ height: "230px" }}>
            <Line data={activityData} options={activityOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
