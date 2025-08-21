// routes/order.js
const express = require("express");
const router = express.Router();
const { sql, config } = require("../config");

// ===== POST: Create a new order =====
router.post("/create", async (req, res) => {
  const { userId, addressId, paymentMethod, total, discountAmount, items } = req.body;

  // 1️⃣ Validation
  if (!userId || !addressId || !paymentMethod || total == null || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing or invalid required fields" });
  }

  for (const item of items) {
    if (!item.productId || !item.title || item.price == null || item.quantity == null) {
      return res.status(400).json({ error: "Invalid item in order" });
    }
  }

  let pool;
  let transaction;

  try {
    pool = await sql.connect(config);
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);

    // 2️⃣ Insert into Orders
    const orderResult = await request
      .input("userId", sql.Int, userId)
      .input("addressId", sql.Int, addressId)
      .input("paymentMethod", sql.NVarChar(50), paymentMethod)
      .input("total", sql.Decimal(18, 2), parseFloat(total))
      .input("discountAmount", sql.Decimal(18, 2), parseFloat(discountAmount || 0))
      .query(`
        INSERT INTO Orders (userId, addressId, paymentMethod, total, discountAmount)
        OUTPUT INSERTED.id, INSERTED.createdAt
        VALUES (@userId, @addressId, @paymentMethod, @total, @discountAmount)
      `);

    const orderId = orderResult.recordset[0]?.id;
    if (!orderId) throw new Error("Failed to create order");

    // 3️⃣ Insert items into OrderItems
    for (const item of items) {
      await request
        .input("orderId", sql.Int, orderId)
        .input("productId", sql.Int, item.productId)
        .input("title", sql.NVarChar(255), item.title.slice(0, 255))
        .input("price", sql.Decimal(18, 2), parseFloat(item.price))
        .input("quantity", sql.Int, item.quantity)
        .query(`
          INSERT INTO OrderItems (orderId, productId, title, price, quantity)
          VALUES (@orderId, @productId, @title, @price, @quantity)
        `);
    }

    // 4️⃣ Clear user's cart
    await request
      .input("userId", sql.Int, userId)
      .query("DELETE FROM Cart WHERE userId = @userId");

    // 5️⃣ Commit transaction
    await transaction.commit();

    // 6️⃣ Fetch order with items
    const orderWithItems = await pool
      .request()
      .input("orderId", sql.Int, orderId)
      .query(`
        SELECT o.*,
          (SELECT id, productId, title, price, quantity
           FROM OrderItems
           WHERE orderId = @orderId
           FOR JSON PATH) AS itemsJson
        FROM Orders o
        WHERE o.id = @orderId
      `);

    const orderRecord = orderWithItems.recordset[0];
    const order = {
      ...orderRecord,
      items: JSON.parse(orderRecord.itemsJson || "[]"),
      status: "Processing",
    };

    res.status(201).json({ message: "Order placed successfully", order });

  } catch (err) {
    console.error("❌ Create order failed:", err);
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
});

// ===== GET: Fetch all orders for a user =====
router.get("/my/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const pool = await sql.connect(config);
    const ordersResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT o.*, 
          (SELECT id, productId, title, price, quantity
           FROM OrderItems
           WHERE orderId = o.id
           FOR JSON PATH) AS itemsJson
        FROM Orders o
        WHERE o.userId = @userId
        ORDER BY o.createdAt DESC
      `);

    const orders = ordersResult.recordset.map(o => ({
      ...o,
      items: JSON.parse(o.itemsJson || "[]"),
      status: "Processing",
    }));

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch user orders failed:", err);
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
});

module.exports = router;
