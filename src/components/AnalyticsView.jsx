import React, { useState } from "react";
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Zap, 
  Database, 
  Calendar 
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";

export const AnalyticsView = ({ history }) => {
  const total = history.length || 124;
  const successCount = history.filter(h => h.success).length || 112;
  const successRate = Math.round((successCount / total) * 100);

  // Donut chart: Query Type distribution
  const typeData = {
    labels: ["SELECT", "COUNT", "INSERT", "UPDATE", "DELETE"],
    datasets: [
      {
        data: [72, 15, 5, 5, 3],
        backgroundColor: [
          "#2563eb",
          "#06b6d4",
          "#10b981",
          "#f59e0b",
          "#ef4444"
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }
    ]
  };

  // Daily volume bar chart
  const volumeData = {
    labels: ["Oct 20", "Oct 22", "Oct 24", "Oct 26", "Oct 28", "Oct 30"],
    datasets: [
      {
        label: "Query Count",
        data: [18, 24, 32, 28, 38, 45],
        backgroundColor: "rgba(37, 99, 235, 0.8)",
        borderRadius: 8
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>Query Analytics</h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "4px" }}>
            Overview of your query usage, system latency, and model conversion performance.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#ffffff", padding: "8px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
          <Calendar size={15} /> Last 7 Days
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b" }}>Total Queries</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>{total}</div>
        </div>

        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b" }}>Success Rate</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#16a34a", marginTop: "4px" }}>{successRate}%</div>
        </div>

        <div className="neo-card" style={{ padding: "20px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b" }}>Avg. Response Time</span>
          <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#2563eb", marginTop: "4px" }}>0.8 s</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
        {/* Doughnut distribution */}
        <div className="neo-card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px" }}>Query Type Distribution</h3>
          <div style={{ height: "260px" }}>
            <Doughnut data={typeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="neo-card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px" }}>Daily Query Count</h3>
          <div style={{ height: "260px" }}>
            <Bar data={volumeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};
