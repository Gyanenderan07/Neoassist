import React, { useState } from "react";
import { Search, Download, Trash2, Play, CheckCircle, XCircle, Clock } from "lucide-react";

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
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>
            {activeTab === "history" ? "Query History & Logs" : "Saved Queries"}
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            {activeTab === "history" 
              ? "Exclusively displays queries genuinely executed by you in this session." 
              : "Quick-access templates and bookmarks saved from real user queries."}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {activeTab === "history" && history.length > 0 && (
            <>
              <button className="btn-secondary" onClick={handleExportCsv}>
                <Download size={15} /> Export Log CSV
              </button>
              <button 
                onClick={onClearHistory}
                style={{ background: "#FEECEB", border: "1px solid #FCD3D1", color: "#C53B34", padding: "8px 14px", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
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
        <div style={{ background: "var(--bg-linen)", padding: "4px", borderRadius: "var(--radius-md)", display: "flex", gap: "4px" }}>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "8px 18px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: activeTab === "history" ? "#FFFFFF" : "transparent",
              color: activeTab === "history" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
              boxShadow: activeTab === "history" ? "0 2px 6px rgba(44,38,29,0.06)" : "none"
            }}
          >
            History Log ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            style={{
              padding: "8px 18px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              background: activeTab === "saved" ? "#FFFFFF" : "transparent",
              color: activeTab === "saved" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
              boxShadow: activeTab === "saved" ? "0 2px 6px rgba(44,38,29,0.06)" : "none"
            }}
          >
            Saved Bookmarks ({savedQueries.length})
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-cream)", border: "1px solid var(--card-border)", borderRadius: "var(--radius-md)", padding: "6px 14px", minWidth: "260px" }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", fontSize: "0.88rem", width: "100%", color: "var(--text-espresso)" }}
          />
        </div>
      </div>

      {/* Main Table View (History) */}
      {activeTab === "history" && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ padding: "14px 20px", textAlign: "left" }}>User Query</th>
                  <th style={{ padding: "14px 20px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "14px 20px", textAlign: "left" }}>Execution Time</th>
                  <th style={{ padding: "14px 20px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "left" }}>Feedback</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                      <Clock size={28} style={{ display: "block", margin: "0 auto 10px auto", opacity: 0.4 }} />
                      <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>No query execution history recorded yet.</p>
                      <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>Run queries in the Query Studio to see your live audit log appear here.</p>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "14px 20px", fontWeight: 700, color: "var(--text-espresso)", maxWidth: "340px" }}>
                        <div>{item.query}</div>
                        {item.sql && (
                          <div style={{ fontSize: "0.76rem", color: "var(--text-slate-taupe)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
                            {item.sql.slice(0, 60)}...
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className="badge badge-terracotta">SELECT</span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--text-slate-taupe)", fontSize: "0.82rem" }}>
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Just now"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {item.success ? (
                          <span className="badge badge-sage">
                            <CheckCircle size={12} /> Success
                          </span>
                        ) : (
                          <span className="badge" style={{ background: "#FEECEB", color: "#C53B34" }}>
                            <XCircle size={12} /> Failed
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {item.feedback === "positive" && <span style={{ color: "var(--accent-sage)", fontWeight: 700 }}>👍 Verified</span>}
                        {item.feedback === "negative" && <span style={{ color: "#C53B34", fontWeight: 700 }}>👎 Incorrect</span>}
                        {!item.feedback && <span style={{ color: "var(--text-muted)" }}>Pending</span>}
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

      {/* Saved Bookmarks */}
      {activeTab === "saved" && (
        <div>
          {filteredSaved.length === 0 ? (
            <div className="neo-card" style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>No saved query bookmarks yet.</p>
              <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>Click &ldquo;Save Query&rdquo; on any result in the Query Studio to bookmark it here.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
              {filteredSaved.map((item, idx) => (
                <div key={idx} className="neo-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <h4 style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-espresso)" }}>{item.title || item.query}</h4>
                      <span className="badge badge-sand">BOOKMARK</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)", marginBottom: "12px" }}>
                      Prompt: &ldquo;{item.query}&rdquo;
                    </p>
                    {item.sql && (
                      <div className="code-box" style={{ fontSize: "0.78rem", marginBottom: "16px" }}>
                        <div className="code-box-content" style={{ padding: "10px" }}>{item.sql}</div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--card-border)", paddingTop: "12px" }}>
                    <button
                      onClick={() => onRemoveSaved(idx)}
                      style={{ background: "transparent", border: "none", color: "#C53B34", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}
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
      )}
    </div>
  );
};
