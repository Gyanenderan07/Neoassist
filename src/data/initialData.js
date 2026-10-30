// Clean Database Schemas - 100% empty of mock records to comply with Page 3 requirements
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
        rows: [] // Cleared 100% of mock records. Only populated by real user inserts or bulk import.
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
        rows: []
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
        rows: []
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
        rows: []
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
        rows: []
      },
      customers: {
        name: "customers",
        description: "Registered retail buyers",
        schema: [
          { name: "customer_id", type: "int4", nullable: "No", key: "PK" },
          { name: "name", type: "text", nullable: "No", key: "" },
          { name: "city", type: "text", nullable: "No", key: "" }
        ],
        rows: []
      }
    }
  }
};
