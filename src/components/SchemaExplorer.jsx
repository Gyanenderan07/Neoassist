import React, { useState } from "react";
import { Database, Table, Key } from "lucide-react";

export const SchemaExplorer = ({ databases, activeDbId, onSwitchDb }) => {
  const currentDb = databases[activeDbId] || databases["students_db"];
  const tableNames = Object.keys(currentDb.tables);
  const [selectedTable, setSelectedTable] = useState(tableNames[0] || "students");
  const [activeTab, setActiveTab] = useState("columns"); // 'columns' | 'relationships' | 'preview'

  const currentTable = currentDb.tables[selectedTable] || currentDb.tables[tableNames[0]];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-espresso)" }}>Schema Explorer</h1>
          <p style={{ color: "var(--text-slate-taupe)", fontSize: "0.92rem", marginTop: "4px" }}>
            Inspect table definitions, data types, keys, and live records across databases.
          </p>
        </div>

        {/* Database selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFFFFF", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--card-border)" }}>
          <Database size={16} color="var(--primary-terracotta)" />
          <select 
            value={activeDbId} 
            onChange={(e) => {
              onSwitchDb(e.target.value);
              const nextDb = databases[e.target.value];
              if (nextDb) setSelectedTable(Object.keys(nextDb.tables)[0] || "");
            }}
            style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-espresso)", outline: "none" }}
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
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-slate-taupe)", textTransform: "uppercase" }}>Tables</span>
            <span className="badge badge-terracotta">{tableNames.length}</span>
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
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: isSelected ? "var(--primary-terracotta)" : "transparent",
                    color: isSelected ? "#FFFFFF" : "var(--text-espresso)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Table size={16} color={isSelected ? "#FFFFFF" : "var(--text-slate-taupe)"} />
                    <span>{tName}</span>
                  </div>
                  <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>{tbl?.rows?.length ?? 0} rows</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Table Schema Details */}
        {currentTable && (
          <div className="neo-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-espresso)" }}>Table: {currentTable.name}</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-slate-taupe)" }}>{currentTable.description}</p>
              </div>

              <div style={{ background: "var(--bg-linen)", padding: "4px", borderRadius: "var(--radius-sm)", display: "flex", gap: "4px" }}>
                <button
                  onClick={() => setActiveTab("columns")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    background: activeTab === "columns" ? "#FFFFFF" : "transparent",
                    color: activeTab === "columns" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)"
                  }}
                >
                  Columns ({currentTable.schema.length})
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    background: activeTab === "preview" ? "#FFFFFF" : "transparent",
                    color: activeTab === "preview" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)"
                  }}
                >
                  Preview Data ({currentTable.rows.length})
                </button>
                <button
                  onClick={() => setActiveTab("relationships")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    background: activeTab === "relationships" ? "#FFFFFF" : "transparent",
                    color: activeTab === "relationships" ? "var(--primary-terracotta)" : "var(--text-slate-taupe)"
                  }}
                >
                  Relationships
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "columns" && (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px 20px", textAlign: "left" }}>Column</th>
                      <th style={{ padding: "12px 20px", textAlign: "left" }}>Type</th>
                      <th style={{ padding: "12px 20px", textAlign: "left" }}>Nullable</th>
                      <th style={{ padding: "12px 20px", textAlign: "left" }}>Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.schema.map((col, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "12px 20px", fontWeight: 700, color: "var(--text-espresso)" }}>{col.name}</td>
                        <td style={{ padding: "12px 20px", fontFamily: "var(--font-mono)", color: "var(--primary-terracotta)" }}>{col.type}</td>
                        <td style={{ padding: "12px 20px", color: "var(--text-slate-taupe)" }}>{col.nullable}</td>
                        <td style={{ padding: "12px 20px" }}>
                          {col.key === "PK" && (
                            <span className="badge badge-sand">
                              <Key size={12} /> Primary Key
                            </span>
                          )}
                          {col.key === "FK" && (
                            <span className="badge badge-sage">
                              Foreign Key
                            </span>
                          )}
                          {!col.key && <span style={{ color: "var(--text-muted)" }}>-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "preview" && (
              <div style={{ overflowX: "auto" }}>
                {currentTable.rows.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-espresso)" }}>
                      No records found in this table.
                    </p>
                    <p style={{ fontSize: "0.82rem", marginTop: "4px" }}>
                      Add records via natural language or Google Sheets bulk import.
                    </p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        {currentTable.schema.map(c => (
                          <th key={c.name} style={{ padding: "12px 18px", textAlign: "left" }}>
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentTable.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {currentTable.schema.map(c => (
                            <td key={c.name} style={{ padding: "12px 18px", color: "var(--text-espresso)" }}>
                              {String(row[c.name] ?? "-")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "relationships" && (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--text-slate-taupe)" }}>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-espresso)" }}>
                  Foreign Key Mappings & ER Diagram
                </p>
                <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
                  {activeDbId === "students_db" ? 
                    "placements.student_id references students.id (1-to-many relationship)." :
                    "sales.product_id references products.product_id, and sales.customer_id references customers.customer_id."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
