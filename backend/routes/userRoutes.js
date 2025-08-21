const express = require("express");
const router = express.Router();
const { sql, config } = require("../config"); // your SQL Server config
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const SALT_ROUNDS = 10;

// ===== Multer setup for profile pictures =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/profile"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===== GET User by ID =====
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .query("SELECT id, name, email, profileImage FROM Users WHERE id = @id");

    if (!result.recordset.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== UPDATE User Profile =====
router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request().input("id", sql.Int, userId);

    // ===== Add fields to update =====
    let query = "UPDATE Users SET ";
    const updates = [];

    if (name) {
      request.input("name", sql.NVarChar(100), name);
      updates.push("name=@name");
    }
    if (email) {
      request.input("email", sql.NVarChar(255), email);
      updates.push("email=@email");
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      request.input("password", sql.VarChar(255), hashedPassword);
      updates.push("password=@password");
    }
    if (req.file) {
      request.input("profileImage", sql.NVarChar(255), req.file.filename);
      updates.push("profileImage=@profileImage");
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    query += updates.join(", ") + " WHERE id=@id";

    await request.query(query);

    // ===== Fetch updated user =====
    const updatedUser = await pool.request()
      .input("id", sql.Int, userId)
      .query("SELECT id, name, email, profileImage FROM Users WHERE id=@id");

    res.json({ user: updatedUser.recordset[0] });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
