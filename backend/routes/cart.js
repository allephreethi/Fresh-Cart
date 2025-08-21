const express = require("express");
const router = express.Router();
const { sql, config } = require("../config");

// GET: Fetch cart items
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT * FROM Cart WHERE userId = @userId");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST: Add or update item
router.post("/add", async (req, res) => {
  const { userId, productId, title, price, image, quantity = 1 } = req.body;
  if (!userId || !productId) return res.status(400).json({ error: "Missing required fields" });

  try {
    const pool = await sql.connect(config);
    const existing = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .query("SELECT * FROM Cart WHERE userId = @userId AND productId = @productId");

    if (existing.recordset.length > 0) {
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("productId", sql.Int, productId)
        .input("quantity", sql.Int, quantity)
        .query("UPDATE Cart SET quantity = quantity + @quantity WHERE userId = @userId AND productId = @productId");
      res.json({ message: "Quantity updated" });
    } else {
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("productId", sql.Int, productId)
        .input("title", sql.NVarChar, title)
        .input("price", sql.Decimal(10, 2), price)
        .input("image", sql.NVarChar, image)
        .input("quantity", sql.Int, quantity)
        .query("INSERT INTO Cart (userId, productId, title, price, image, quantity) VALUES (@userId, @productId, @title, @price, @image, @quantity)");
      res.json({ message: "Item added to cart" });
    }
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// DELETE: Remove item
router.delete("/remove/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .query("DELETE FROM Cart WHERE userId = @userId AND productId = @productId");
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("❌ Error removing cart item:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// PUT: Update quantity
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || quantity == null) return res.status(400).json({ error: "Missing required fields" });

  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .input("quantity", sql.Int, quantity)
      .query("UPDATE Cart SET quantity = @quantity WHERE userId = @userId AND productId = @productId");
    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// POST: Checkout / place order
router.post("/checkout", async (req, res) => {
  const { userId, addressId, totalAmount, coupon, paymentMethod } = req.body;
  if (!userId || !addressId || !totalAmount)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const pool = await sql.connect(config);

    // 1️⃣ Fetch cart items
    const cartResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT * FROM Cart WHERE userId = @userId");

    if (cartResult.recordset.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const cartItems = cartResult.recordset;

    // 2️⃣ Insert order
    const insertOrder = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("addressId", sql.Int, addressId)
      .input("totalAmount", sql.Decimal(10, 2), totalAmount)
      .input("coupon", sql.NVarChar, coupon || null)
      .input("paymentMethod", sql.NVarChar, paymentMethod || "COD")
      .query(`
        INSERT INTO Orders (userId, addressId, totalAmount, coupon, paymentMethod, createdAt)
        OUTPUT INSERTED.id
        VALUES (@userId, @addressId, @totalAmount, @coupon, @paymentMethod, GETDATE())
      `);

    const orderId = insertOrder.recordset[0].id;

    // 3️⃣ Insert items into OrderItems
    for (let item of cartItems) {
      await pool
        .request()
        .input("orderId", sql.Int, orderId)
        .input("productId", sql.Int, item.productId)
        .input("title", sql.NVarChar, item.title)
        .input("price", sql.Decimal(10, 2), item.price)
        .input("quantity", sql.Int, item.quantity)
        .query(`
          INSERT INTO OrderItems (orderId, productId, title, price, quantity)
          VALUES (@orderId, @productId, @title, @price, @quantity)
        `);
    }

    // 4️⃣ Clear cart
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("DELETE FROM Cart WHERE userId = @userId");

    res.json({ message: "Order placed successfully", orderId });
  } catch (err) {
    console.error("❌ Error during checkout:", err);
    res.status(500).json({ error: "Failed to checkout" });
  }
});

module.exports = router;
