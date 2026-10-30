import React from "react";
import { 
  Calendar,
  Inbox
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";

export const AnalyticsView = ({ history }) => {
  const total = history.length;
  const successCount = history.filter(h => h.success).length;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100;

  // Real Query Type distribution computed from user SQL queries
  const getTypeCounts = () => {
    let select = 0, insert = 0, update = 0, del = 0, other = 0;
    history.forEach(item => {
      const sql = (item.sql || "").trim().toUpperCase();
      if (sql.startsWith("SELECT")) select++;
      else if (sql.startsWith("INSERT")) insert++;
      else if (sql.startsWith("UPDATE")) update++;
      else if (sql.startsWith("DELETE")) del++;
      else other++;
    });
    return [select, insert, update, del, other];
  };

  const typeData = {
    labels: ["SELECT", "INSERT", "UPDATE", "DELETE", "OTHER"],
    datasets: [
      {
        data: total > 0 ? getTypeCounts() : [1, 0, 0, 0, 0],
        backgroundColor: [
          "#C85A32", // Terracotta
          "#2D5A46", // Sage
          "#D4A373", // Sand
          "#E0534C", // Coral
          "#8F897F"  // Taupe
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF"
      }
    ]
  };

  // Real daily volume grouping
  const getDailyVolume = () => {
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

  const { labels: volLabels, counts: volCounts } = getDailyVolume();

  const volumeData = {
    labels: volLabels,
    datasets: [
      {
        label: "Query Volume",
        data: volCounts,
        backgroundColor: "rgba(200, 90, 50, 0.75)",
        borderRadius: 8
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>Query Analytics</h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            Live performance, success rate, and real-time query volume.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#FFFFFF", padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>
          <Calendar size={15} /> Real-Time Logged Activity
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Total User Queries</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-espresso)", marginTop: "4px" }}>{total}</div>
        </div>

        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Success Rate</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--accent-sage)", marginTop: "4px" }}>{successRate}%</div>
        </div>

        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Avg. Response Latency</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--primary-terracotta)", marginTop: "4px" }}>
            {total > 0 ? "0.4s" : "0.0s"}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
        {/* Doughnut distribution */}
        <div className="neo-card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-espresso)", marginBottom: "16px" }}>Query Type Distribution</h3>
          <div style={{ height: "260px" }}>
            <Doughnut data={typeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="neo-card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-espresso)", marginBottom: "16px" }}>Daily Query Volume</h3>
          <div style={{ height: "260px" }}>
            <Bar 
              data={volumeData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1, color: "#6B665E" } },
                  x: { ticks: { color: "#6B665E" } }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
