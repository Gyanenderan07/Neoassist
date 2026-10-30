import React, { useState } from "react";
import { 
  Mic, 
  Plus, 
  Trash2, 
  Save, 
  Database, 
  Layers, 
  Sparkles,
  FileSpreadsheet,
  Inbox
} from "lucide-react";
import { BulkImportModal } from "./BulkImportModal";

export const DataStudio = ({ databases, activeDbId, setDatabases, onSwitchDb }) => {
  const currentDb = databases[activeDbId] || databases["students_db"];
  const [selectedTable, setSelectedTable] = useState(Object.keys(currentDb.tables)[0] || "students");
  const [newRowData, setNewRowData] = useState({});
  const [activeVoiceField, setActiveVoiceField] = useState(null);
  
  // Custom container / table creation modal
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [newContainerName, setNewContainerName] = useState("");
  const [newContainerDesc, setNewContainerDesc] = useState("");
  const [newContainerCols, setNewContainerCols] = useState("id:int4, name:text, department:text");

  // Bulk import modal state
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Web Speech recognition for individual inputs
  const triggerVoiceForField = (fieldName) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not available on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    setActiveVoiceField(fieldName);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setNewRowData(prev => ({ ...prev, [fieldName]: text }));
      setActiveVoiceField(null);
    };

    recognition.onerror = () => setActiveVoiceField(null);
    recognition.onend = () => setActiveVoiceField(null);

    recognition.start();
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    const table = currentDb.tables[selectedTable];
    if (!table) return;

    if (Object.keys(newRowData).length === 0) {
      alert("Please fill in or speak values before inserting.");
      return;
    }

    const rowToInsert = { ...newRowData };
    table.schema.forEach(col => {
      if (col.name === "id" && !rowToInsert.id) {
        rowToInsert.id = (table.rows.length > 0 ? Math.max(...table.rows.map(r => Number(r.id) || 0)) + 1 : 1);
      }
      if (col.type === "int4" || col.type === "numeric") {
        if (rowToInsert[col.name] !== undefined && rowToInsert[col.name] !== "") {
          rowToInsert[col.name] = Number(rowToInsert[col.name]) || rowToInsert[col.name];
        }
      }
    });

    const updatedTables = {
      ...currentDb.tables,
      [selectedTable]: {
        ...table,
        rows: [rowToInsert, ...table.rows]
      }
    };

    setDatabases(prev => ({
      ...prev,
      [activeDbId]: {
        ...currentDb,
        tables: updatedTables
      }
    }));

    setNewRowData({});
  };

  const handleDeleteRow = (index) => {
    const table = currentDb.tables[selectedTable];
    const updatedRows = [...table.rows];
    updatedRows.splice(index, 1);

    setDatabases(prev => ({
      ...prev,
      [activeDbId]: {
        ...currentDb,
        tables: {
          ...currentDb.tables,
          [selectedTable]: {
            ...table,
            rows: updatedRows
          }
        }
      }
    }));
  };

  const handleCreateContainer = (e) => {
    e.preventDefault();
    if (!newContainerName.trim()) return;

    const cleanName = newContainerName.trim().toLowerCase().replace(/\s+/g, "_");
    const cols = newContainerCols.split(",").map(item => {
      const parts = item.trim().split(":");
      return {
        name: parts[0]?.trim() || "col",
        type: parts[1]?.trim() || "text",
        nullable: "Yes",
        key: parts[0]?.trim().toLowerCase() === "id" ? "PK" : ""
      };
    });

    const newTableObj = {
      name: cleanName,
      description: newContainerDesc.trim() || `User custom container ${cleanName}`,
      schema: cols,
      rows: []
    };

    setDatabases(prev => ({
      ...prev,
      [activeDbId]: {
        ...currentDb,
        tables: {
          ...currentDb.tables,
          [cleanName]: newTableObj
        }
      }
    }));

    setSelectedTable(cleanName);
    setShowAddContainer(false);
    setNewContainerName("");
    setNewContainerDesc("");
  };

  // Bulk import callback to ingest rows from Google Sheets / CSV
  const handleBulkImportSuccess = (targetTableName, headers, rows) => {
    const table = currentDb.tables[targetTableName];
    if (!table) return;

    // Expand schema if Google Sheet has new columns not in current table
    const existingColNames = table.schema.map(c => c.name.toLowerCase());
    const newSchema = [...table.schema];

    headers.forEach(h => {
      if (!existingColNames.includes(h.toLowerCase())) {
        newSchema.push({
          name: h,
          type: "text",
          nullable: "Yes",
          key: ""
        });
      }
    });

    const updatedTables = {
      ...currentDb.tables,
      [targetTableName]: {
        ...table,
        schema: newSchema,
        rows: [...rows, ...table.rows]
      }
    };

    setDatabases(prev => ({
      ...prev,
      [activeDbId]: {
        ...currentDb,
        tables: updatedTables
      }
    }));

    setSelectedTable(targetTableName);
    alert(`Successfully imported ${rows.length} rows into "${targetTableName}"!`);
  };

  const activeTableObj = currentDb.tables[selectedTable] || Object.values(currentDb.tables)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)", display: "flex", alignItems: "center", gap: "10px" }}>
            <Layers color="var(--primary-terracotta)" size={28} /> Data & Containers
          </h1>
          <p style={{ color: "var(--text-slate-taupe)", marginTop: "4px" }}>
            Real user records, voice-enabled column fields, Google Sheets bulk ingestion, and custom containers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Bulk Import Button */}
          <button 
            className="btn-sage"
            onClick={() => setShowBulkImport(true)}
          >
            <FileSpreadsheet size={16} /> Bulk Import / Google Sheets
          </button>

          <button 
            className="btn-secondary"
            onClick={() => setShowAddContainer(true)}
            style={{ borderColor: "rgba(200, 90, 50, 0.4)", color: "var(--primary-terracotta)" }}
          >
            <Plus size={16} /> Add Custom Container
          </button>
        </div>
      </div>

      {/* Database & Table Selectors */}
      <div className="neo-card" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={18} color="var(--text-slate-taupe)" />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Active Database:</span>
          <select 
            value={activeDbId} 
            onChange={(e) => {
              onSwitchDb(e.target.value);
              const nextDb = databases[e.target.value];
              if (nextDb) setSelectedTable(Object.keys(nextDb.tables)[0] || "");
            }}
            style={{ padding: "8px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontWeight: 700, color: "var(--text-espresso)", background: "#FFFFFF" }}
          >
            {Object.values(databases).map(db => (
              <option key={db.id} value={db.id}>{db.name} ({Object.keys(db.tables).length} tables)</option>
            ))}
          </select>
        </div>

        <div style={{ height: "24px", width: "1px", background: "var(--card-border)" }}></div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-slate-taupe)" }}>Select Container:</span>
          {Object.keys(currentDb.tables).map(tName => (
            <button
              key={tName}
              onClick={() => setSelectedTable(tName)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 700,
                border: selectedTable === tName ? "1.5px solid var(--primary-terracotta)" : "1px solid var(--card-border)",
                background: selectedTable === tName ? "var(--primary-terracotta-light)" : "#FFFFFF",
                color: selectedTable === tName ? "var(--primary-terracotta)" : "var(--text-slate-taupe)",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {tName} ({currentDb.tables[tName].rows.length} rows)
            </button>
          ))}
        </div>
      </div>

      {/* Voice-Enabled Data Insertion Form */}
      {activeTableObj && (
        <div className="neo-card" style={{ borderLeft: "4px solid var(--primary-terracotta)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-espresso)" }}>
                Add Record to &ldquo;{activeTableObj.name}&rdquo;
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)" }}>
                Type manually or click the microphone next to any field to speak in plain English.
              </p>
            </div>
            <span className="badge badge-terracotta">
              <Sparkles size={12} /> Voice Enabled
            </span>
          </div>

          <form onSubmit={handleAddRow}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              {activeTableObj.schema.map(col => (
                <div key={col.name}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-slate-taupe)", marginBottom: "6px" }}>
                    {col.name} <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>({col.type})</span>
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      placeholder={`Enter ${col.name}...`}
                      value={newRowData[col.name] || ""}
                      onChange={(e) => setNewRowData({ ...newRowData, [col.name]: e.target.value })}
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--card-border)",
                        fontSize: "0.9rem",
                        color: "var(--text-espresso)",
                        background: "#FFFFFF",
                        outline: "none"
                      }}
                    />
                    <button
                      type="button"
                      className={`btn-voice ${activeVoiceField === col.name ? "listening" : ""}`}
                      title={`Speak value for ${col.name}`}
                      onClick={() => triggerVoiceForField(col.name)}
                    >
                      <Mic size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary">
              <Save size={16} /> Insert Record
            </button>
          </form>
        </div>
      )}

      {/* Live Table Rows Display - Clean Empty State (Page 3 requirement) */}
      {activeTableObj && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-espresso)" }}>
                Current Records in &ldquo;{activeTableObj.name}&rdquo;
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-slate-taupe)" }}>
                {activeTableObj.rows.length === 0 
                  ? "Table is currently empty" 
                  : `${activeTableObj.rows.length} real user records stored`}
              </p>
            </div>

            {activeTableObj.rows.length === 0 && (
              <button 
                className="btn-sage"
                style={{ padding: "6px 14px", fontSize: "0.82rem" }}
                onClick={() => setShowBulkImport(true)}
              >
                <FileSpreadsheet size={14} /> Import Google Sheet
              </button>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  {activeTableObj.schema.map(col => (
                    <th key={col.name} style={{ padding: "12px 18px", textAlign: "left" }}>
                      {col.name}
                    </th>
                  ))}
                  <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTableObj.rows.length === 0 ? (
                  <tr>
                    <td colSpan={activeTableObj.schema.length + 1} style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                      <Inbox size={32} style={{ display: "block", margin: "0 auto 12px auto", opacity: 0.4 }} />
                      <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-espresso)" }}>
                        No records found in this table.
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)", marginTop: "4px" }}>
                        Add records using natural language or bulk import.
                      </p>
                    </td>
                  </tr>
                ) : (
                  activeTableObj.rows.map((row, idx) => (
                    <tr key={idx}>
                      {activeTableObj.schema.map(col => (
                        <td key={col.name} style={{ padding: "12px 18px", color: "var(--text-espresso)" }}>
                          {String(row[col.name] ?? "-")}
                        </td>
                      ))}
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          style={{ background: "transparent", border: "none", color: "#C53B34", cursor: "pointer", padding: "4px" }}
                          title="Delete row"
                        >
                          <Trash2 size={16} />
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

      {/* Add Container Modal */}
      {showAddContainer && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: "30px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-espresso)", marginBottom: "8px" }}>Create New Custom Container</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-slate-taupe)", marginBottom: "20px" }}>
              Add a new table to your database. Define its name, columns, and data types.
            </p>

            <form onSubmit={handleCreateContainer} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "6px" }}>Container Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. course_enrollments or inventory"
                  value={newContainerName}
                  onChange={(e) => setNewContainerName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "6px" }}>Description</label>
                <input
                  type="text"
                  placeholder="Short summary of this container..."
                  value={newContainerDesc}
                  onChange={(e) => setNewContainerDesc(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-espresso)", marginBottom: "6px" }}>
                  Columns Schema (Format: colName:type, colName:type)
                </label>
                <input
                  type="text"
                  required
                  value={newContainerCols}
                  onChange={(e) => setNewContainerCols(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--card-border)", fontFamily: "var(--font-mono)", outline: "none" }}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Supported types: int4, text, numeric, date</span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddContainer(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Container
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal Integration */}
      <BulkImportModal
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        databases={databases}
        activeDbId={activeDbId}
        onImportSuccess={handleBulkImportSuccess}
      />
    </div>
  );
};
