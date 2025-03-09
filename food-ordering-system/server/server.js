require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator"); // For input validation
const db = require("./db"); // Database connection file
const { updateLoyaltyPoints } = require("./db"); // Import the function

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com'); // Replace with your Google Client ID
const router = express.Router();

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const user = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    // If the user doesn't exist, create a new one
    if (user.length === 0) {
      const newUser = {
        email: email,
        name: payload.name,
        // Add other fields as necessary
      };
      await db.query("INSERT INTO users SET ?", newUser);
    }

    // Create JWT and send it back
    const userToken = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: userToken, email: user[0].email });
  } catch (error) {
    res.status(400).json({ message: 'Google login failed' });
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../client/public/images")));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error verifying email transporter:", error);
  } else {
    console.log("Email transporter is ready");
  }
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Register endpoint
app.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    db.registerUser(email, password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Registration failed", error: err });
      }
      res.status(201).json(result);
    });
  }
);

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.loginUser(email, password, (err, result) => {
    if (err) {
      return res.status(401).json({ message: err.message || "Login failed" });
    }
    res.status(200).json(result);
  });
});

// Forgot Password Endpoint
app.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Valid email is required"),
  (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];

      // Check if a reset token was sent within the last minute
      if (user.reset_token && user.reset_token_expiry > Date.now() - 60 * 1000) {
        return res.status(429).json({ message: "Please wait before requesting another reset email." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

      db.query(
        "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
        [hashedToken, resetTokenExpiry, email],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to generate reset token" });
          }

          const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link is valid for 15 minutes.</p>`,
          };

          transporter.sendMail(mailOptions, (err) => {
            if (err) {
              console.error("Error sending email:", err);
              return res.status(500).json({ message: "Failed to send reset email" });
            }
            res.status(200).json({ message: "Password reset email sent successfully" });
          });
        }
      );
    });
  }
);

// Reset Password Endpoint
app.post("/reset-password", (req, res) => {
  const { email, token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  db.query(
    "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiry > ?",
    [email, hashedToken, Date.now()],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Failed to hash password" });
        }

        db.query(
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
          [hashedPassword, email],
          (err) => {
            if (err) {
              return res.status(500).json({ message: "Failed to reset password" });
            }
            res.status(200).json({ message: "Password reset successful" });
          }
        );
      });
    }
  );
});

// Add item to cart
app.post("/cart", (req, res) => {
  const { food_id, user_id } = req.body;

  if (!food_id || !user_id) {
    return res.status(400).json({ message: "Food ID and user ID are required." });
  }

  console.log("Received user_id:", user_id);

  // Check if the item already exists
  const checkQuery = "SELECT * FROM cart WHERE user_id = ? AND food_id = ?";
  db.query(checkQuery, [user_id, food_id], (err, results) => {
    if (err) {
      console.error("Error checking cart item:", err);
      return res.status(500).json({ message: "Failed to check cart item", error: err });
    }

    if (results.length > 0) {
      // If item exists, update quantity by +1
      const updateQuery = "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND food_id = ?";
      db.query(updateQuery, [user_id, food_id], (err) => {
        if (err) {
          console.error("Error updating cart item:", err);
          return res.status(500).json({ message: "Failed to update cart item", error: err });
        }
        return res.status(200).json({ message: "Item quantity updated successfully" });
      });
    } else {
      // If item does not exist, insert into cart
      const insertQuery = "INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, 1)";
      db.query(insertQuery, [user_id, food_id], (err) => {
        if (err) {
          console.error("Error adding item to cart:", err);
          return res.status(500).json({ message: "Failed to add item to cart", error: err });
        }
        res.status(200).json({ message: "Item added to cart successfully" });
      });
    }
  });
});

// Get cart items
app.get("/cart", (req, res) => {
  const user_id = req.query.user_id; // Use the user ID from query parameters

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = `
    SELECT 
      c.id AS cart_id, 
      f.id AS food_id, 
      f.name AS food_name, 
      f.description, 
      f.image_url, 
      f.price, 
      c.quantity, 
      (c.quantity * f.price) AS total_price
    FROM 
      cart c
    JOIN 
      food_items f ON c.food_id = f.id
    WHERE 
      c.user_id = ?
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error retrieving cart items:", err); // Log the error
      return res.status(500).json({ message: "Failed to retrieve cart items", error: err });
    }
    res.status(200).json(results);
  });
});

// Remove item from cart
app.delete("/cart/:id", (req, res) => {
  const cart_id = req.params.id;

  const query = "DELETE FROM cart WHERE id = ?";
  db.query(query, [cart_id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to remove item from cart", error: err });
    res.status(200).json({ message: "Item removed from cart successfully" });
  });
});

// Clear cart items for a user
app.delete("/cart", (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = "DELETE FROM cart WHERE user_id = ?";
  db.query(query, [user_id], (err) => {
    if (err) {
      console.error("Error clearing cart items:", err);
      return res.status(500).json({ message: "Failed to clear cart items", error: err });
    }
    res.status(200).json({ message: "Cart items cleared successfully" });
  });
});

app.post("/upload-food", upload.single("image"), (req, res) => {
    const { foodName, description, details, price } = req.body;
  
    console.log("Received data:", req.body); // Log incoming request data
    console.log("File data:", req.file); // Log file information
  
    if (!foodName || !description || !details || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const imagePath = req.file ? `/images/${req.file.filename}` : null;
  
    db.addFoodItem(foodName, description, details, imagePath, price, (err) => {
      if (err) {
        console.error("Error adding food item:", err); // Log database error
        return res.status(500).json({ message: "Failed to upload food item." });
      }
      res.status(201).json({ message: "Food item uploaded successfully!" });
    });
  });
  

// Fetch featured food items
app.get("/api/food-items", (req, res) => {
  db.query("SELECT * FROM food_items ORDER BY RAND() LIMIT 8", (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(rows);
  });
});

// Fetch all food items with pagination
app.get("/api/food-items", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.query("SELECT * FROM food_items LIMIT ? OFFSET ?", [parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(rows);
  });
});

// Fetch recent users
app.get("/api/recent-users", (req, res) => {
  const query = "SELECT email, created_at FROM users ORDER BY created_at DESC LIMIT 5";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch recent users", error: err });
    }
    res.status(200).json(results);
  });
});

// Add order
app.post("/orders", (req, res) => {
  const { user_id, items, total } = req.body;

  if (!user_id || !items || !total) {
    return res.status(400).json({ message: "User ID, items, and total are required." });
  }

  const query = "INSERT INTO orders (user_id, total) VALUES (?, ?)";
  db.query(query, [user_id, total], (err, result) => {
    if (err) {
      console.error("Error adding order:", err);
      return res.status(500).json({ message: "Failed to add order", error: err });
    }

    const orderId = result.insertId;
    const orderItems = items.map(item => [orderId, item.food_id, item.quantity, item.price]);

    const orderItemsQuery = "INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ?";
    db.query(orderItemsQuery, [orderItems], (err) => {
      if (err) {
        console.error("Error adding order items:", err);
        return res.status(500).json({ message: "Failed to add order items", error: err });
      }

      // Update loyalty points
      updateLoyaltyPoints(user_id, total, (err) => {
        if (err) {
          console.error("Error updating loyalty points:", err);
          return res.status(500).json({ message: "Failed to update loyalty points", error: err });
        }

        // Send notification to chef
        const notificationQuery = "INSERT INTO notifications (message) VALUES (?)";
        db.query(notificationQuery, [`New order #${orderId} has been placed`], (err) => {
          if (err) {
            console.error("Error sending notification:", err);
            return res.status(500).json({ message: "Failed to send notification", error: err });
          }

          res.status(200).json({ message: "Order placed successfully" });
        });
      });
    });
  });
});

// Add loyalty points
app.post("/loyalty-points", (req, res) => {
  const { user_id, total_amount } = req.body;

  if (!user_id || !total_amount) {
    return res.status(400).json({ message: "User ID and total amount are required." });
  }

  const points = Math.floor(total_amount / 1000);
  if (points > 0) {
    const query = `
      INSERT INTO loyalty_points (user_id, points)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE points = points + VALUES(points)
    `;
    db.query(query, [user_id, points], (err, result) => {
      if (err) {
        console.error("Error updating loyalty points:", err);
        return res.status(500).json({ message: "Failed to update loyalty points", error: err });
      }
      res.status(200).json({ message: "Loyalty points updated successfully" });
    });
  } else {
    res.status(200).json({ message: "No loyalty points to update" });
  }
});

// Get orders
app.get("/orders", (req, res) => {
  const query = "SELECT * FROM orders";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving orders:", err);
      return res.status(500).json({ message: "Failed to retrieve orders", error: err });
    }
    res.status(200).json(results);
  });
});

// Get order details
app.get("/orders/:id", (req, res) => {
  const orderId = req.params.id;

  const query = `
    SELECT 
      o.id AS order_id, 
      o.total, 
      oi.food_id, 
      f.name AS food_name, 
      oi.quantity, 
      oi.price 
    FROM 
      orders o
    JOIN 
      order_items oi ON o.id = oi.order_id
    JOIN 
      food_items f ON oi.food_id = f.id
    WHERE 
      o.id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error retrieving order details:", err);
      return res.status(500).json({ message: "Failed to retrieve order details", error: err });
    }
    res.status(200).json({ id: orderId, items: results });
  });
});

// Get notifications
app.get("/notifications", (req, res) => {
  const query = "SELECT * FROM notifications";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving notifications:", err);
      return res.status(500).json({ message: "Failed to retrieve notifications", error: err });
    }
    res.status(200).json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
