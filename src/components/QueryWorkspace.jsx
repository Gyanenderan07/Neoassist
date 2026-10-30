import React, { useState } from "react";
import { 
  Sparkles, 
  Mic, 
  Play, 
  Copy, 
  Bookmark, 
  HelpCircle, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Table as TableIcon, 
  BarChart2, 
  Download, 
  Check, 
  Database,
  ArrowRight
} from "lucide-react";
import { ChartRenderer } from "./ChartRenderer";

export const QueryWorkspace = ({ 
  databases, 
  activeDbId, 
  onSwitchDb, 
  naturalQuery, 
  setNaturalQuery, 
  isListening, 
  toggleListening,
  onGenerateAndRun,
  lastResult,
  isLoading,
  onSaveQuery,
  onFeedback,
  savedQueries,
  onOpenDataStudio
}) => {
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'chart'
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState(null);

  const sampleQuestions = activeDbId === "students_db" ? [
    "Show all students from the CSE department",
    "Count students in each department",
    "Show students with CGPA >= 8.5",
    "Show placements and packages for 2026",
    "List all departments with HOD names"
  ] : [
    "Show total sales by region",
    "Top products by sales revenue",
    "Show all customers and their cities",
    "List sales above 2000"
  ];

  const handleCopy = () => {
    if (lastResult?.sql) {
      navigator.clipboard.writeText(lastResult.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCsv = () => {
    if (!lastResult?.data || lastResult.data.length === 0) return;
    const items = lastResult.data;
    const header = Object.keys(items[0]).join(",");
    const rows = items.map(obj => Object.values(obj).map(val => `"${val}"`).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `neo_assist_query_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner / Heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
            Natural Language to SQL
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "0.95rem" }}>
            Enter your question and generate SQL instantly with interactive tables and charts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Active Database selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "6px 14px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
            <Database size={16} color="#2563eb" />
            <select
              value={activeDbId}
              onChange={(e) => onSwitchDb(e.target.value)}
              style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "0.88rem", color: "#1e293b", outline: "none", cursor: "pointer" }}
            >
              {Object.values(databases).map(db => (
                <option key={db.id} value={db.id}>{db.name}</option>
              ))}
            </select>
          </div>

          <button className="btn-secondary" onClick={onOpenDataStudio}>
            Insert / Edit Data <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Query Input Card */}
      <div className="neo-card" style={{ padding: "24px" }}>
        <form onSubmit={(e) => { e.preventDefault(); onGenerateAndRun(); }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ 
              flex: 1, 
              display: "flex", 
              alignItems: "center", 
              background: "#f8fafc", 
              border: "1.5px solid #cbd5e1", 
              borderRadius: "14px", 
              padding: "6px 16px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
            }}>
              <input
                type="text"
                placeholder="Ask your question in natural English (e.g. Show all students from CSE)..."
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1.02rem",
                  fontWeight: 500,
                  color: "#0f172a"
                }}
              />
              
              {/* Mic button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`btn-voice ${isListening ? "listening" : ""}`}
                title={isListening ? "Listening... click to stop" : "Speak your query"}
              >
                <Mic size={18} />
              </button>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: "14px 24px", minWidth: "160px" }} disabled={isLoading}>
              {isLoading ? (
                <><RefreshCw size={18} className="animate-spin" /> Translating...</>
              ) : (
                <><Sparkles size={18} /> Generate SQL</>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Try queries:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNaturalQuery(q);
                onGenerateAndRun(q);
              }}
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.82rem",
                color: "#334155",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontWeight: 500
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#334155"; }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Generated SQL Section */}
      {lastResult?.sql && (
        <div className="neo-card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>Generated SQL</h3>
              <span className="badge badge-success">{lastResult.source || "Google Gemini AI"}</span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-secondary" onClick={handleCopy} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
                {copied ? <><Check size={14} color="#16a34a" /> Copied</> : <><Copy size={14} /> Copy SQL</>}
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => onSaveQuery(lastResult)}
                style={{ padding: "6px 12px", fontSize: "0.82rem" }}
              >
                <Bookmark size={14} /> Save Query
              </button>
            </div>
          </div>

          <div className="code-box">
            <div className="code-box-header">
              <span>SQL QUERY</span>
              <span>{activeDbId}</span>
            </div>
            <pre className="code-box-content" style={{ margin: 0 }}>
              {lastResult.sql}
            </pre>
          </div>

          {lastResult.explanation && (
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
              <HelpCircle size={16} color="#2563eb" />
              <span style={{ fontSize: "0.86rem", color: "#475569" }}>{lastResult.explanation}</span>
            </div>
          )}
        </div>
      )}

      {/* Query Result Section (Screen 6) */}
      {lastResult && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header of results */}
          <div style={{ 
            padding: "18px 24px", 
            borderBottom: "1px solid #e2e8f0", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            background: "#ffffff"
          }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>Query Result</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
                Results for: &ldquo;{lastResult.query}&rdquo; ({lastResult.rowCount} records found)
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Table / Chart Tab switch */}
              <div style={{ background: "#f1f5f9", padding: "4px", borderRadius: "10px", display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setActiveTab("table")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: activeTab === "table" ? "#ffffff" : "transparent",
                    color: activeTab === "table" ? "#2563eb" : "#64748b",
                    boxShadow: activeTab === "table" ? "0 2px 4px rgba(0,0,0,0.06)" : "none"
                  }}
                >
                  <TableIcon size={14} /> Table
                </button>
                <button
                  onClick={() => setActiveTab("chart")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: activeTab === "chart" ? "#ffffff" : "transparent",
                    color: activeTab === "chart" ? "#2563eb" : "#64748b",
                    boxShadow: activeTab === "chart" ? "0 2px 4px rgba(0,0,0,0.06)" : "none"
                  }}
                >
                  <BarChart2 size={14} /> Chart
                </button>
              </div>

              <button className="btn-secondary" onClick={handleDownloadCsv} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Body of results */}
          <div style={{ padding: activeTab === "chart" ? "24px" : "0" }}>
            {lastResult.error ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#ef4444" }}>
                <p style={{ fontWeight: 700 }}>Query Execution Failed</p>
                <p style={{ fontSize: "0.88rem", marginTop: "6px" }}>{lastResult.error}</p>
              </div>
            ) : activeTab === "chart" ? (
              <ChartRenderer 
                data={lastResult.data} 
                chartType={lastResult.chartType}
                labelKey={lastResult.chartLabelKey}
                valueKey={lastResult.chartValueKey}
              />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <tr>
                      {lastResult.data && lastResult.data[0] && Object.keys(lastResult.data[0]).map(col => (
                        <th key={col} style={{ padding: "12px 18px", textAlign: "left", fontWeight: 700, color: "#475569" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lastResult.data && lastResult.data.length > 0 ? (
                      lastResult.data.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} style={{ padding: "12px 18px", color: "#1e293b" }}>
                              {String(val ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
                          Query executed successfully. 0 rows returned.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Feedback & Tagline Footer */}
          <div style={{ 
            padding: "16px 24px", 
            borderTop: "1px solid #e2e8f0", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            background: "#fafafa",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <span style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#64748b", fontWeight: 500 }}>
              &ldquo;No SQL required — just ask your data.&rdquo;
            </span>

            {/* Was this result correct? */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                Was this result correct?
              </span>
              <button
                onClick={() => {
                  setFeedbackSent("positive");
                  onFeedback(lastResult.id, "positive");
                }}
                style={{
                  background: feedbackSent === "positive" ? "#dcfce7" : "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: feedbackSent === "positive" ? "#16a34a" : "#475569"
                }}
              >
                <ThumbsUp size={14} /> Yes
              </button>
              <button
                onClick={() => {
                  setFeedbackSent("negative");
                  onFeedback(lastResult.id, "negative");
                }}
                style={{
                  background: feedbackSent === "negative" ? "#fee2e2" : "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: feedbackSent === "negative" ? "#dc2626" : "#475569"
                }}
              >
                <ThumbsDown size={14} /> No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
