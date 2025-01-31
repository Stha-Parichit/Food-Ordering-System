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

const app = express();
const PORT = process.env.PORT || 5000;

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
app.post("/cart", authenticateToken, (req, res) => {
  const { food_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!food_id || !quantity) {
    return res.status(400).json({ message: "Food ID and quantity are required." });
  }

  const query = `
    INSERT INTO cart (user_id, food_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;

  db.query(query, [user_id, food_id, quantity], (err) => {
    if (err) return res.status(500).json({ message: "Failed to add item to cart", error: err });
    res.status(200).json({ message: "Item added to cart successfully" });
  });
});

// Get cart items
app.get("/cart", authenticateToken, (req, res) => {
  const user_id = req.user.id;

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
    if (err) return res.status(500).json({ message: "Failed to retrieve cart items", error: err });
    res.status(200).json(results);
  });
});

// Remove item from cart
app.delete("/cart/:id", authenticateToken, (req, res) => {
  const cart_id = req.params.id;

  const query = "DELETE FROM cart WHERE id = ?";
  db.query(query, [cart_id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to remove item from cart", error: err });
    res.status(200).json({ message: "Item removed from cart successfully" });
  });
});


app.post("/upload-food", authenticateToken, upload.single("image"), (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
