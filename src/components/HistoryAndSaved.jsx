import React, { useState } from "react";
import { Search, Download, Trash2, Play, CheckCircle, XCircle } from "lucide-react";

export const HistoryAndSaved = ({ history, savedQueries, onRunQuery, onClearHistory, onRemoveSaved }) => {
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'saved'
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter(h => 
    h.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (h.sql && h.sql.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSaved = savedQueries.filter(s =>
    s.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.title && s.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCsv = () => {
    if (history.length === 0) return;
    const header = "id,query,sql,timestamp,success,feedback\n";
    const rows = history.map(h => `"${h.id}","${(h.query || '').replace(/"/g, '""')}","${(h.sql || '').replace(/"/g, '""')}","${h.timestamp}","${h.success}","${h.feedback || 'none'}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neo_assist_query_log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>
            {activeTab === "history" ? "Query History" : "Saved Queries"}
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "4px" }}>
            {activeTab === "history" 
              ? "Comprehensive log of all executed queries, statuses, and validation feedback." 
              : "Quick-access templates and bookmarks for repeated natural questions."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {activeTab === "history" && (
            <>
              <button className="btn-secondary" onClick={handleExportCsv}>
                <Download size={15} /> Export Log CSV
              </button>
              <button 
                onClick={onClearHistory}
                style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", padding: "8px 14px", borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Trash2 size={14} /> Clear Log
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="neo-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        {/* Tab Buttons */}
        <div style={{ background: "#f1f5f9", padding: "4px", borderRadius: "12px", display: "flex", gap: "4px" }}>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: activeTab === "history" ? "#ffffff" : "transparent",
              color: activeTab === "history" ? "#2563eb" : "#64748b",
              boxShadow: activeTab === "history" ? "0 2px 4px rgba(0,0,0,0.06)" : "none"
            }}
          >
            History Log ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: activeTab === "saved" ? "#ffffff" : "transparent",
              color: activeTab === "saved" ? "#2563eb" : "#64748b",
              boxShadow: activeTab === "saved" ? "0 2px 4px rgba(0,0,0,0.06)" : "none"
            }}
          >
            Saved Bookmarks ({savedQueries.length})
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "10px", padding: "6px 14px", minWidth: "260px" }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.88rem", width: "100%" }}
          />
        </div>
      </div>

      {/* Main Table View (History) */}
      {activeTab === "history" && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Query Prompt</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Type</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Date / Time</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Feedback</th>
                  <th style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: "#475569" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                      No queries logged yet. Try asking questions on the Query page!
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 600, color: "#1e293b", maxWidth: "300px" }}>
                        <div>{item.query}</div>
                        {item.sql && (
                          <div style={{ fontSize: "0.76rem", color: "#64748b", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                            {item.sql.slice(0, 50)}...
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className="badge badge-blue">SELECT</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "0.82rem" }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Recent"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {item.success ? (
                          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle size={12} /> Success
                          </span>
                        ) : (
                          <span className="badge" style={{ background: "#fee2e2", color: "#dc2626" }}>
                            <XCircle size={12} /> Failed
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {item.feedback === "positive" && <span style={{ color: "#16a34a", fontWeight: 600 }}>👍 Verified</span>}
                        {item.feedback === "negative" && <span style={{ color: "#dc2626", fontWeight: 600 }}>👎 Incorrect</span>}
                        {!item.feedback && <span style={{ color: "#94a3b8" }}>Pending</span>}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <button
                          onClick={() => onRunQuery(item.query)}
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                        >
                          <Play size={12} /> Run Again
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Saved Queries Bookmarks (Screen 9) */}
      {activeTab === "saved" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {filteredSaved.map((item, idx) => (
            <div key={idx} className="neo-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <h4 style={{ fontSize: "1.02rem", fontWeight: 700, color: "#0f172a" }}>{item.title || item.query}</h4>
                  <span className="badge badge-purple">SELECT</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "12px" }}>
                  Prompt: &ldquo;{item.query}&rdquo;
                </p>
                {item.sql && (
                  <div className="code-box" style={{ fontSize: "0.78rem", marginBottom: "16px" }}>
                    <div className="code-box-content" style={{ padding: "10px" }}>{item.sql}</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                <button
                  onClick={() => onRemoveSaved(idx)}
                  style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.82rem" }}
                >
                  Delete
                </button>

                <button
                  onClick={() => onRunQuery(item.query)}
                  className="btn-primary"
                  style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                >
                  <Play size={14} /> Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
