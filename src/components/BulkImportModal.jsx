import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Link2, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  X,
  Layers,
  Sparkles
} from "lucide-react";

export const BulkImportModal = ({ isOpen, onClose, databases, activeDbId, onImportSuccess }) => {
  const currentDb = databases[activeDbId];
  const tableNames = Object.keys(currentDb.tables);
  
  const [selectedTable, setSelectedTable] = useState(tableNames[0] || "");
  const [activeMethod, setActiveMethod] = useState("url"); // 'url' | 'paste' | 'file'
  
  // Method A state: Google Sheet URL
  const [sheetUrl, setSheetUrl] = useState("");
  // Method B state: Pasted TSV/CSV text
  const [pastedData, setPastedData] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewRows, setPreviewRows] = useState(null);

  if (!isOpen) return null;

  // Helper to parse CSV or TSV string into objects
  const parseDelimitedText = (text) => {
    const lines = text.trim().split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("Data must contain at least 1 header row and 1 data row.");
    }

    // Detect delimiter: tab or comma
    const firstLine = lines[0];
    const delimiter = firstLine.includes("\t") ? "\t" : ",";

    // Header cleaner
    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase().replace(/\s+/g, "_"));

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length > 0 && parts.some(p => p.length > 0)) {
        const rowObj = {};
        headers.forEach((header, colIdx) => {
          let val = parts[colIdx] ?? "";
          // Check if numeric
          if (!isNaN(val) && val !== "") {
            val = Number(val);
          }
          rowObj[header] = val;
        });
        rows.push(rowObj);
      }
    }
    return { headers, rows };
  };

  // Convert Google Sheet Share URL into CSV export URL
  const convertSheetUrlToCsvExport = (url) => {
    // If it's already a published CSV
    if (url.includes("output=csv") || url.endsWith(".csv")) {
      return url;
    }
    // Match spreadsheet ID: /spreadsheets/d/([a-zA-Z0-9-_]+)
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      // Default gid=0
      let gid = "0";
      const gidMatch = url.match(/[#&]gid=([0-9]+)/);
      if (gidMatch && gidMatch[1]) gid = gidMatch[1];
      return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }
    return url;
  };

  const handleFetchGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      setErrorMsg("Please enter a valid Google Sheets URL.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const exportUrl = convertSheetUrlToCsvExport(sheetUrl.trim());
      // Fetch via CORS proxy or direct
      let response;
      try {
        response = await fetch(exportUrl);
      } catch (e) {
        // Fallback using public allorigins proxy if blocked by CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(exportUrl)}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) {
        throw new Error("Unable to fetch Google Sheet. Please ensure the Google Sheet is shared with 'Anyone with the link can view'.");
      }

      const csvText = await response.text();
      const parsed = parseDelimitedText(csvText);
      setPreviewRows(parsed);
    } catch (err) {
      setErrorMsg(err.message || "Failed to parse Google Sheet. Ensure link sharing is enabled.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewPastedData = () => {
    if (!pastedData.trim()) {
      setErrorMsg("Please paste your Google Sheet or CSV data first.");
      return;
    }
    setErrorMsg("");
    try {
      const parsed = parseDelimitedText(pastedData);
      setPreviewRows(parsed);
    } catch (err) {
      setErrorMsg(err.message || "Error parsing copied data.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        const parsed = parseDelimitedText(text);
        setPreviewRows(parsed);
      } catch (err) {
        setErrorMsg("Failed to read file. Please ensure it is a valid CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    if (!previewRows || previewRows.rows.length === 0) return;

    // Send parsed records to parent database state
    onImportSuccess(selectedTable, previewRows.headers, previewRows.rows);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px", padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-sage)", fontWeight: 700, fontSize: "0.82rem", textTransform: "uppercase", marginBottom: "4px" }}>
              <FileSpreadsheet size={15} /> Bulk Data Ingestion
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--text-espresso)" }}>
              Import from Google Sheets / CSV
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-slate-taupe)", marginTop: "2px" }}>
              Bulk-insert live records directly into your tables without writing manual SQL.
            </p>
          </div>

          <button 
            onClick={onClose} 
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Table Selector */}
        <div style={{ background: "var(--bg-linen)", padding: "14px 18px", borderRadius: "var(--radius-md)", marginBottom: "22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color="var(--primary-terracotta)" />
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-espresso)" }}>Target Table:</span>
          </div>

          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--card-border)",
              background: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "var(--text-espresso)"
            }}
          >
            {tableNames.map(name => (
              <option key={name} value={name}>{name} ({currentDb.tables[name].rows.length} current rows)</option>
            ))}
          </select>
        </div>

        {/* Method Toggle Buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
          <button
            type="button"
            onClick={() => { setActiveMethod("url"); setPreviewRows(null); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: activeMethod === "url" ? "1.5px solid var(--primary-terracotta)" : "1px solid var(--card-border)",
              background: activeMethod === "url" ? "var(--primary-terracotta-light)" : "#FFFFFF",
              color: activeMethod === "url" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Link2 size={16} /> Google Sheet Share Link
          </button>

          <button
            type="button"
            onClick={() => { setActiveMethod("paste"); setPreviewRows(null); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: activeMethod === "paste" ? "1.5px solid var(--primary-terracotta)" : "1px solid var(--card-border)",
              background: activeMethod === "paste" ? "var(--primary-terracotta-light)" : "#FFFFFF",
              color: activeMethod === "paste" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <FileText size={16} /> Paste Copied Cells (TSV/CSV)
          </button>

          <button
            type="button"
            onClick={() => { setActiveMethod("file"); setPreviewRows(null); setErrorMsg(""); }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: activeMethod === "file" ? "1.5px solid var(--primary-terracotta)" : "1px solid var(--card-border)",
              background: activeMethod === "file" ? "var(--primary-terracotta-light)" : "#FFFFFF",
              color: activeMethod === "file" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Upload size={16} /> Upload CSV File
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div style={{ background: "#FEECEB", border: "1px solid #FCD3D1", color: "#C53B34", padding: "10px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Method A: Google Sheet Link Form */}
        {activeMethod === "url" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>
              Paste Google Sheets Shareable Link (Anyone with link can view):
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--card-border)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-mono)",
                  outline: "none"
                }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={handleFetchGoogleSheet}
                disabled={isProcessing}
              >
                {isProcessing ? "Fetching..." : "Fetch Sheet"}
              </button>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Tip: Click &apos;Share&apos; in Google Sheets &rarr; Change to &apos;Anyone with the link&apos; &rarr; Copy link.
            </span>
          </div>
        )}

        {/* Method B: Paste TSV/CSV cells */}
        {activeMethod === "paste" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>
              Copy rows from Google Sheets (Ctrl+C) and paste them here:
            </label>
            <textarea
              rows={5}
              placeholder={`id\tname\tdepartment\tyear\tcgpa\temail\n1\tAravind S\tCSE\t3\t8.9\taravind@sairam.edu.in\n2\tBhavana R\tECE\t4\t9.2\tbhavana@sairam.edu.in`}
              value={pastedData}
              onChange={(e) => setPastedData(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--card-border)",
                fontSize: "0.85rem",
                fontFamily: "var(--font-mono)",
                outline: "none"
              }}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={handlePreviewPastedData}
              style={{ alignSelf: "flex-start" }}
            >
              Parse Pasted Rows
            </button>
          </div>
        )}

        {/* Method C: File upload */}
        {activeMethod === "file" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>
              Upload exported CSV file:
            </label>
            <input
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={handleFileUpload}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--card-border)",
                background: "var(--bg-linen)",
                cursor: "pointer"
              }}
            />
          </div>
        )}

        {/* Data Preview */}
        {previewRows && (
          <div style={{ border: "1px solid var(--card-border)", borderRadius: "var(--radius-md)", padding: "16px", background: "var(--bg-cream)", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)" }}>
                Ready to Import: {previewRows.rows.length} records ({previewRows.headers.length} columns detected)
              </span>
              <span className="badge badge-sage">
                <Check size={12} /> Valid Format
              </span>
            </div>

            {/* Quick table preview (first 3 rows) */}
            <div style={{ maxHeight: "150px", overflowX: "auto", overflowY: "auto", background: "#FFFFFF", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)" }}>
              <table>
                <thead>
                  <tr>
                    {previewRows.headers.map(h => (
                      <th key={h} style={{ padding: "8px 12px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.rows.slice(0, 3).map((r, idx) => (
                    <tr key={idx}>
                      {previewRows.headers.map(h => (
                        <td key={h} style={{ padding: "8px 12px" }}>{String(r[h] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button type="button" className="btn-secondary" onClick={() => setPreviewRows(null)}>
                Cancel
              </button>
              <button type="button" className="btn-sage" onClick={handleCommitImport}>
                <Sparkles size={16} /> Confirm Bulk Import into &ldquo;{selectedTable}&rdquo;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
