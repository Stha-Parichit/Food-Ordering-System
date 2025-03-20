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
const { Client } = require('@elastic/elasticsearch');
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);


const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('997514767176-rvk4v4cho4qvibhti41b08ser7afsm7t.apps.googleusercontent.com');
const router = express.Router();

const esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

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

    const { fullName, email, password, phone, address } = req.body;
    db.registerUser(fullName, email, password, phone, address, (err, result) => {
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

// In server.js, replace the current cart endpoint with these improved versions

// Add item to cart with customization
app.post("/cart", async (req, res) => {
  const { 
    food_id, 
    user_id, 
    quantity = 1, 
    extraCheese = false, 
    extraMeat = false, 
    extraVeggies = false,
    noOnions = false, 
    noGarlic = false,
    spicyLevel = 'Medium',
    specialInstructions = "" 
  } = req.body;

  // Validate required fields
  if (!food_id || !user_id) {
    return res.status(400).json({ 
      success: false,
      message: "Food ID and user ID are required." 
    });
  }

  try {
    // Convert boolean values to 0/1 for MySQL
    const extra_cheese = extraCheese ? 1 : 0;
    const extra_meat = extraMeat ? 1 : 0;
    const extra_veggies = extraVeggies ? 1 : 0;
    const no_onions = noOnions ? 1 : 0;
    const no_garlic = noGarlic ? 1 : 0;
    
    // Check if an identical item configuration already exists in cart
    const checkQuery = `
      SELECT id, quantity FROM cart 
      WHERE user_id = ? AND food_id = ? 
      AND extra_cheese = ? AND extra_meat = ? AND extra_veggies = ?
      AND no_onions = ? AND no_garlic = ? AND spicy_level = ?
      AND (
        (special_instructions IS NULL AND ? = '') OR
        (special_instructions = ?)
      )
    `;
    
    // Use the promisified query
    const existingItems = await queryAsync(
      checkQuery, 
      [
        user_id, 
        food_id, 
        extra_cheese, 
        extra_meat, 
        extra_veggies, 
        no_onions, 
        no_garlic, 
        spicyLevel,
        specialInstructions,
        specialInstructions
      ]
    );

    if (existingItems.length > 0) {
      // If identical configuration exists, update quantity
      const updateQuery = "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
      await queryAsync(updateQuery, [quantity, existingItems[0].id]);
      
      return res.status(200).json({ 
        success: true,
        message: "Item quantity updated in cart",
        cart_id: existingItems[0].id,
        new_quantity: existingItems[0].quantity + quantity
      });
    } else {
      // Otherwise insert new cart item
      const insertQuery = `
        INSERT INTO cart (
          user_id, food_id, quantity, 
          extra_cheese, extra_meat, extra_veggies,
          no_onions, no_garlic, spicy_level, 
          special_instructions
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const result = await queryAsync(
        insertQuery, 
        [
          user_id, 
          food_id, 
          quantity, 
          extra_cheese, 
          extra_meat, 
          extra_veggies, 
          no_onions, 
          no_garlic, 
          spicyLevel,
          specialInstructions
        ]
      );
      
      return res.status(201).json({ 
        success: true,
        message: "Item added to cart successfully",
        cart_id: result.insertId
      });
    }
  } catch (error) {
    console.error("Error managing cart item:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to manage cart item", 
      error: error.message 
    });
  }
});

// Get cart items with customization details
app.get("/cart", async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ 
      success: false,
      message: "User ID is required." 
    });
  }

  try {
    const query = `
      SELECT 
        c.id AS cart_id, 
        f.id AS food_id, 
        f.name AS food_name, 
        f.description,
        f.category, 
        f.image_url, 
        f.price AS base_price, 
        c.quantity,
        c.extra_cheese,
        c.extra_meat,
        c.extra_veggies,
        c.no_onions,
        c.no_garlic,
        c.spicy_level,
        c.special_instructions,
        (
          f.price + 
          (c.extra_cheese * 35) + 
          (c.extra_meat * 50) + 
          (c.extra_veggies * 30)
        ) AS item_price,
        (
          (f.price + 
          (c.extra_cheese * 35) + 
          (c.extra_meat * 50) + 
          (c.extra_veggies * 30)) * c.quantity
        ) AS total_price
      FROM 
        cart c
      JOIN 
        food_items f ON c.food_id = f.id
      WHERE 
        c.user_id = ?
      ORDER BY
        c.id DESC
    `;

    const cartItems = await queryAsync(query, [user_id]);
    
    // Format the results for the frontend
    const formattedItems = cartItems.map(item => ({
      cart_id: item.cart_id,
      food_id: item.food_id,
      name: item.food_name,
      description: item.description,
      category: item.category,
      image_url: item.image_url,
      base_price: item.base_price,
      quantity: item.quantity,
      customization: {
        extraCheese: item.extra_cheese === 1,
        extraMeat: item.extra_meat === 1,
        extraVeggies: item.extra_veggies === 1,
        noOnions: item.no_onions === 1,
        noGarlic: item.no_garlic === 1,
        spicyLevel: item.spicy_level,
        specialInstructions: item.special_instructions || ""
      },
      item_price: item.item_price,
      total_price: item.total_price
    }));

    // Calculate cart summary
    const cartSummary = {
      total_items: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: formattedItems.reduce((sum, item) => sum + item.total_price, 0),
      delivery_fee: 50, // You can make this dynamic based on your business logic
      tax: formattedItems.reduce((sum, item) => sum + (item.total_price * 0.13), 0), // 13% tax
    };
    
    cartSummary.grand_total = cartSummary.subtotal + cartSummary.delivery_fee + cartSummary.tax;

    return res.status(200).json({ 
      success: true,
      items: formattedItems,
      summary: cartSummary
    });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to retrieve cart items", 
      error: error.message 
    });
  }
});

// Update cart item quantity or customization
app.put("/cart/:cart_id", async (req, res) => {
  const cart_id = req.params.cart_id;
  const { 
    quantity,
    extraCheese,
    extraMeat,
    extraVeggies,
    noOnions,
    noGarlic,
    spicyLevel,
    specialInstructions
  } = req.body;

  try {
    // Build dynamic update query based on provided fields
    let updateFields = [];
    let queryParams = [];

    if (quantity !== undefined) {
      updateFields.push("quantity = ?");
      queryParams.push(quantity);
    }

    if (extraCheese !== undefined) {
      updateFields.push("extra_cheese = ?");
      queryParams.push(extraCheese ? 1 : 0);
    }

    if (extraMeat !== undefined) {
      updateFields.push("extra_meat = ?");
      queryParams.push(extraMeat ? 1 : 0);
    }

    if (extraVeggies !== undefined) {
      updateFields.push("extra_veggies = ?");
      queryParams.push(extraVeggies ? 1 : 0);
    }

    if (noOnions !== undefined) {
      updateFields.push("no_onions = ?");
      queryParams.push(noOnions ? 1 : 0);
    }

    if (noGarlic !== undefined) {
      updateFields.push("no_garlic = ?");
      queryParams.push(noGarlic ? 1 : 0);
    }

    if (spicyLevel !== undefined) {
      updateFields.push("spicy_level = ?");
      queryParams.push(spicyLevel);
    }

    if (specialInstructions !== undefined) {
      updateFields.push("special_instructions = ?");
      queryParams.push(specialInstructions);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update provided"
      });
    }

    // Add cart_id to params
    queryParams.push(cart_id);

    const updateQuery = `UPDATE cart SET ${updateFields.join(", ")} WHERE id = ?`;
    await queryAsync(updateQuery, queryParams);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully"
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message
    });
  }
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
    const { foodName, description, details, price, category } = req.body;
  
    console.log("Received data:", req.body); // Log incoming request data
    console.log("File data:", req.file); // Log file information
  
    if (!foodName || !description || !details || !price || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const imagePath = req.file ? `/images/${req.file.filename}` : null;
  
    db.addFoodItem(foodName, description, details, imagePath, price, category, (err) => {
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

app.get("/loyalty-points", (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const query = "SELECT points FROM loyalty_points WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching loyalty points", error: err });
    }
    const points = results.length > 0 ? results[0].points : 0;
    res.status(200).json({ points });
  });
});

app.post("/update-loyalty-points", (req, res) => {
  const { user_id, total_amount, used_points } = req.body;

  if (!user_id || total_amount === undefined || used_points === undefined) {
    return res.status(400).json({ message: "User ID, total amount, and used points are required." });
  }

  const earned_points = Math.floor(total_amount / 1000); // Correctly calculate from total_amount

  const checkUserQuery = "SELECT points FROM loyalty_points WHERE user_id = ?";

  db.query(checkUserQuery, [user_id], async (err, result) => {
    if (err) {
      console.error("Error checking user loyalty points:", err);
      return res.status(500).json({ message: "Failed to check loyalty points", error: err });
    }

    let current_points = result.length === 0 ? 0 : result[0].points;

    // Deduct points if used_points are provided
    if (used_points > 0) {
      const new_points = Math.max(current_points - used_points, 0); // Prevent going below 0
      const deductPointsQuery = "UPDATE loyalty_points SET points = ? WHERE user_id = ?";
      db.query(deductPointsQuery, [new_points, user_id], (err, result) => {
        if (err) {
          console.error("Error deducting points:", err);
          return res.status(500).json({ message: "Failed to deduct points", error: err });
        }
      });
      current_points = new_points; // Update current points after deduction
    }

    // Add earned points if total amount is greater than 0
    if (earned_points > 0) {
      const new_points = current_points + earned_points;
      const addPointsQuery = "UPDATE loyalty_points SET points = ? WHERE user_id = ?";
      db.query(addPointsQuery, [new_points, user_id], (err, result) => {
        if (err) {
          console.error("Error adding points:", err);
          return res.status(500).json({ message: "Failed to add points", error: err });
        }

        return res.status(200).json({ message: "Loyalty points updated successfully" });
      });
    } else {
      // If no earned points to add, just send the response after deduction (if applicable)
      if (used_points > 0) {
        return res.status(200).json({ message: "Loyalty points updated successfully" });
      }
    }
  });
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

// Endpoint to generate eSewa payment URL
app.post("/api/esewa/pay", async (req, res) => {
  const { amount, transactionId } = req.body;

  const esewaPayload = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: transactionId,
      scd: "EPAYTEST",
      su: "http://localhost:3000/success",
      fu: "http://localhost:3000/failure"
  };

  const esewaURL = `http://rc-epay.esewa.com.np/api/epay/main?` + 
    new URLSearchParams(esewaPayload).toString();

  res.json({ esewaURL });
});

// Endpoint to verify eSewa payment
app.post("/api/esewa/verify", async (req, res) => {
  const { amount, transactionId, referenceId } = req.body;

  try {
      const response = await axios.post(
          "https://rc-epay.esewa.com.np/api/epay/verify",
          new URLSearchParams({
              amt: amount,
              rid: referenceId,
              pid: transactionId,
              scd: "epay_payment"
          })
      );

      if (response.data.status === "success") {
          res.json({ message: "Payment verified successfully!" });
      } else {
          res.status(400).json({ error: "Payment verification failed!" });
      }
  } catch (error) {
      res.status(500).json({ error: "Error verifying payment" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
