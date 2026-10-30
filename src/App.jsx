import React, { useState, useEffect } from "react";
import { 
  Home, 
  Terminal, 
  Clock, 
  Bookmark, 
  Database, 
  Search, 
  BarChart2, 
  Settings, 
  User, 
  Layers, 
  LogOut, 
  Sparkles,
  Play,
  Bell,
  Cpu
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

  // Persistent Databases State
  const [databases, setDatabases] = useState(() => {
    const saved = localStorage.getItem("neo_databases_v1");
    return saved ? JSON.parse(saved) : INITIAL_DATABASES;
  });

  const [activeDbId, setActiveDbId] = useState("students_db");

  // Query Workspace State
  const [naturalQuery, setNaturalQuery] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // History & Saved Queries State
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("neo_history_v1");
    return saved ? JSON.parse(saved) : [
      { id: "h1", query: "Show all students from CSE", sql: "SELECT * FROM students WHERE department = 'CSE';", timestamp: Date.now() - 120000, success: true, feedback: "positive" },
      { id: "h2", query: "Count students in each department", sql: "SELECT department, COUNT(*) FROM students GROUP BY department;", timestamp: Date.now() - 720000, success: true, feedback: null },
      { id: "h3", query: "Show students with CGPA > 8", sql: "SELECT name, cgpa FROM students WHERE cgpa >= 8.5;", timestamp: Date.now() - 1800000, success: true, feedback: "positive" }
    ];
  });

  const [savedQueries, setSavedQueries] = useState(() => {
    const saved = localStorage.getItem("neo_saved_queries_v1");
    return saved ? JSON.parse(saved) : [
      { id: "s1", title: "CSE Students", query: "Show all students from the CSE department", sql: "SELECT * FROM students WHERE department = 'CSE';" },
      { id: "s2", title: "Department Count", query: "Count students in each department", sql: "SELECT department, COUNT(*) as student_count FROM students GROUP BY department;" },
      { id: "s3", title: "High CGPA", query: "Show students with CGPA > 8", sql: "SELECT name, department, cgpa FROM students WHERE cgpa >= 8.5 ORDER BY cgpa DESC;" },
      { id: "s4", title: "Placements 2026", query: "Show placement details for 2026", sql: "SELECT s.name, p.company, p.package_lpa FROM placements p JOIN students s ON p.student_id = s.id;" }
    ];
  });

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("neo_databases_v1", JSON.stringify(databases));
  }, [databases]);

  useEffect(() => {
    localStorage.setItem("neo_history_v1", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("neo_saved_queries_v1", JSON.stringify(savedQueries));
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

      // Log into history
      setHistory(prev => [resultObj, ...prev]);

      if (execution.success && execution.rowCount > 0) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error("Execution failed:", err);
      setLastResult({
        id: `err_${Date.now()}`,
        query: queryToRun,
        sql: "-- Parsing error",
        explanation: "Unable to process query",
        data: [],
        rowCount: 0,
        error: err.message,
        success: false,
        timestamp: Date.now()
      });
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
    localStorage.removeItem("neo_databases_v1");
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
      {/* Sleek Navy Sidebar matching UI Template */}
      <aside className="sidebar">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView("landing")}
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", cursor: "pointer", paddingLeft: "6px" }}
        >
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "10px", 
            background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "white" 
          }}>
            <Database size={20} />
          </div>
          <div className="logo-text">
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#ffffff", letterSpacing: "-0.5px" }}>NEO ASSIST</div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Natural SQL AI</div>
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
                  borderRadius: "12px",
                  border: "none",
                  background: isActive ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#1e293b";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={18} color={isActive ? "#ffffff" : "#94a3b8"} />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* AI Assistant Pill Footer */}
        <div style={{ 
          background: "#1e293b", 
          borderRadius: "14px", 
          padding: "12px 14px", 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37,99,235,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Cpu size={18} color="#38bdf8" />
          </div>
          <div className="nav-label">
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffffff" }}>AI Engine Active</div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Gemini & In-Memory SQL</div>
          </div>
        </div>

        {/* User Mini Profile */}
        <div style={{ 
          borderTop: "1px solid #1e293b", 
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
              background: "#3b82f6", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontWeight: 700, 
              fontSize: "0.85rem" 
            }}>
              G
            </div>
            <div className="user-info">
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f8fafc" }}>Gyanenderan</div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Sign In / Switch</div>
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
