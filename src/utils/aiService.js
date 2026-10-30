// Gemini API and Fallback Natural Language to SQL converter

const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const convertQueryToSql = async (naturalQuery, activeDb, apiKeyOverride = "") => {
  const apiKey = apiKeyOverride.trim() || localStorage.getItem("neo_gemini_api_key") || DEFAULT_GEMINI_KEY;

  // Build schema context string
  const tablesInfo = Object.values(activeDb.tables).map(t => {
    const colList = t.schema.map(c => `${c.name} (${c.type})`).join(", ");
    return `Table: ${t.name} (Columns: ${colList})`;
  }).join("\n");

  const promptText = `
You are an expert SQL Generator.
Active Database: "${activeDb.name}"
Available Tables & Schema:
${tablesInfo}

User Query in plain English: "${naturalQuery}"

Task:
1. Generate an accurate SQL query (compatible with standard SQLite / ANSI SQL).
2. Write a 1-sentence friendly explanation of what this query does.
3. Suggest the most fitting chart type if the data is numerical/aggregating: "bar", "line", "doughnut", or "none".
4. Determine which columns should serve as the label column (x-axis) and data column (y-axis).
5. If the query asks to query items that require specific values or new records, or if the user is asking to insert/filter by something specific, identify if custom values are needed.

Return ONLY a strict JSON object (no markdown fences, no raw text) with this format:
{
  "sql": "SELECT ... FROM ...",
  "explanation": "This query retrieves ...",
  "chartType": "bar",
  "chartLabelKey": "column_name_for_labels",
  "chartValueKey": "column_name_for_values"
}
`;

  try {
    if (apiKey) {
      // Call Gemini 2.5 Flash / 1.5 Flash endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 800
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanJson = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        return {
          success: true,
          sql: parsed.sql,
          explanation: parsed.explanation,
          chartType: parsed.chartType || "bar",
          chartLabelKey: parsed.chartLabelKey || null,
          chartValueKey: parsed.chartValueKey || null,
          source: "Google Gemini AI"
        };
      } else {
        console.warn("Gemini API call failed with status", response.status);
      }
    }
  } catch (err) {
    console.warn("Gemini API request failed, falling back to local semantic parser:", err);
  }

  // Robust Rule-based / Semantic Fallback Engine
  return semanticFallback(naturalQuery, activeDb);
};

// Fallback pattern parser for instant offline / no-key demo execution
function semanticFallback(query, db) {
  const q = query.toLowerCase();

  if (db.id === "students_db") {
    if (q.includes("all student") || q.includes("show students") || q.includes("list students")) {
      if (q.includes("cse")) {
        return {
          success: true,
          sql: "SELECT * FROM students WHERE department = 'CSE';",
          explanation: "Filters the students table to show only those belonging to the CSE department.",
          chartType: "bar",
          chartLabelKey: "name",
          chartValueKey: "cgpa",
          source: "Offline Semantic AI"
        };
      }
      return {
        success: true,
        sql: "SELECT * FROM students;",
        explanation: "Retrieves all student records from the students database.",
        chartType: "bar",
        chartLabelKey: "name",
        chartValueKey: "cgpa",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("count by department") || q.includes("department count") || q.includes("students in each")) {
      return {
        success: true,
        sql: "SELECT department, COUNT(*) as student_count FROM students GROUP BY department;",
        explanation: "Groups students by their department and counts the enrollment in each.",
        chartType: "doughnut",
        chartLabelKey: "department",
        chartValueKey: "student_count",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("cgpa > 8") || q.includes("cgpa greater") || q.includes("top cgpa") || q.includes("high cgpa")) {
      return {
        success: true,
        sql: "SELECT name, department, cgpa FROM students WHERE cgpa >= 8.5 ORDER BY cgpa DESC;",
        explanation: "Filters students with CGPA 8.5 or higher, sorted by highest scores.",
        chartType: "bar",
        chartLabelKey: "name",
        chartValueKey: "cgpa",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("placement") || q.includes("package") || q.includes("company")) {
      return {
        success: true,
        sql: "SELECT s.name, p.company, p.package_lpa FROM placements p JOIN students s ON p.student_id = s.id ORDER BY p.package_lpa DESC;",
        explanation: "Joins students and placements tables to display company offers and package LPA in descending order.",
        chartType: "bar",
        chartLabelKey: "company",
        chartValueKey: "package_lpa",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("faculty") || q.includes("hod")) {
      return {
        success: true,
        sql: "SELECT dept_name, hod, total_faculty FROM departments;",
        explanation: "Lists each department along with its designated Head of Department and faculty count.",
        chartType: "doughnut",
        chartLabelKey: "dept_name",
        chartValueKey: "total_faculty",
        source: "Offline Semantic AI"
      };
    }
  }

  if (db.id === "sales_db") {
    if (q.includes("region") || q.includes("sales by region")) {
      return {
        success: true,
        sql: "SELECT region, SUM(amount) AS total_sales FROM sales GROUP BY region;",
        explanation: "Aggregates total transaction amount segmented by geographical region.",
        chartType: "doughnut",
        chartLabelKey: "region",
        chartValueKey: "total_sales",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("product") || q.includes("top product")) {
      return {
        success: true,
        sql: "SELECT p.product_name, SUM(s.amount) AS total_revenue FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_name ORDER BY total_revenue DESC;",
        explanation: "Calculates total sales revenue per product by joining sales and products tables.",
        chartType: "bar",
        chartLabelKey: "product_name",
        chartValueKey: "total_revenue",
        source: "Offline Semantic AI"
      };
    }
    if (q.includes("customer")) {
      return {
        success: true,
        sql: "SELECT c.name, c.city, COUNT(s.sale_id) AS order_count FROM customers c LEFT JOIN sales s ON c.customer_id = s.customer_id GROUP BY c.name, c.city;",
        explanation: "Shows all customers along with their home city and number of orders placed.",
        chartType: "bar",
        chartLabelKey: "name",
        chartValueKey: "order_count",
        source: "Offline Semantic AI"
      };
    }
  }

  // Generic fallback query
  const firstTable = Object.keys(db.tables)[0];
  return {
    success: true,
    sql: `SELECT * FROM ${firstTable} LIMIT 10;`,
    explanation: `General preview showing the first 10 rows of the "${firstTable}" table.`,
    chartType: "none",
    chartLabelKey: null,
    chartValueKey: null,
    source: "Default Parser"
  };
}
