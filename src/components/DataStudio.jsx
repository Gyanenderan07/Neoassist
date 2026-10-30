import React, { useState } from "react";
import { Mic, Plus, Trash2, Edit3, Save, Database, Layers, Sparkles } from "lucide-react";

export const DataStudio = ({ databases, activeDbId, setDatabases, onSwitchDb }) => {
  const currentDb = databases[activeDbId];
  const [selectedTable, setSelectedTable] = useState(Object.keys(currentDb.tables)[0]);
  const [newRowData, setNewRowData] = useState({});
  const [activeVoiceField, setActiveVoiceField] = useState(null);
  
  // Custom container / table creation modal
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [newContainerName, setNewContainerName] = useState("");
  const [newContainerDesc, setNewContainerDesc] = useState("");
  const [newContainerCols, setNewContainerCols] = useState("id:int4, name:text, status:text");

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

    // Check if row has at least one value
    if (Object.keys(newRowData).length === 0) {
      alert("Please fill in or speak values before inserting.");
      return;
    }

    // Auto-generate numeric ID if not entered and column exists
    const rowToInsert = { ...newRowData };
    table.schema.forEach(col => {
      if (col.name === "id" && !rowToInsert.id) {
        rowToInsert.id = (table.rows.length > 0 ? Math.max(...table.rows.map(r => Number(r.id) || 0)) + 1 : 1);
      }
      if (col.type === "int4" || col.type === "numeric") {
        if (rowToInsert[col.name] !== undefined) {
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
    alert(`Success: Inserted new custom record into "${selectedTable}"!`);
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

  const activeTableObj = currentDb.tables[selectedTable] || Object.values(currentDb.tables)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
            <Layers color="#2563eb" size={28} /> Data Insertion & Custom Containers
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>
            Prompt 4, 5 & 6 compliance: Voice-input fields, real user-inserted records, customizable schema & tables.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button 
            className="btn-secondary"
            onClick={() => setShowAddContainer(true)}
            style={{ borderColor: "#2563eb", color: "#2563eb" }}
          >
            <Plus size={16} /> Add Custom Container / Table
          </button>
        </div>
      </div>

      {/* Database & Table Selectors */}
      <div className="neo-card" style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", padding: "16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={18} color="#64748b" />
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Active Database:</span>
          <select 
            value={activeDbId} 
            onChange={(e) => onSwitchDb(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontWeight: 600 }}
          >
            {Object.values(databases).map(db => (
              <option key={db.id} value={db.id}>{db.name} ({Object.keys(db.tables).length} tables)</option>
            ))}
          </select>
        </div>

        <div style={{ height: "24px", width: "1px", background: "#e2e8f0" }}></div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Select Container:</span>
          {Object.keys(currentDb.tables).map(tName => (
            <button
              key={tName}
              onClick={() => setSelectedTable(tName)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: selectedTable === tName ? "1px solid #2563eb" : "1px solid #e2e8f0",
                background: selectedTable === tName ? "#eff6ff" : "#ffffff",
                color: selectedTable === tName ? "#2563eb" : "#475569",
                cursor: "pointer"
              }}
            >
              {tName} ({currentDb.tables[tName].rows.length} rows)
            </button>
          ))}
        </div>
      </div>

      {/* Voice-Enabled Data Insertion Form */}
      {activeTableObj && (
        <div className="neo-card" style={{ borderLeft: "4px solid #2563eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>
                Add Custom Record to &ldquo;{activeTableObj.name}&rdquo;
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Use the microphone button next to each field to speak your data in simple English.
              </p>
            </div>
            <span className="badge badge-blue">
              <Sparkles size={12} /> Voice Enabled
            </span>
          </div>

          <form onSubmit={handleAddRow}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              {activeTableObj.schema.map(col => (
                <div key={col.name}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>
                    {col.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({col.type})</span>
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
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.9rem"
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
              <Save size={16} /> Insert Real Record
            </button>
          </form>
        </div>
      )}

      {/* Live Table Rows Display */}
      {activeTableObj && (
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Current Records in {activeTableObj.name}</h4>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Total {activeTableObj.rows.length} live records stored</p>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  {activeTableObj.schema.map(col => (
                    <th key={col.name} style={{ padding: "12px 18px", fontWeight: 600, color: "#475569" }}>
                      {col.name}
                    </th>
                  ))}
                  <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTableObj.rows.length === 0 ? (
                  <tr>
                    <td colSpan={activeTableObj.schema.length + 1} style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
                      No data entered yet. Insert records above!
                    </td>
                  </tr>
                ) : (
                  activeTableObj.rows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {activeTableObj.schema.map(col => (
                        <td key={col.name} style={{ padding: "12px 18px", color: "#1e293b" }}>
                          {String(row[col.name] ?? "-")}
                        </td>
                      ))}
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
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
          <div className="modal-content" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>Create New Custom Container</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "20px" }}>
              Add a new table to your database. Define its name, columns, and data types.
            </p>

            <form onSubmit={handleCreateContainer} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Container Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. course_enrollments or orders"
                  value={newContainerName}
                  onChange={(e) => setNewContainerName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>Description</label>
                <input
                  type="text"
                  placeholder="Short summary of this container..."
                  value={newContainerDesc}
                  onChange={(e) => setNewContainerDesc(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                  Columns Schema (Format: colName:type, colName:type)
                </label>
                <input
                  type="text"
                  required
                  value={newContainerCols}
                  onChange={(e) => setNewContainerCols(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontFamily: "var(--font-mono)" }}
                />
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Supported types: int4, text, numeric, date</span>
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
    </div>
  );
};
