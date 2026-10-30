import React, { useState } from "react";
import { Database, Table, Key, Plus, FileText, Eye, Check } from "lucide-react";

export const SchemaExplorer = ({ databases, activeDbId, onSwitchDb }) => {
  const currentDb = databases[activeDbId];
  const tableNames = Object.keys(currentDb.tables);
  const [selectedTable, setSelectedTable] = useState(tableNames[0]);
  const [activeTab, setActiveTab] = useState("columns"); // 'columns' | 'relationships' | 'preview'

  const currentTable = currentDb.tables[selectedTable] || currentDb.tables[tableNames[0]];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>Schema Explorer</h1>
          <p style={{ color: "#64748b", fontSize: "0.92rem", marginTop: "4px" }}>
            View tables, data types, relationships, and raw table schemas.
          </p>
        </div>

        {/* Database selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "8px 16px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
          <Database size={16} color="#2563eb" />
          <select 
            value={activeDbId} 
            onChange={(e) => {
              onSwitchDb(e.target.value);
              const nextDb = databases[e.target.value];
              setSelectedTable(Object.keys(nextDb.tables)[0]);
            }}
            style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "0.9rem", color: "#0f172a", outline: "none" }}
          >
            {Object.values(databases).map(db => (
              <option key={db.id} value={db.id}>{db.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout: Tables List (Left) + Schema Details (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
        {/* Left: Tables list */}
        <div className="neo-card" style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", padding: "0 8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tables</span>
            <span className="badge badge-blue">{tableNames.length}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {tableNames.map(tName => {
              const tbl = currentDb.tables[tName];
              const isSelected = selectedTable === tName;
              return (
                <button
                  key={tName}
                  onClick={() => setSelectedTable(tName)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: isSelected ? "#2563eb" : "transparent",
                    color: isSelected ? "#ffffff" : "#334155",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Table size={16} color={isSelected ? "#ffffff" : "#64748b"} />
                    <span>{tName}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{tbl.rows.length} rows</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Table Schema Details */}
        <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header tabs */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Table: {currentTable.name}</h3>
              <p style={{ fontSize: "0.82rem", color: "#64748b" }}>{currentTable.description}</p>
            </div>

            <div style={{ background: "#f1f5f9", padding: "4px", borderRadius: "10px", display: "flex", gap: "4px" }}>
              <button
                onClick={() => setActiveTab("columns")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  background: activeTab === "columns" ? "#ffffff" : "transparent",
                  color: activeTab === "columns" ? "#2563eb" : "#64748b"
                }}
              >
                Columns ({currentTable.schema.length})
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  background: activeTab === "preview" ? "#ffffff" : "transparent",
                  color: activeTab === "preview" ? "#2563eb" : "#64748b"
                }}
              >
                Preview Data ({currentTable.rows.length})
              </button>
              <button
                onClick={() => setActiveTab("relationships")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  background: activeTab === "relationships" ? "#ffffff" : "transparent",
                  color: activeTab === "relationships" ? "#2563eb" : "#64748b"
                }}
              >
                Relationships
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "columns" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <tr>
                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Column</th>
                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Type</th>
                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Nullable</th>
                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: 700, color: "#475569" }}>Key</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTable.schema.map((col, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 20px", fontWeight: 600, color: "#1e293b" }}>{col.name}</td>
                      <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", color: "#2563eb" }}>{col.type}</td>
                      <td style={{ padding: "12px 20px", color: "#64748b" }}>{col.nullable}</td>
                      <td style={{ padding: "12px 20px" }}>
                        {col.key === "PK" && (
                          <span className="badge badge-yellow" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Key size={12} /> Primary Key
                          </span>
                        )}
                        {col.key === "FK" && (
                          <span className="badge badge-purple" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            Foreign Key
                          </span>
                        )}
                        {!col.key && <span style={{ color: "#cbd5e1" }}>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "preview" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <tr>
                    {currentTable.schema.map(c => (
                      <th key={c.name} style={{ padding: "12px 18px", textAlign: "left", fontWeight: 700, color: "#475569" }}>
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {currentTable.schema.map(c => (
                        <td key={c.name} style={{ padding: "12px 18px", color: "#1e293b" }}>
                          {String(row[c.name] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "relationships" && (
            <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
              <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Foreign Key Mappings & ER Diagram</p>
              <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
                {activeDbId === "students_db" ? 
                  "placements.student_id references students.id (1-to-many relationship)." :
                  "sales.product_id references products.product_id, and sales.customer_id references customers.customer_id."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
