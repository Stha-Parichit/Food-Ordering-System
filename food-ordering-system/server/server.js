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
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


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
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "../client/public/images")));
app.use("/videos", express.static(path.join(__dirname, "../client/public/videos")));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// const upload = multer({ storage });

// Multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../client/public/videos"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 300 * 1024 * 1024 }, // Set file size limit to 300 MB
});

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
    spicyLevel = 3, // Default to Medium (numeric value)
    specialInstructions = "",
    glutenFree = false,
    cookingPreference = null,
    sides = null, // Comma-separated string
    dip_sauce = null // Comma-separated string
  } = req.body;

  // Map numeric spicy levels to string values
  const spicyLevelMap = {
    1: "No Spice",
    2: "Mild",
    3: "Medium",
    4: "Hot",
    5: "Extra Hot"
  };
  const spicyLevelString = spicyLevelMap[spicyLevel] || "Medium";

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

    // Convert sides and dip_sauce to JSON strings if they are arrays
    const sidesValue = sides ? JSON.stringify(sides) : null;
    const dipSauceValue = dip_sauce ? JSON.stringify(dip_sauce) : null;

    // Check if an identical item configuration already exists in cart
    const checkQuery = `
      SELECT id, quantity FROM cart 
      WHERE user_id = ? AND food_id = ? 
      AND extra_cheese = ? AND extra_meat = ? AND extra_veggies = ?
      AND no_onions = ? AND no_garlic = ? AND spicy_level = ?
      AND gluten_free = ? AND cooking_preference = ?
      AND (
        (special_instructions IS NULL AND ? = '') OR
        (special_instructions = ?)
      )
      AND (
        (sides IS NULL AND ? IS NULL) OR
        (sides = ?)
      )
      AND (
        (dip_sauce IS NULL AND ? IS NULL) OR
        (dip_sauce = ?)
      )
    `;

    const [existingItems] = await db.pool.execute(
      checkQuery, 
      [
        user_id, 
        food_id, 
        extra_cheese, 
        extra_meat, 
        extra_veggies, 
        no_onions, 
        no_garlic, 
        spicyLevelString,
        glutenFree ? 1 : 0,
        cookingPreference,
        specialInstructions,
        specialInstructions,
        sidesValue,
        sidesValue,
        dipSauceValue,
        dipSauceValue
      ]
    );

    if (existingItems.length > 0) {
      // If identical configuration exists, update quantity
      const updateQuery = "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
      await db.pool.execute(updateQuery, [quantity, existingItems[0].id]);
      
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
          special_instructions, gluten_free, cooking_preference, sides, dip_sauce
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertResult = await db.pool.execute(insertQuery, [
        user_id, 
        food_id, 
        quantity, 
        extraCheese ? 1 : 0, 
        extraMeat ? 1 : 0, 
        extraVeggies ? 1 : 0, 
        noOnions ? 1 : 0, 
        noGarlic ? 1 : 0, 
        spicyLevelString, // Use string value
        specialInstructions,
        glutenFree ? 1 : 0,
        cookingPreference,
        sides, // Store as plain text
        dip_sauce // Store as plain text
      ]);

      return res.status(201).json({ 
        success: true,
        message: "Item added to cart successfully",
        cart_id: insertResult.insertId // Use insertResult to get the inserted ID
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
    c.gluten_free, -- New field
    c.cooking_preference, -- New field
    (
      f.price + 
      (c.extra_cheese * 35) + 
      (c.extra_meat * 50) + 
      (c.extra_veggies * 30) +
      (c.gluten_free * 40) -- New field
    ) AS item_price,
    (
      (f.price + 
      (c.extra_cheese * 35) + 
      (c.extra_meat * 50) + 
      (c.extra_veggies * 30) +
      (c.gluten_free * 40)) * c.quantity -- New field
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

    const [cartItems] = await db.pool.execute(query, [user_id]);
    
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
        spicyLevel: item.spicy_level, // Already stored as string
        specialInstructions: item.special_instructions || "",
        sides: item.sides || null,
    dip_sauce: item.dip_sauce || null
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
    specialInstructions,
    glutenFree,
    cookingPreference
  } = req.body;

  // Map numeric spicy levels to string values
  const spicyLevelMap = {
    1: "No Spice",
    2: "Mild",
    3: "Medium",
    4: "Hot",
    5: "Extra Hot"
  };
  const spicyLevelString = spicyLevelMap[spicyLevel] || undefined;

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

    if (spicyLevelString !== undefined) {
      updateFields.push("spicy_level = ?");
      queryParams.push(spicyLevelString);
    }

    if (specialInstructions !== undefined) {
      updateFields.push("special_instructions = ?");
      queryParams.push(specialInstructions);
    }

    if (glutenFree !== undefined) {
      updateFields.push("gluten_free = ?");
      queryParams.push(glutenFree ? 1 : 0);
    }

    if (cookingPreference !== undefined) {
      updateFields.push("cooking_preference = ?");
      queryParams.push(cookingPreference);
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
    await db.pool.execute(updateQuery, queryParams);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully"
    });
  } catch (error) {
    console.error("Error updating cart item:", error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message
    });
  }
});

// Remove item from cart
app.delete("/cart/:id", async (req, res) => {
  const cart_id = req.params.id;

  const query = "DELETE FROM cart WHERE id = ?";
  try {
    await db.pool.execute(query, [cart_id]);
    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item from cart", error: err });
  }
});

// Clear cart items for a user
app.delete("/cart", async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = "DELETE FROM cart WHERE user_id = ?";
  try {
    await db.pool.execute(query, [user_id]);
    res.status(200).json({ message: "Cart items cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart items:", err);
    res.status(500).json({ message: "Failed to clear cart items", error: err });
  }
});

// Move `upload` initialization above its first usage
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files (MP4, MOV, AVI) are allowed'), false);
  }
};

// Ensure `upload` is defined before this line
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB file size limit
});

// Ensure `upload` is defined before this line
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
app.get("/api/food-items", async (req, res) => {
  try {
    const [rows] = await db.pool.execute("SELECT * FROM food_items ORDER BY RAND() LIMIT 8");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all food items with pagination
app.get("/api/food-items", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await db.pool.execute("SELECT * FROM food_items LIMIT ? OFFSET ?", [parseInt(limit), parseInt(offset)]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch recent customers
app.get("/api/recent-users", async (req, res) => {
  const query = `
    SELECT DISTINCT u.email, u.created_at 
    FROM users u
    JOIN orders o ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  try {
    const [results] = await db.pool.execute(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching recent customers:", err);
    res.status(500).json({ message: "Failed to fetch recent customers", error: err });
  }
});

// Fetch recent orders
app.get("/api/recent-orders", async (req, res) => {
  const query = `
    SELECT 
      o.id AS order_id, 
      u.fullName AS customer_name, 
      o.created_at, 
      o.total_amount 
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  try {
    const [results] = await db.pool.execute(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ message: "Failed to fetch recent orders", error: err });
  }
});

// Add order
app.post("/orders", async (req, res) => {
  const { user_id, items, total } = req.body;

  if (!user_id || !items || !total) {
    return res.status(400).json({ message: "User ID, items, and total are required." });
  }

  const query = "INSERT INTO orders (user_id, total) VALUES (?, ?)";
  try {
    const [result] = await db.pool.execute(query, [user_id, total]);
    const orderId = result.insertId;
    const orderItems = items.map(item => [orderId, item.food_id, item.quantity, item.price]);

    const orderItemsQuery = "INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ?";
    await db.pool.execute(orderItemsQuery, [orderItems]);

    // Update loyalty points
    updateLoyaltyPoints(user_id, total, async (err) => {
      if (err) {
        console.error("Error updating loyalty points:", err);
        return res.status(500).json({ message: "Failed to update loyalty points", error: err });
      }

      // Send notification to chef
      const notificationQuery = "INSERT INTO notifications (message) VALUES (?)";
      await db.pool.execute(notificationQuery, [`New order #${orderId} has been placed`]);

      res.status(200).json({ message: "Order placed successfully" });
    });
  } catch (err) {
    console.error("Error adding order:", err);
    res.status(500).json({ message: "Failed to add order", error: err });
  }
});

app.post("/process-payment", async (req, res) => {
  const { user_id, total_amount } = req.body;

  if (!user_id || !total_amount) {
    return res.status(400).json({ message: "User ID and total amount are required." });
  }

  const connection = await db.pool.getConnection();

  try {
    // Start a transaction using direct query
    await connection.query("START TRANSACTION");

    // Insert into orders table
    const insertOrderQuery = `
      INSERT INTO orders (user_id, total_amount)
      VALUES (?, ?)
    `;
    const [orderResult] = await connection.execute(insertOrderQuery, [user_id, total_amount]);
    const orderId = orderResult.insertId;

    // Fetch cart items
    const fetchCartQuery = `
      SELECT c.*, f.price AS base_price
      FROM cart c
      JOIN food_items f ON c.food_id = f.id
      WHERE c.user_id = ?
    `;
    const [cartItems] = await connection.execute(fetchCartQuery, [user_id]);

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Insert cart items into order_items table
    const insertOrderItemsQuery = `
      INSERT INTO order_items (
        order_id, food_id, quantity, customization, price, 
        extra_cheese, extra_meat, extra_veggies, no_onions, no_garlic, 
        spicy_level, special_instructions, gluten_free, cooking_preference, sides, dip_sauce
      )
      VALUES ?
    `;
    const orderItemsData = cartItems.map((item) => {
      const customizationPrice =
        (item.extra_cheese ? 35 : 0) +
        (item.extra_meat ? 50 : 0) +
        (item.extra_veggies ? 30 : 0) +
        (item.gluten_free ? 40 : 0);
      const itemPrice = item.base_price + customizationPrice;

      return [
        orderId,
        item.food_id,
        item.quantity,
        JSON.stringify({
          extraCheese: item.extra_cheese,
          extraMeat: item.extra_meat,
          extraVeggies: item.extra_veggies,
          noOnions: item.no_onions,
          noGarlic: item.no_garlic,
          spicyLevel: item.spicy_level,
          specialInstructions: item.special_instructions,
          glutenFree: item.gluten_free,
          cookingPreference: item.cooking_preference,
          sides: item.sides,
          dipSauce: item.dip_sauce,
        }),
        itemPrice,
        item.extra_cheese,
        item.extra_meat,
        item.extra_veggies,
        item.no_onions,
        item.no_garlic,
        item.spicy_level,
        item.special_instructions,
        item.gluten_free,
        item.cooking_preference,
        item.sides,
        item.dip_sauce,
      ];
    });

    await connection.query(insertOrderItemsQuery, [orderItemsData]);

    // Clear the cart
    const clearCartQuery = `
      DELETE FROM cart WHERE user_id = ?
    `;
    await connection.execute(clearCartQuery, [user_id]);

    // Commit the transaction using direct query
    await connection.query("COMMIT");

    res.status(200).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Error processing payment:", error);

    // Rollback the transaction using direct query
    await connection.query("ROLLBACK");

    res.status(500).json({ message: "Failed to process payment", error: error.message });
  } finally {
    connection.release();
  }
});

app.get("/orders", async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const ordersQuery = `
      SELECT o.id, o.total_amount, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [orders] = await db.pool.execute(ordersQuery, [userId]);

    const orderDetailsQuery = `
      SELECT 
        oi.order_id, oi.food_id, f.name AS food_name, f.image_url, oi.quantity, oi.price,
        oi.customization
      FROM order_items oi
      JOIN food_items f ON oi.food_id = f.id
      WHERE oi.order_id = ?
    `;

    for (const order of orders) {
      const [items] = await db.pool.execute(orderDetailsQuery, [order.id]);
      order.items = items.map((item) => ({
        ...item,
        customization: item.customization ? JSON.parse(item.customization) : null,
      }));
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

app.get("/loyalty-points", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const [results] = await db.pool.execute("SELECT points FROM loyalty_points WHERE user_id = ?", [userId]);
    const points = results.length > 0 ? results[0].points : 0;
    res.status(200).json({ points });
  } catch (err) {
    console.error("Error fetching loyalty points:", err);
    res.status(500).json({ message: "Error fetching loyalty points", error: err });
  }
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


// Get orders with detailed item information
app.get("/orders", async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const ordersQuery = `
      SELECT o.id, o.total_amount, o.created_at
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const [orders] = await db.pool.execute(ordersQuery, [userId]);

    const orderDetailsQuery = `
      SELECT oi.order_id, oi.food_id, f.name AS food_name, f.image_url, oi.quantity, oi.price
      FROM order_items oi
      JOIN food_items f ON oi.food_id = f.id
      WHERE oi.order_id = ?
    `;

    for (const order of orders) {
      const [items] = await db.pool.execute(orderDetailsQuery, [order.id]);
      order.items = items;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// Get order details
app.get("/orders/:id", async (req, res) => {
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

  try {
    const [results] = await db.pool.execute(query, [orderId]);
    res.status(200).json({ id: orderId, items: results });
  } catch (err) {
    console.error("Error retrieving order details:", err);
    res.status(500).json({ message: "Failed to retrieve order details", error: err });
  }
});

// Get notifications
app.get("/notifications", async (req, res) => {
  try {
    const [results] = await db.pool.execute("SELECT * FROM notifications");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error retrieving notifications:", err);
    res.status(500).json({ message: "Failed to retrieve notifications", error: err });
  }
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

// Endpoint to upload cooking tutorial video
app.post("/api/upload-tutorial", videoUpload.single("video"), async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description || !req.file) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const videoPath = `/videos/${req.file.filename}`;

  try {
    const query = `
      INSERT INTO tutorials (title, description, video_url, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    await db.pool.execute(query, [title, description, videoPath]);
    res.status(201).json({ message: "Tutorial uploaded successfully!" });
  } catch (error) {
    console.error("Database insertion error:", error); // Log the error
    res.status(500).json({ message: "Failed to upload tutorial to the database." });
  }
});

// Fetch all cooking tutorial videos
app.get("/api/tutorials", async (req, res) => {
  const query = "SELECT * FROM tutorials ORDER BY created_at DESC";

  try {
    const [results] = await db.pool.execute(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching tutorials:", err);
    res.status(500).json({ message: "Failed to fetch tutorials." });
  }
});

// File filter to only accept video files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only video files (MP4, MOV, AVI) are allowed'), false);
//   }
// };

// Update `upload` to handle both images and videos
// const upload = multer({ 
//   storage, 
//   fileFilter,
//   limits: { fileSize: 500 * 1024 * 1024 } // 500MB file size limit
// });

// Routes
app.post('/api/upload-tutorial', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const {
      title,
      description,
      category,
      difficultyLevel,
      duration,
      ingredients,
      createdAt
    } = req.body;

    // Parse ingredients from JSON string to array
    const parsedIngredients = JSON.parse(ingredients);

    // Create new tutorial record in database
    const tutorial = {
      title,
      description,
      category,
      difficultyLevel,
      duration: parseInt(duration) || 0,
      ingredients: parsedIngredients,
      videoUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      createdAt: createdAt || new Date().toISOString()
    };

    const result = await db.insertTutorial(tutorial);
    
    res.status(201).json({
      message: 'Tutorial uploaded successfully',
      tutorialId: result.id
    });
  } catch (error) {
    console.error('Error uploading tutorial:', error);
    res.status(500).json({
      message: 'Failed to upload tutorial',
      error: error.message
    });
  }
});

// Get all tutorials
app.get('/api/tutorials', async (req, res) => {
  try {
    const tutorials = await db.getAllTutorials();
    
    // Transform snake_case db column names to camelCase for frontend
    const formattedTutorials = tutorials.map(tutorial => {
      return {
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficultyLevel: tutorial.difficulty_level,
        duration: tutorial.duration,
        videoUrl: tutorial.video_url,
        fileSize: tutorial.file_size,
        fileType: tutorial.file_type,
        createdAt: tutorial.created_at,
        views: tutorial.views,
        likes: tutorial.likes,
        ingredients: tutorial.ingredients
      };
    });
    
    res.json(formattedTutorials);
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    res.status(500).json({ message: 'Failed to fetch tutorials' });
  }
});

// Get tutorial by ID
app.get('/api/tutorials/:id', async (req, res) => {
  try {
    const tutorial = await db.getTutorialById(req.params.id);
    
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    // Transform snake_case db column names to camelCase for frontend
    const formattedTutorial = {
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      category: tutorial.category,
      difficultyLevel: tutorial.difficulty_level,
      duration: tutorial.duration,
      videoUrl: tutorial.video_url,
      fileSize: tutorial.file_size,
      fileType: tutorial.file_type,
      createdAt: tutorial.created_at,
      views: tutorial.views,
      likes: tutorial.likes,
      ingredients: tutorial.ingredients
    };
    
    res.json(formattedTutorial);
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    res.status(500).json({ message: 'Failed to fetch tutorial' });
  }
});

// Get tutorials by category
app.get('/api/tutorials/category/:category', async (req, res) => {
  try {
    const tutorials = await db.getTutorialsByCategory(req.params.category);
    
    // Transform snake_case db column names to camelCase for frontend
    const formattedTutorials = tutorials.map(tutorial => {
      return {
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficultyLevel: tutorial.difficulty_level,
        duration: tutorial.duration,
        videoUrl: tutorial.video_url,
        fileSize: tutorial.file_size,
        fileType: tutorial.file_type,
        createdAt: tutorial.created_at,
        views: tutorial.views,
        likes: tutorial.likes,
        ingredients: tutorial.ingredients
      };
    });
    
    res.json(formattedTutorials);
  } catch (error) {
    console.error('Error fetching tutorials by category:', error);
    res.status(500).json({ message: 'Failed to fetch tutorials' });
  }
});

// Search tutorials
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const tutorials = await db.searchTutorials(q);
    
    // Transform snake_case db column names to camelCase for frontend
    const formattedTutorials = tutorials.map(tutorial => {
      return {
        id: tutorial.id,
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficultyLevel: tutorial.difficulty_level,
        duration: tutorial.duration,
        videoUrl: tutorial.video_url,
        fileSize: tutorial.file_size,
        fileType: tutorial.file_type,
        createdAt: tutorial.created_at,
        views: tutorial.views,
        likes: tutorial.likes,
        ingredients: tutorial.ingredients
      };
    });
    
    res.json(formattedTutorials);
  } catch (error) {
    console.error('Error searching tutorials:', error);
    res.status(500).json({ message: 'Failed to search tutorials' });
  }
});

// Track tutorial view
app.post('/api/tutorials/:id/view', async (req, res) => {
  try {
    await db.incrementViews(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Failed to track view' });
  }
});

// Like tutorial
app.post('/api/tutorials/:id/like', async (req, res) => {
  try {
    await db.toggleLike(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error liking tutorial:', error);
    res.status(500).json({ message: 'Failed to like tutorial' });
  }
});

// Delete tutorial
app.delete('/api/tutorials/:id', async (req, res) => {
  try {
    // Get tutorial details to delete the video file
    const tutorial = await db.getTutorialById(req.params.id);
    
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    
    // Delete the video file
    const videoPath = path.join(__dirname, tutorial.video_url);
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
    
    // Delete from database
    await db.deleteTutorial(req.params.id);
    
    res.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    res.status(500).json({ message: 'Failed to delete tutorial' });
  }
});

app.post("/save-user-info", async (req, res) => {
  const { user_id, additionalFields } = req.body;

  if (!user_id || !additionalFields || !Array.isArray(additionalFields)) {
    return res.status(400).json({ message: "User ID and additional fields are required." });
  }

  try {
    // Fetch user details from the `users` table
    const [userResult] = await db.pool.execute(
      "SELECT fullName, phone, address FROM users WHERE id = ?",
      [user_id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult[0];
    const [firstName, lastName] = user.fullName.split(" ");

    // Save additional fields into `user_additional_info` table
    const additionalInfoData = additionalFields.map((field) => [
      user_id,
      field.name,
      field.value,
    ]);

    const insertQuery = `
      INSERT INTO user_additional_info (user_id, field_name, field_value)
      VALUES ?
    `;
    await db.pool.execute(insertQuery, [additionalInfoData]);

    res.status(201).json({
      message: "User info saved successfully",
      user: {
        firstName,
        lastName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Error saving user info:", error);
    res.status(500).json({ message: "Failed to save user info", error: error.message });
  }
});

// Get all orders for the chef
app.get("/chef/orders", async (req, res) => {
  try {
    const ordersQuery = `
      SELECT o.id, o.total_amount, o.created_at, u.fullName AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const [orders] = await db.pool.execute(ordersQuery);

    const orderDetailsQuery = `
      SELECT 
        oi.order_id, oi.food_id, f.name AS food_name, f.image_url, oi.quantity, oi.price,
        oi.customization
      FROM order_items oi
      JOIN food_items f ON oi.food_id = f.id
      WHERE oi.order_id = ?
    `;

    for (const order of orders) {
      const [items] = await db.pool.execute(orderDetailsQuery, [order.id]);
      order.items = items.map((item) => ({
        ...item,
        customization: item.customization ? JSON.parse(item.customization) : null,
      }));
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching chef orders:", error);
    res.status(500).json({ message: "Failed to fetch chef orders", error: error.message });
  }
});

// Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const query = "SELECT id, fullName, email, phone, address, created_at FROM users ORDER BY created_at DESC";
    const [results] = await db.pool.execute(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const query = "DELETE FROM users WHERE id = ?";
    await db.pool.execute(query, [userId]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user", error: err });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
