import alasql from "alasql";

// Execute SQL query against a specific database in state
export const runSqlQuery = (sql, currentDatabase) => {
  try {
    // Clear and re-populate alasql memory for the active DB tables
    alasql("CREATE DATABASE IF NOT EXISTS neo_temp; USE neo_temp;");
    
    // Create tables and load in-memory rows
    Object.values(currentDatabase.tables).forEach((table) => {
      alasql(`DROP TABLE IF EXISTS ${table.name}`);
      alasql(`CREATE TABLE ${table.name}`);
      if (table.rows && table.rows.length > 0) {
        alasql.tables[table.name].data = JSON.parse(JSON.stringify(table.rows));
      } else {
        alasql.tables[table.name].data = [];
      }
    });

    // Execute query
    const results = alasql(sql);
    
    // Check if results are array of objects or number of affected records
    if (Array.isArray(results)) {
      return {
        success: true,
        data: results,
        rowCount: results.length,
        error: null
      };
    } else {
      return {
        success: true,
        data: [{ result: results }],
        rowCount: 1,
        error: null
      };
    }
  } catch (err) {
    console.error("SQL Execution Error:", err);
    return {
      success: false,
      data: [],
      rowCount: 0,
      error: err.message || "Failed to execute query"
    };
  }
};
