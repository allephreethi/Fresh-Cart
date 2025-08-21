const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { sql, config } = require("./config"); // SQL Server config

// ===== Import Routes =====
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addresses");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const helpRequestRoutes = require("./routes/helpRequest");
const ordersRoutes = require("./routes/orders"); // Orders route for checkout

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== Debug Middleware (Logs Every Request) =====
app.use((req, res, next) => {
  console.log(`➡️ Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// ===== Static folder for profile pictures =====
app.use("/uploads/profile", express.static(path.join(__dirname, "uploads/profile")));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
console.log("✅ Wishlist routes mounted at /api/wishlist");

app.use("/api/help-request", helpRequestRoutes);
console.log("✅ Help Request routes mounted at /api/help-request");

app.use("/api/orders", ordersRoutes);
console.log("✅ Orders routes mounted at /api/orders");

// ===== Root endpoint =====
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ===== Test SQL Server Connection =====
sql.connect(config)
  .then(pool => {
    if (pool.connected) console.log("✅ Connected to SQL Server");
  })
  .catch(err => console.error("❌ Database connection failed:", err));

// ===== 404 Handler =====
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
