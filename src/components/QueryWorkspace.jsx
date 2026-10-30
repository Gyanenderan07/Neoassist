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
  ArrowRight,
  FileSpreadsheet,
  Terminal
} from "lucide-react";
import { ChartRenderer } from "./ChartRenderer";
import { BulkImportModal } from "./BulkImportModal";

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
  onOpenDataStudio,
  onBulkImportSuccess
}) => {
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'chart'
  const [copied, setCopied] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

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
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-espresso)", letterSpacing: "-0.5px" }}>
            Query Studio
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", marginTop: "4px", fontSize: "0.95rem" }}>
            Ask in plain English or speak your query. Instant translation into optimized SQL with dynamic tables and charts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Active Database selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", padding: "6px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--card-border)" }}>
            <Database size={16} color="var(--primary-terracotta)" />
            <select
              value={activeDbId}
              onChange={(e) => onSwitchDb(e.target.value)}
              style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "0.88rem", color: "var(--text-espresso)", outline: "none", cursor: "pointer" }}
            >
              {Object.values(databases).map(db => (
                <option key={db.id} value={db.id}>{db.name}</option>
              ))}
            </select>
          </div>

          <button className="btn-sage" onClick={() => setShowBulkImport(true)}>
            <FileSpreadsheet size={15} /> Bulk Import Sheets
          </button>

          <button className="btn-secondary" onClick={onOpenDataStudio}>
            View Records <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Query Input Card - Blank start with intuitive dynamic placeholder (Page 4 requirement) */}
      <div className="neo-card" style={{ padding: "24px" }}>
        <form onSubmit={(e) => { e.preventDefault(); onGenerateAndRun(); }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ 
              flex: 1, 
              display: "flex", 
              alignItems: "center", 
              background: "var(--bg-cream)", 
              border: "1.5px solid var(--card-border)", 
              borderRadius: "var(--radius-md)", 
              padding: "6px 16px",
              boxShadow: "inset 0 2px 4px rgba(44,38,29,0.02)"
            }}>
              <input
                type="text"
                placeholder='e.g., "Add 5 new students in AIDS department" or "Show all records where cgpa > 8.5"...'
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "10px 0",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "1.02rem",
                  fontWeight: 600,
                  color: "var(--text-espresso)",
                  fontFamily: "var(--font-main)"
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

        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-slate-taupe)" }}>
            Tip: Speak or type query instructions. Results and chart visualizations are generated automatically.
          </span>
          <span className="badge badge-sand">
            <Terminal size={12} /> SQL Engine Ready
          </span>
        </div>
      </div>

      {/* Generated SQL Section */}
      {lastResult?.sql && (
        <div className="neo-card" style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-espresso)" }}>Generated SQL</h3>
              <span className="badge badge-sage">{lastResult.source || "Google Gemini AI"}</span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-secondary" onClick={handleCopy} style={{ padding: "6px 12px", fontSize: "0.82rem" }}>
                {copied ? <><Check size={14} color="var(--accent-sage)" /> Copied</> : <><Copy size={14} /> Copy SQL</>}
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
            <div style={{ marginTop: "12px", padding: "10px 14px", background: "var(--bg-linen)", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <HelpCircle size={16} color="var(--primary-terracotta)" />
              <span style={{ fontSize: "0.86rem", color: "var(--text-slate-taupe)" }}>{lastResult.explanation}</span>
            </div>
          )}
        </div>
      )}

      {/* Query Result Section */}
      {lastResult && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ 
            padding: "18px 24px", 
            borderBottom: "1px solid var(--card-border)", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            background: "#FFFFFF"
          }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-espresso)" }}>Query Result</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-slate-taupe)" }}>
                Results for: &ldquo;{lastResult.query}&rdquo; ({lastResult.rowCount} records returned)
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "var(--bg-linen)", padding: "4px", borderRadius: "var(--radius-sm)", display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setActiveTab("table")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: activeTab === "table" ? "#FFFFFF" : "transparent",
                    color: activeTab === "table" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
                    boxShadow: activeTab === "table" ? "0 2px 4px rgba(44,38,29,0.06)" : "none"
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
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: activeTab === "chart" ? "#FFFFFF" : "transparent",
                    color: activeTab === "chart" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
                    boxShadow: activeTab === "chart" ? "0 2px 4px rgba(44,38,29,0.06)" : "none"
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

          <div style={{ padding: activeTab === "chart" ? "24px" : "0" }}>
            {lastResult.error ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#C53B34" }}>
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
                <table>
                  <thead>
                    <tr>
                      {lastResult.data && lastResult.data[0] && Object.keys(lastResult.data[0]).map(col => (
                        <th key={col} style={{ padding: "12px 18px", textAlign: "left" }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lastResult.data && lastResult.data.length > 0 ? (
                      lastResult.data.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} style={{ padding: "12px 18px", color: "var(--text-espresso)" }}>
                              {String(val ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                          Query executed successfully. 0 rows returned for this criteria.
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
            borderTop: "1px solid var(--card-border)", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            background: "var(--bg-linen)",
            flexWrap: "wrap",
            gap: "12px"
          }}>
            <span style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-slate-taupe)", fontWeight: 600 }}>
              &ldquo;No SQL required — just ask your data.&rdquo;
            </span>

            {/* Was this result correct? */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)" }}>
                Was this result correct?
              </span>
              <button
                onClick={() => {
                  setFeedbackSent("positive");
                  onFeedback(lastResult.id, "positive");
                }}
                style={{
                  background: feedbackSent === "positive" ? "var(--accent-sage-light)" : "#FFFFFF",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: feedbackSent === "positive" ? "var(--accent-sage)" : "var(--text-slate-taupe)"
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
                  background: feedbackSent === "negative" ? "#FEECEB" : "#FFFFFF",
                  border: "1px solid var(--card-border)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: feedbackSent === "negative" ? "#C53B34" : "var(--text-slate-taupe)"
                }}
              >
                <ThumbsDown size={14} /> No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        databases={databases}
        activeDbId={activeDbId}
        onImportSuccess={onBulkImportSuccess}
      />
    </div>
  );
};
