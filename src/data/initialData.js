// Initial Mock Datasets
export const INITIAL_DATABASES = {
  students_db: {
    id: "students_db",
    name: "students_db",
    description: "Academic & Placement records for College Management",
    tables: {
      students: {
        name: "students",
        description: "Student profiles, GPA, and departments",
        schema: [
          { name: "id", type: "int4", nullable: "No", key: "PK" },
          { name: "name", type: "text", nullable: "No", key: "" },
          { name: "department", type: "text", nullable: "No", key: "" },
          { name: "year", type: "int4", nullable: "No", key: "" },
          { name: "cgpa", type: "numeric", nullable: "Yes", key: "" },
          { name: "email", type: "text", nullable: "Yes", key: "" }
        ],
        rows: [
          { id: 1, name: "Arjun Kumar", department: "CSE", year: 3, cgpa: 8.7, email: "arjun.kumar@sairam.edu.in" },
          { id: 2, name: "Priya Sharma", department: "CSE", year: 3, cgpa: 9.1, email: "priya.sharma@sairam.edu.in" },
          { id: 3, name: "Karthik M", department: "CSE", year: 2, cgpa: 8.3, email: "karthik.m@sairam.edu.in" },
          { id: 4, name: "Dinesh V", department: "CSE", year: 3, cgpa: 8.0, email: "dinesh.v@sairam.edu.in" },
          { id: 5, name: "Harini P", department: "CSE", year: 4, cgpa: 9.0, email: "harini.p@sairam.edu.in" },
          { id: 6, name: "Sneha Reddy", department: "ECE", year: 2, cgpa: 8.9, email: "sneha.r@sairam.edu.in" },
          { id: 7, name: "Vijay Narayanan", department: "IT", year: 4, cgpa: 7.8, email: "vijay.n@sairam.edu.in" },
          { id: 8, name: "Ananya Iyer", department: "AIDS", year: 1, cgpa: 9.4, email: "ananya.i@sairam.edu.in" },
          { id: 9, name: "Rohit Verma", department: "MECH", year: 3, cgpa: 7.5, email: "rohit.v@sairam.edu.in" },
          { id: 10, name: "Meera Krishnan", department: "ECE", year: 4, cgpa: 8.8, email: "meera.k@sairam.edu.in" },
          { id: 11, name: "Gautham S", department: "CSE", year: 2, cgpa: 8.5, email: "gautham.s@sairam.edu.in" },
          { id: 12, name: "Divya Balaji", department: "IT", year: 3, cgpa: 9.2, email: "divya.b@sairam.edu.in" }
        ]
      },
      departments: {
        name: "departments",
        description: "Academic departments & faculty counts",
        schema: [
          { name: "dept_id", type: "int4", nullable: "No", key: "PK" },
          { name: "dept_name", type: "text", nullable: "No", key: "" },
          { name: "hod", type: "text", nullable: "Yes", key: "" },
          { name: "total_faculty", type: "int4", nullable: "No", key: "" }
        ],
        rows: [
          { dept_id: 101, dept_name: "CSE", hod: "Dr. K. Swaminathan", total_faculty: 24 },
          { dept_id: 102, dept_name: "ECE", hod: "Dr. R. Meenakshi", total_faculty: 18 },
          { dept_id: 103, dept_name: "IT", hod: "Dr. S. Sundararajan", total_faculty: 16 },
          { dept_id: 104, dept_name: "AIDS", hod: "Dr. V. Kavitha", total_faculty: 12 },
          { dept_id: 105, dept_name: "MECH", hod: "Dr. M. Prakash", total_faculty: 15 }
        ]
      },
      placements: {
        name: "placements",
        description: "Student placement offers and package (LPA)",
        schema: [
          { name: "placement_id", type: "int4", nullable: "No", key: "PK" },
          { name: "student_id", type: "int4", nullable: "No", key: "FK" },
          { name: "company", type: "text", nullable: "No", key: "" },
          { name: "package_lpa", type: "numeric", nullable: "No", key: "" },
          { name: "year", type: "int4", nullable: "No", key: "" }
        ],
        rows: [
          { placement_id: 1, student_id: 5, company: "Google", package_lpa: 32.5, year: 2026 },
          { placement_id: 2, student_id: 7, company: "Amazon", package_lpa: 28.0, year: 2026 },
          { placement_id: 3, student_id: 10, company: "Qualcomm", package_lpa: 21.0, year: 2026 },
          { placement_id: 4, student_id: 2, company: "Microsoft", package_lpa: 26.5, year: 2026 },
          { placement_id: 5, student_id: 1, company: "TCS Digital", package_lpa: 9.0, year: 2026 }
        ]
      }
    }
  },
  sales_db: {
    id: "sales_db",
    name: "sales_db",
    description: "Enterprise Sales, Products and Customer Demographics",
    tables: {
      sales: {
        name: "sales",
        description: "Transaction records",
        schema: [
          { name: "sale_id", type: "int4", nullable: "No", key: "PK" },
          { name: "product_id", type: "int4", nullable: "No", key: "FK" },
          { name: "customer_id", type: "int4", nullable: "No", key: "FK" },
          { name: "region", type: "text", nullable: "No", key: "" },
          { name: "amount", type: "numeric", nullable: "No", key: "" },
          { name: "date", type: "text", nullable: "No", key: "" }
        ],
        rows: [
          { sale_id: 101, product_id: 1, customer_id: 201, region: "North", amount: 1250, date: "2026-10-15" },
          { sale_id: 102, product_id: 2, customer_id: 202, region: "South", amount: 2400, date: "2026-10-16" },
          { sale_id: 103, product_id: 1, customer_id: 203, region: "East", amount: 980, date: "2026-10-18" },
          { sale_id: 104, product_id: 3, customer_id: 201, region: "West", amount: 3100, date: "2026-10-19" },
          { sale_id: 105, product_id: 2, customer_id: 204, region: "North", amount: 1850, date: "2026-10-21" },
          { sale_id: 106, product_id: 3, customer_id: 205, region: "South", amount: 4200, date: "2026-10-22" }
        ]
      },
      products: {
        name: "products",
        description: "Catalog of merchandise",
        schema: [
          { name: "product_id", type: "int4", nullable: "No", key: "PK" },
          { name: "product_name", type: "text", nullable: "No", key: "" },
          { name: "category", type: "text", nullable: "No", key: "" },
          { name: "price", type: "numeric", nullable: "No", key: "" }
        ],
        rows: [
          { product_id: 1, product_name: "MacBook Pro M3", category: "Hardware", price: 1999 },
          { product_id: 2, product_name: "Dell UltraSharp 4K", category: "Monitors", price: 650 },
          { product_id: 3, product_name: "Logitech MX Master", category: "Accessories", price: 120 }
        ]
      },
      customers: {
        name: "customers",
        description: "Registered retail buyers",
        schema: [
          { name: "customer_id", type: "int4", nullable: "No", key: "PK" },
          { name: "name", type: "text", nullable: "No", key: "" },
          { name: "city", type: "text", nullable: "No", key: "" }
        ],
        rows: [
          { customer_id: 201, name: "Alex Miller", city: "New York" },
          { customer_id: 202, name: "Sophia Chen", city: "San Francisco" },
          { customer_id: 203, name: "Liam Johnson", city: "Chicago" },
          { customer_id: 204, name: "Emma Watson", city: "Austin" },
          { customer_id: 205, name: "Noah Davis", city: "Seattle" }
        ]
      }
    }
  }
};
