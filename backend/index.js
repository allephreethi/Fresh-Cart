const express = require("express");
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== DB config & connect =====
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: false }
};

sql.connect(dbConfig)
  .then(pool => {
    if (pool.connected) console.log("✅ Connected to SQL Server");
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// ===== Request logger =====
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ===== Routes =====
app.use("/api/users", require("./routes/userRoutes"));

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
