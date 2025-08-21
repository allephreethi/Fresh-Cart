// backend/routes/wishlist.js
const express = require("express");
const router = express.Router();
const { sql, config } = require("../config");

console.log("✅ Wishlist routes file loaded");

// ===== Helper: normalize SQL record to frontend-friendly keys =====
const normalizeWishlistItem = (item) => ({
  id: item.Id,
  userId: item.UserId,
  productId: item.ProductId,
  title: item.Title,
  image: item.Image,
  price: item.Price,
  createdAt: item.CreatedAt,
});

// ===== Get wishlist by user =====
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`📌 GET /wishlist for userId=${userId}`);

  try {
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.Int, parseInt(userId))
      .query("SELECT * FROM Wishlist WHERE UserId=@userId ORDER BY CreatedAt DESC");

    const normalized = result.recordset.map(normalizeWishlistItem);

    console.log(`✅ Wishlist fetched for userId=${userId}`, normalized);
    res.json(normalized);
  } catch (err) {
    console.error("❌ Fetch wishlist error:", err.message);
    res.status(500).json({ error: "Failed to fetch wishlist", details: err.message });
  }
});

// ===== Add item to wishlist =====
router.post("/add", async (req, res) => {
  let { userId, productId, title, image, price } = req.body;
  console.log(`📌 POST /wishlist/add userId=${userId}, productId=${productId}`);

  try {
    if (!userId || !productId || !title || isNaN(price)) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    userId = parseInt(userId);
    productId = parseInt(productId);
    price = parseFloat(price);

    const pool = await sql.connect(config);

    // Check if item already exists
    const check = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .query("SELECT * FROM Wishlist WHERE UserId=@userId AND ProductId=@productId");

    if (check.recordset.length > 0) {
      console.log("⚠️ Item already exists in wishlist");
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    // Insert new item
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .input("title", sql.NVarChar, title)
      .input("image", sql.NVarChar, image || null)
      .input("price", sql.Decimal(18, 2), price)
      .query(
        `INSERT INTO Wishlist (UserId, ProductId, Title, Image, Price, CreatedAt)
         VALUES (@userId, @productId, @title, @image, @price, GETDATE());
         SELECT SCOPE_IDENTITY() AS Id;`
      );

    const newId = result.recordset[0]?.Id;

    const newItem = {
      id: newId,
      userId,
      productId,
      title,
      image,
      price,
    };

    console.log(`✅ Item added to wishlist (Id=${newId})`);
    res.json(newItem);
  } catch (err) {
    console.error("❌ Add wishlist error:", err.message);
    res.status(500).json({ error: "Failed to add to wishlist", details: err.message });
  }
});

// ===== Remove item from wishlist =====
router.delete("/remove/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  console.log(`📌 DELETE /wishlist/remove userId=${userId}, productId=${productId}`);

  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("userId", sql.Int, parseInt(userId))
      .input("productId", sql.Int, parseInt(productId))
      .query("DELETE FROM Wishlist WHERE UserId=@userId AND ProductId=@productId");

    console.log("✅ Item removed from wishlist");
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("❌ Remove wishlist error:", err.message);
    res.status(500).json({ error: "Failed to remove from wishlist", details: err.message });
  }
});

// ===== Clear wishlist for user =====
router.delete("/clear/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`📌 DELETE /wishlist/clear userId=${userId}`);

  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("userId", sql.Int, parseInt(userId))
      .query("DELETE FROM Wishlist WHERE UserId=@userId");

    console.log("✅ Wishlist cleared");
    res.json({ message: "Wishlist cleared" });
  } catch (err) {
    console.error("❌ Clear wishlist error:", err.message);
    res.status(500).json({ error: "Failed to clear wishlist", details: err.message });
  }
});

module.exports = router;
