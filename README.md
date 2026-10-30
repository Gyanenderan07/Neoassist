# NeoAssist – Databases that Speak Your Language ⚡

> **AI-Powered Natural Language to SQL Web Application**  
> Built with React + Vite, Google Gemini API, Web Speech API, Chart.js, and an in-browser Relational SQL Engine (Alasql).

---

## 🌟 Key Features

1. **Natural Language to SQL Conversion**:
   - Type or speak everyday questions in simple English (e.g. *"Show all students from CSE department"* or *"Show total sales by region"*).
   - Real-time conversion into production-grade SQL powered by Google Gemini AI (with built-in offline semantic fallback parser for 100% reliability).
   - Real SQL execution with dynamic tables, interactive charts (Bar, Line, Doughnut), row counts, and CSV export.

2. **Full Voice Dictation (Web Speech API)**:
   - Voice microphone enabled on the main query bar and **across all data insertion fields** (fulfills Prompts 2, 3 & 4).
   - Real-time voice-to-text with active microphone pulse animations.

3. **Data Insertion Studio & Customizable Containers (Prompts 4, 5 & 6)**:
   - Add real user records manually or with voice dictation (no random data).
   - Create custom containers (tables) dynamically with custom schemas and data types.
   - Delete records and customize active databases.

4. **11-Screen Modern Dashboard Layout** (matching the UI mockup):
   - **Landing Page**: 3D styled hero section, preview query simulator, and feature pills.
   - **Main Dashboard**: Real-time KPI metrics (Total Queries, Successful, Failed, Saved Queries), Quick Query Bar, Recent Queries, and 7-Day Activity Chart.
   - **Query Studio**: Dedicated console, code syntax highlighter, explanation box, accuracy feedback (👍 / 👎), and CSV download.
   - **Schema Explorer**: Interactive table definitions, column types, nullability, and primary/foreign keys.
   - **History & Saved Queries**: Searchable logs, CSV export, and bookmark management.
   - **Analytics**: Success rate gauge, latency metrics, query type distribution doughnut chart, and daily bar chart.
   - **Settings & Deploy**: Pre-loaded Google Gemini API credentials and Supabase Cloud Database guide.
   - **Auth Modal**: Non-blocking Login / Sign Up with Google and GitHub options.

---

## 🗄️ Database Schemas Included

- **`students_db`**: `students` (id, name, department, year, cgpa, email), `departments` (dept_id, dept_name, hod, total_faculty), `placements` (placement_id, student_id, company, package_lpa, year).
- **`sales_db`**: `sales` (sale_id, product_id, customer_id, region, amount, date), `products` (product_id, product_name, category, price), `customers` (customer_id, name, city).
- **Custom User Containers**: Dynamically created by you in the **Data & Containers** view!

---

## 🚀 Running the Project Locally

The application is already running live on your system:
- **Local URL**: [http://localhost:5173/](http://localhost:5173/)

To restart the server at any time:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

---

## ☁️ How to Connect a Free Cloud Database (Supabase / PostgreSQL)

If you want persistent free cloud hosting with zero cost:

1. **Create a Free Account on Supabase**:
   - Go to [supabase.com](https://supabase.com) and sign in.
   - Click **New project** &rarr; Name it `neo-assist` &rarr; Choose a region.
2. **Execute the Migration Script**:
   - Open the **SQL Editor** in your Supabase dashboard and run the SQL migration script located in the **Settings & Deploy** view of this app.
3. **Copy Your Credentials**:
   - Navigate to **Project Settings &rarr; API**.
   - Copy `Project URL` and `anon public key`.
   - Paste them into the **Settings & Deploy** page inside NeoAssist!

---

## 🤖 Prompt to Run in Antigravity to Connect Supabase Live:

If you want Antigravity to wire up direct real-time backend API calls to your live Supabase instance, run this prompt in the chat:

> *"Connect my NeoAssist app directly to my live Supabase database with URL: `<YOUR_SUPABASE_URL>` and Anon Key: `<YOUR_ANON_KEY>`. Update `sqlEngine.js` to run queries via Supabase REST API and sync data automatically."*
