require("dotenv").config();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Connect to MySQL and select the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }
    console.log(`Database ${process.env.DB_NAME} ensured`);
  });
  // Use the selected database
  db.query(`USE ${process.env.DB_NAME}`, (err, result) => {
    if (err) {
      console.error("Error selecting the database:", err);
      return;
    }
    console.log(`Using database: ${process.env.DB_NAME}`);

    // Create tables if not exists
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone BIGINT NOT NULL,
        address VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expiry BIGINT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createUsersTableQuery, (err) => {
      if (err) {
        console.error("Error creating users table:", err);
        return;
      }
      console.log("Users table ensured");
    });

    // Ensure food_items table exists
    const createFoodItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS food_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        details TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        price DECIMAL(10, 2) NOT NULL     )
    `;
    db.query(createFoodItemsTableQuery, (err) => {
      if (err) {
        console.error("Error creating food_items table:", err);
      } else {
        console.log("food_items table ensured");
      }
    });
    // Create `cart` table
    const createCartTableQuery = `
      CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      food_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      extra_cheese BOOLEAN DEFAULT FALSE,
      extra_meat BOOLEAN DEFAULT FALSE,
      extra_veggies BOOLEAN DEFAULT FALSE,
      no_onions BOOLEAN DEFAULT FALSE,
      no_garlic BOOLEAN DEFAULT FALSE,
      spicy_level VARCHAR(20) DEFAULT 'Medium',
      special_instructions TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
    )
`;

    db.query(createCartTableQuery, (err) => {
      if (err) console.error("Error creating cart table:", err);
      else console.log("Cart table ensured");
    });

    // Create `loyalty_points` table
    const createLoyaltyPointsTableQuery = `
      CREATE TABLE IF NOT EXISTS loyalty_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        points INT NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    db.query(createLoyaltyPointsTableQuery, (err) => {
      if (err) console.error("Error creating loyalty_points table:", err);
      else console.log("Loyalty points table ensured");
    });
  });
});

// JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET, // Use secret from .env
    { expiresIn: "2h" }
  );
};

// User registration
const registerUser = (fullName, email, password, phone, address, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const query = `INSERT INTO users (fullName, email, password, phone, address) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [fullName, email, hashedPassword, phone, address], (err, result) => {
      if (err) return callback(err);
      callback(null, { message: "User registered successfully" });
    });
  });
};

// User login
const loginUser = (email, password, callback) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], (err, result) => {
    if (err) return callback(err);
    if (result.length === 0) return callback({ message: "User not found" });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback({ message: "Invalid credentials" });

      const token = generateToken(user);
      callback(null, { token, message: "Login successful", userId: user.id });
    });
  });
};

const addFoodItem = (foodName, description, details, imagePath, price, category, callback) => {
  const query = `
    INSERT INTO food_items (name, description, details, image_url, price, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  console.log("Executing query:", query); // Log the query
  console.log("With values:", [foodName, description, details, imagePath, price, category]); // Log values

  db.query(query, [foodName, description, details, imagePath, price, category], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Log database error
      return callback(err);
    }
    console.log("Insert successful, result:", result); // Log success
    callback(null, { message: "Food item added successfully" });
  });
};

// Export functions
module.exports = {
  registerUser,
  loginUser,
  addFoodItem,
  query: db.query.bind(db),
};
