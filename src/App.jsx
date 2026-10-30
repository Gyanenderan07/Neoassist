import React, { useState, useEffect } from "react";
import { 
  Home, 
  Terminal, 
  Clock, 
  Bookmark, 
  Database, 
  BarChart2, 
  Settings, 
  Layers, 
  Sparkles,
  ShieldCheck,
  FileSpreadsheet
} from "lucide-react";

// Components
import { LandingPage } from "./components/LandingPage";
import { DashboardMain } from "./components/DashboardMain";
import { QueryWorkspace } from "./components/QueryWorkspace";
import { DataStudio } from "./components/DataStudio";
import { SchemaExplorer } from "./components/SchemaExplorer";
import { HistoryAndSaved } from "./components/HistoryAndSaved";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsAndDeploy } from "./components/SettingsAndDeploy";
import { AuthModal } from "./components/AuthModal";

// Utilities & Data
import { INITIAL_DATABASES } from "./data/initialData";
import { runSqlQuery } from "./utils/sqlEngine";
import { convertQueryToSql } from "./utils/aiService";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import confetti from "canvas-confetti";

export default function App() {
  // Navigation State: 'landing' | 'dashboard' | 'query' | 'datastudio' | 'schema' | 'history' | 'analytics' | 'settings'
  const [currentView, setCurrentView] = useState("dashboard");

  // Persistent Databases State (Starts 100% clean without mock rows)
  const [databases, setDatabases] = useState(() => {
    const saved = localStorage.getItem("neo_databases_v2");
    return saved ? JSON.parse(saved) : INITIAL_DATABASES;
  });

  const [activeDbId, setActiveDbId] = useState("students_db");

  // Query Workspace State - Starts blank as requested in Page 4
  const [naturalQuery, setNaturalQuery] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // History & Saved Queries State - Starts empty without hardcoded mock items as requested in Page 2
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("neo_history_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [savedQueries, setSavedQueries] = useState(() => {
    const saved = localStorage.getItem("neo_saved_queries_v2");
    return saved ? JSON.parse(saved) : [];
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Synchronize state changes to localStorage immediately (Page 5 requirement)
  useEffect(() => {
    localStorage.setItem("neo_databases_v2", JSON.stringify(databases));
  }, [databases]);

  useEffect(() => {
    localStorage.setItem("neo_history_v2", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("neo_saved_queries_v2", JSON.stringify(savedQueries));
  }, [savedQueries]);

  // Voice Recognition for Main Query Bar
  const { isListening, toggleListening } = useVoiceRecognition((text) => {
    setNaturalQuery(text);
    handleExecuteQuery(text);
  });

  // Core Natural Language to SQL Execution Pipeline
  const handleExecuteQuery = async (queryTextOverride = null) => {
    const queryToRun = (queryTextOverride || naturalQuery).trim();
    if (!queryToRun) return;

    setIsLoading(true);
    setCurrentView("query");

    try {
      const activeDb = databases[activeDbId] || databases["students_db"];
      
      // Step 1: AI Translation
      const aiResponse = await convertQueryToSql(queryToRun, activeDb);

      // Step 2: Database Execution
      const execution = runSqlQuery(aiResponse.sql, activeDb);

      const resultObj = {
        id: `res_${Date.now()}`,
        query: queryToRun,
        sql: aiResponse.sql,
        explanation: aiResponse.explanation,
        data: execution.data,
        rowCount: execution.rowCount,
        error: execution.error,
        success: execution.success,
        chartType: aiResponse.chartType,
        chartLabelKey: aiResponse.chartLabelKey,
        chartValueKey: aiResponse.chartValueKey,
        source: aiResponse.source,
        timestamp: Date.now()
      };

      setLastResult(resultObj);

      // Log exclusively real executed query into history
      setHistory(prev => [resultObj, ...prev]);

      if (execution.success && execution.rowCount > 0) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 }, colors: ['#C85A32', '#2D5A46', '#D4A373'] });
      }
    } catch (err) {
      console.error("Execution failed:", err);
      const errObj = {
        id: `err_${Date.now()}`,
        query: queryToRun,
        sql: "-- Execution Error",
        explanation: "Unable to execute query against database",
        data: [],
        rowCount: 0,
        error: err.message,
        success: false,
        timestamp: Date.now()
      };
      setLastResult(errObj);
      setHistory(prev => [errObj, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentQuery = (queryObj) => {
    if (!queryObj) return;
    const exists = savedQueries.some(s => s.query.toLowerCase() === queryObj.query.toLowerCase());
    if (exists) {
      alert("This query is already in your Saved Queries!");
      return;
    }

    const newSaved = {
      id: `saved_${Date.now()}`,
      title: queryObj.query.length > 25 ? `${queryObj.query.slice(0, 25)}...` : queryObj.query,
      query: queryObj.query,
      sql: queryObj.sql
    };

    setSavedQueries(prev => [newSaved, ...prev]);
    alert("Query successfully saved to bookmarks!");
  };

  const handleFeedback = (resultId, type) => {
    setHistory(prev => prev.map(item => {
      if (item.id === resultId) {
        return { ...item, feedback: type };
      }
      return item;
    }));
  };

  const handleResetDemoData = () => {
    setDatabases(INITIAL_DATABASES);
    setHistory([]);
    setSavedQueries([]);
    setLastResult(null);
    setNaturalQuery("");
    localStorage.removeItem("neo_databases_v2");
    localStorage.removeItem("neo_history_v2");
    localStorage.removeItem("neo_saved_queries_v2");
  };

  // Bulk import callback from Query Studio or DataStudio
  const handleBulkImportSuccess = (targetTableName, headers, rows) => {
    const currentDb = databases[activeDbId] || databases["students_db"];
    const table = currentDb.tables[targetTableName];
    if (!table) return;

    // Expand schema if new columns exist
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

    alert(`Successfully imported ${rows.length} rows into "${targetTableName}"!`);
  };

  // Sidebar navigation items
  const navItems = [
    { id: "landing", label: "Home (Landing)", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: Sparkles },
    { id: "query", label: "Query Studio", icon: Terminal },
    { id: "datastudio", label: "Data & Containers", icon: Layers },
    { id: "schema", label: "Schema Explorer", icon: Database },
    { id: "history", label: "History & Logs", icon: Clock },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "Settings & Deploy", icon: Settings }
  ];

  return (
    <div className="app-container">
      {/* Warm Contemporary Studio Sidebar */}
      <aside className="sidebar">
        {/* Brand Logo with Nura Typography */}
        <div 
          onClick={() => setCurrentView("landing")}
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", cursor: "pointer", paddingLeft: "6px" }}
        >
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "10px", 
            background: "linear-gradient(135deg, var(--primary-terracotta) 0%, var(--primary-terracotta-hover) 100%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "white" 
          }}>
            <Database size={20} />
          </div>
          <div className="logo-text">
            <div className="brand-nura" style={{ fontSize: "1.15rem", color: "var(--text-espresso)", letterSpacing: "-0.5px" }}>
              NEOASSIST
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-slate-taupe)", fontWeight: 600 }}>
              Natural SQL Studio
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: isActive ? "var(--primary-terracotta)" : "transparent",
                  color: isActive ? "#FFFFFF" : "var(--sidebar-text)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "var(--sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={18} color={isActive ? "#FFFFFF" : "var(--sidebar-text)"} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Studio Status Pill */}
        <div style={{ 
          background: "#FFFFFF", 
          borderRadius: "var(--radius-md)", 
          border: "1px solid var(--sidebar-border)",
          padding: "12px 14px", 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-sage-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={18} color="var(--accent-sage)" />
          </div>
          <div className="nav-label">
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-espresso)" }}>Security Enabled</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-slate-taupe)" }}>Credentials Protected</div>
          </div>
        </div>

        {/* User Mini Profile */}
        <div style={{ 
          borderTop: "1px solid var(--sidebar-border)", 
          paddingTop: "14px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between" 
        }}>
          <div 
            onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <div style={{ 
              width: "36px", 
              height: "36px", 
              borderRadius: "50%", 
              background: "var(--primary-terracotta)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontWeight: 800, 
              fontSize: "0.85rem" 
            }}>
              G
            </div>
            <div className="user-info">
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-espresso)" }}>Gyanenderan</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-slate-taupe)" }}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* View Routing */}
        {currentView === "landing" && (
          <LandingPage 
            onGetStarted={() => setCurrentView("dashboard")}
            onTryQuery={(q) => {
              setNaturalQuery(q);
              handleExecuteQuery(q);
            }}
          />
        )}

        {currentView === "dashboard" && (
          <DashboardMain 
            history={history}
            savedQueries={savedQueries}
            onNavigate={(view) => setCurrentView(view)}
            naturalQuery={naturalQuery}
            setNaturalQuery={setNaturalQuery}
            toggleListening={toggleListening}
            isListening={isListening}
            onQuickRun={(q) => {
              setNaturalQuery(q);
              handleExecuteQuery(q);
            }}
          />
        )}

        {currentView === "query" && (
          <QueryWorkspace 
            databases={databases}
            activeDbId={activeDbId}
            onSwitchDb={(id) => setActiveDbId(id)}
            naturalQuery={naturalQuery}
            setNaturalQuery={setNaturalQuery}
            isListening={isListening}
            toggleListening={toggleListening}
            onGenerateAndRun={() => handleExecuteQuery()}
            lastResult={lastResult}
            isLoading={isLoading}
            onSaveQuery={handleSaveCurrentQuery}
            onFeedback={handleFeedback}
            savedQueries={savedQueries}
            onOpenDataStudio={() => setCurrentView("datastudio")}
            onBulkImportSuccess={handleBulkImportSuccess}
          />
        )}

        {currentView === "datastudio" && (
          <DataStudio 
            databases={databases}
            activeDbId={activeDbId}
            setDatabases={setDatabases}
            onSwitchDb={(id) => setActiveDbId(id)}
          />
        )}

        {currentView === "schema" && (
          <SchemaExplorer 
            databases={databases}
            activeDbId={activeDbId}
            onSwitchDb={(id) => setActiveDbId(id)}
          />
        )}

        {currentView === "history" && (
          <HistoryAndSaved 
            history={history}
            savedQueries={savedQueries}
            onRunQuery={(q) => {
              setNaturalQuery(q);
              handleExecuteQuery(q);
            }}
            onClearHistory={() => setHistory([])}
            onRemoveSaved={(idx) => {
              const updated = [...savedQueries];
              updated.splice(idx, 1);
              setSavedQueries(updated);
            }}
          />
        )}

        {currentView === "analytics" && (
          <AnalyticsView history={history} />
        )}

        {currentView === "settings" && (
          <SettingsAndDeploy 
            databases={databases}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Login & Sign Up Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  );
}
