require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");
const { addNotification } = require('./db');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('Chef connected:', socket.id);
});

// User registration endpoint
app.post("/register", async (req, res) => {
  const { fullName, email, password, phone, address } = req.body;
  pool.registerUser(fullName, email, password, phone, address, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// User login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  pool.loginUser(email, password, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

// Add food item endpoint
app.post("/add-food-item", async (req, res) => {
  const { foodName, description, details, imagePath, price, category } = req.body;
  pool.addFoodItem(foodName, description, details, imagePath, price, category, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// Get all food items endpoint
app.get("/food-items", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM food_items");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cart items endpoint
app.get("/cart", async (req, res) => {
  const { user_id } = req.query;
  try {
    const [rows] = await pool.execute(
      "SELECT c.*, f.name AS item_name, f.price AS item_price FROM cart c JOIN food_items f ON c.food_id = f.id WHERE c.user_id = ?",
      [user_id]
    );
    res.status(200).json({ success: true, items: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Process payment endpoint
app.post("/process-payment", async (req, res) => {
  const { user_id, total_amount } = req.body;
  try {
    // Insert order
    const [orderResult] = await pool.execute(
      "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
      [user_id, total_amount]
    );
    const orderId = orderResult.insertId;

    // Insert order items from cart
    const [cartItems] = await pool.execute(
      "SELECT * FROM cart WHERE user_id = ?",
      [user_id]
    );
    for (const item of cartItems) {
      await pool.execute(
        "INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.food_id, item.quantity, item.item_price]
      );
    }

    // Clear cart
    await pool.execute("DELETE FROM cart WHERE user_id = ?", [user_id]);

    // Send notification after payment is processed
    await addNotification(user_id, orderId, `New order #${orderId} placed!`);
    io.emit('new-order', { orderId, message: `New order #${orderId} placed!` });

    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update loyalty points endpoint
app.post("/update-loyalty-points", async (req, res) => {
  const { user_id, total_amount, used_points } = req.body;
  try {
    await pool.updateLoyaltyPoints(user_id, total_amount, used_points);
    res.status(200).json({ message: "Loyalty points updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get loyalty points endpoint
app.get("/loyalty-points", async (req, res) => {
  const { user_id } = req.query;
  try {
    const [rows] = await pool.execute(
      "SELECT points FROM loyalty_points WHERE user_id = ?",
      [user_id]
    );
    const points = rows.length > 0 ? rows[0].points : 0;
    res.status(200).json({ points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});