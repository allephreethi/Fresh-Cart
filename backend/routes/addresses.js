// routes/addresses.js
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const { config } = require("../config");

// ============================
// 📌 Get all addresses for a user
// ============================
router.get("/user/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) 
    return res.status(400).json({ error: "Invalid userId" });

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT * FROM Addresses WHERE userId = @userId ORDER BY createdAt DESC");

    return res.status(200).json(result.recordset || []);
  } catch (err) {
    console.error("❌ Error fetching addresses:", err);
    return res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// ============================
// 📌 Add a new address
// ============================
router.post("/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) 
    return res.status(400).json({ error: "Invalid userId" });

  const { fullName, label, street, city, state, postalCode, country } = req.body;
  if (!fullName?.trim() || !street?.trim() || !postalCode?.trim()) {
    return res.status(400).json({ error: "Full name, street, and postal code are required" });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("fullName", sql.NVarChar(150), fullName.trim())
      .input("label", sql.NVarChar(50), label?.trim() || "Home")
      .input("street", sql.NVarChar(255), street.trim())
      .input("city", sql.NVarChar(100), city?.trim() || "")
      .input("state", sql.NVarChar(100), state?.trim() || "")
      .input("postalCode", sql.NVarChar(20), postalCode.trim())
      .input("country", sql.NVarChar(100), country?.trim() || "")
      .query(`
        INSERT INTO Addresses 
          (userId, fullName, label, street, city, state, postalCode, country, createdAt, updatedAt)
        OUTPUT INSERTED.id
        VALUES 
          (@userId, @fullName, @label, @street, @city, @state, @postalCode, @country, GETDATE(), GETDATE())
      `);

    return res.status(201).json({
      message: "✅ Address added successfully",
      id: result.recordset[0]?.id,
    });
  } catch (err) {
    console.error("❌ Error adding address:", err);
    return res.status(500).json({ error: "Failed to add address" });
  }
});

// ============================
// 📌 Update an address
// ============================
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) 
    return res.status(400).json({ error: "Invalid address id" });

  const { fullName, label, street, city, state, postalCode, country } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("fullName", sql.NVarChar(150), fullName?.trim() || "")
      .input("label", sql.NVarChar(50), label?.trim() || "Home")
      .input("street", sql.NVarChar(255), street?.trim() || "")
      .input("city", sql.NVarChar(100), city?.trim() || "")
      .input("state", sql.NVarChar(100), state?.trim() || "")
      .input("postalCode", sql.NVarChar(20), postalCode?.trim() || "")
      .input("country", sql.NVarChar(100), country?.trim() || "")
      .query(`
        UPDATE Addresses
        SET fullName = @fullName,
            label = @label,
            street = @street,
            city = @city,
            state = @state,
            postalCode = @postalCode,
            country = @country,
            updatedAt = GETDATE()
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    return res.json({ message: "✅ Address updated successfully" });
  } catch (err) {
    console.error("❌ Error updating address:", err);
    return res.status(500).json({ error: "Failed to update address" });
  }
});

// ============================
// 📌 Delete an address
// ============================
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) 
    return res.status(400).json({ error: "Invalid address id" });

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Addresses WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    return res.json({ message: "🗑️ Address deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting address:", err);
    return res.status(500).json({ error: "Failed to delete address" });
  }
});

module.exports = router;
