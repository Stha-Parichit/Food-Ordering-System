require("dotenv").config();
// const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "food_ordering_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool };

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create tutorials table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tutorials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        difficulty_level VARCHAR(20) NOT NULL,
        duration INT NOT NULL,
        video_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        views INT DEFAULT 0,
        likes INT DEFAULT 0
      )
    `);

    // Create ingredients table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tutorial_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE
      )
    `);

    const createCharityTableQuery = `
      CREATE TABLE IF NOT EXISTS charity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        charity_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createCharityTableQuery);
    console.log("Charity table ensured");

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Database operations
async function insertTutorial(tutorial) {
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert tutorial record
      const [result] = await connection.execute(
        `INSERT INTO tutorials 
        (title, description, category, difficulty_level, duration, video_url, created_at, views, likes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tutorial.title,
          tutorial.description,
          tutorial.category,
          tutorial.difficultyLevel,
          tutorial.duration,
          tutorial.videoUrl,
          new Date().toISOString(),
          0, // Initial views count
          0  // Initial likes count
        ]
      );
      
      const tutorialId = result.insertId;
      
      // Insert ingredients
      if (tutorial.ingredients && tutorial.ingredients.length > 0) {
        const ingredientValues = tutorial.ingredients.map(ingredient => [tutorialId, ingredient]);
        
        await connection.query(
          'INSERT INTO ingredients (tutorial_id, name) VALUES ?',
          [ingredientValues]
        );
      }
      
      await connection.commit();
      
      // Return the complete tutorial object with all fields
      return {
        id: tutorialId,
        title: tutorial.title,
        description: tutorial.description,
        category: tutorial.category,
        difficulty_level: tutorial.difficultyLevel,
        duration: tutorial.duration,
        video_url: tutorial.videoUrl,
        created_at: new Date().toISOString(),
        views: 0,
        likes: 0,
        ingredients: tutorial.ingredients || []
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error inserting tutorial:', error);
    throw error;
  }
}

async function getAllTutorials() {
  try {
    // Get all tutorials
    const [tutorials] = await pool.execute(
      `SELECT * FROM tutorials ORDER BY created_at DESC`
    );
    
    // Get ingredients for each tutorial
    for (const tutorial of tutorials) {
      const [ingredients] = await pool.execute(
        `SELECT name FROM ingredients WHERE tutorial_id = ?`,
        [tutorial.id]
      );
      
      tutorial.ingredients = ingredients.map(ing => ing.name);
    }
    
    return tutorials;
  } catch (error) {
    console.error('Error getting tutorials:', error);
    throw error;
  }
}

async function getTutorialById(id) {
  try {
    // Get tutorial by ID
    const [tutorials] = await pool.execute(
      `SELECT * FROM tutorials WHERE id = ?`,
      [id]
    );
    
    if (tutorials.length === 0) {
      return null;
    }
    
    const tutorial = tutorials[0];
    
    // Get ingredients for tutorial
    const [ingredients] = await pool.execute(
      `SELECT name FROM ingredients WHERE tutorial_id = ?`,
      [id]
    );
    
    tutorial.ingredients = ingredients.map(ing => ing.name);
    
    return tutorial;
  } catch (error) {
    console.error('Error getting tutorial by ID:', error);
    throw error;
  }
}

async function getTutorialsByCategory(category) {
  try {
    // Get tutorials by category
    const [tutorials] = await pool.execute(
      `SELECT * FROM tutorials WHERE category = ? ORDER BY created_at DESC`,
      [category]
    );
    
    // Get ingredients for each tutorial
    for (const tutorial of tutorials) {
      const [ingredients] = await pool.execute(
        `SELECT name FROM ingredients WHERE tutorial_id = ?`,
        [tutorial.id]
      );
      
      tutorial.ingredients = ingredients.map(ing => ing.name);
    }
    
    return tutorials;
  } catch (error) {
    console.error('Error getting tutorials by category:', error);
    throw error;
  }
}

async function searchTutorials(query) {
  try {
    const searchPattern = `%${query}%`;
    
    // Search tutorials by title or description
    const [tutorials] = await pool.execute(
      `SELECT * FROM tutorials 
       WHERE title LIKE ? OR description LIKE ? 
       ORDER BY created_at DESC`,
      [searchPattern, searchPattern]
    );
    
    // Get ingredients for each tutorial
    for (const tutorial of tutorials) {
      const [ingredients] = await pool.execute(
        `SELECT name FROM ingredients WHERE tutorial_id = ?`,
        [tutorial.id]
      );
      
      tutorial.ingredients = ingredients.map(ing => ing.name);
    }
    
    return tutorials;
  } catch (error) {
    console.error('Error searching tutorials:', error);
    throw error;
  }
}

async function updateTutorial(id, updateData) {
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update tutorial record
      const updateFields = [];
      const updateValues = [];
      
      // Build dynamic update query
      Object.entries(updateData).forEach(([key, value]) => {
        // Skip ingredients as they're handled separately
        if (key !== 'ingredients') {
          // Convert camelCase to snake_case for SQL
          const fieldName = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updateFields.push(`${fieldName} = ?`);
          updateValues.push(value);
        }
      });
      
      if (updateFields.length > 0) {
        const query = `UPDATE tutorials SET ${updateFields.join(', ')} WHERE id = ?`;
        updateValues.push(id);
        
        await connection.execute(query, updateValues);
      }
      
      // Update ingredients if provided
      if (updateData.ingredients) {
        // Delete current ingredients
        await connection.execute(
          `DELETE FROM ingredients WHERE tutorial_id = ?`,
          [id]
        );
        
        // Insert new ingredients
        if (updateData.ingredients.length > 0) {
          const ingredientValues = updateData.ingredients.map(
            ingredient => [id, ingredient]
          );
          
          await connection.query(
            'INSERT INTO ingredients (tutorial_id, name) VALUES ?',
            [ingredientValues]
          );
        }
      }
      
      await connection.commit();
      
      return { id, ...updateData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating tutorial:', error);
    throw error;
  }
}

async function incrementViews(id) {
  try {
    const [result] = await pool.execute(
      `UPDATE tutorials SET views = views + 1 WHERE id = ?`,
      [id]
    );
    
    return result;
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
}

async function toggleLike(id) {
  try {
    const [result] = await pool.execute(
      `UPDATE tutorials SET likes = likes + 1 WHERE id = ?`,
      [id]
    );
    
    return result;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

async function deleteTutorial(id) {
  try {
    // Due to FK constraint and CASCADE, this will also delete ingredients
    const [result] = await pool.execute(
      `DELETE FROM tutorials WHERE id = ?`,
      [id]
    );
    
    return result;
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    throw error;
  }
}

// Initialize database on module import
initializeDatabase().catch(console.error);

// Ensure all queries use `pool`
(async () => {
  try {
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
    await pool.execute(createUsersTableQuery);
    console.log("Users table ensured");

    const createFoodItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS food_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        details TEXT NOT NULL,
        category VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        price DECIMAL(10, 2) NOT NULL
      )
    `;
    await pool.execute(createFoodItemsTableQuery);
    console.log("Food items table ensured");

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
        gluten_free BOOLEAN DEFAULT FALSE,
        cooking_preference VARCHAR(50) DEFAULT NULL,
        sides TEXT DEFAULT NULL,
        dip_sauce VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createCartTableQuery);
    console.log("Cart table ensured");

    const createLoyaltyPointsTableQuery = `
      CREATE TABLE IF NOT EXISTS loyalty_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        points INT NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createLoyaltyPointsTableQuery);
    console.log("Loyalty points table ensured");

    const createOrdersTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Order Placed', -- New field for order status
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createOrdersTableQuery);
    console.log("Orders table ensured");

    const createOrderItemsTableQuery = `
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        food_id INT NOT NULL,
        quantity INT NOT NULL,
        customization JSON DEFAULT NULL,
        price DECIMAL(10, 2) NOT NULL,
        extra_cheese BOOLEAN DEFAULT FALSE,
        extra_meat BOOLEAN DEFAULT FALSE,
        extra_veggies BOOLEAN DEFAULT FALSE,
        no_onions BOOLEAN DEFAULT FALSE,
        no_garlic BOOLEAN DEFAULT FALSE,
        spicy_level VARCHAR(20) DEFAULT 'Medium',
        special_instructions TEXT DEFAULT NULL,
        gluten_free BOOLEAN DEFAULT FALSE,
        cooking_preference VARCHAR(50) DEFAULT NULL,
        sides TEXT DEFAULT NULL,
        dip_sauce VARCHAR(255) DEFAULT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createOrderItemsTableQuery);
    console.log("Order items table ensured");

    const createTutorialsTableQuery = `
      CREATE TABLE IF NOT EXISTS tutorials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        difficulty_level VARCHAR(20) NOT NULL,
        duration INT NOT NULL,
        video_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        views INT DEFAULT 0,
        likes INT DEFAULT 0
      )
    `;
    await pool.execute(createTutorialsTableQuery);
    console.log("Tutorials table ensured");

    const createUserAdditionalInfoTableQuery = `
      CREATE TABLE IF NOT EXISTS user_additional_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        field_name VARCHAR(255) NOT NULL,
        field_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createUserAdditionalInfoTableQuery);
    console.log("User additional info table ensured");

    const createNotificationsTableQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createNotificationsTableQuery);
    console.log("Notifications table ensured");

    const createFavoritesTableQuery = `
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        food_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (food_id) REFERENCES food_items(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (user_id, food_id)
      )
    `;
    await pool.execute(createFavoritesTableQuery);
    console.log("Favorites table ensured");

    const createAddressesTableQuery = `
      CREATE TABLE IF NOT EXISTS addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        label VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        landmark VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await pool.execute(createAddressesTableQuery);
    console.log("Addresses table ensured");

  } catch (error) {
    console.error("Error during database initialization:", error);
  }
})();

// JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET, // Use secret from .env
    { expiresIn: "2h" }
  );
};

// User registration
const registerUser = async (fullName, email, password, phone, address, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (fullName, email, password, phone, address) VALUES (?, ?, ?, ?, ?)`;
    await pool.execute(query, [fullName, email, hashedPassword, phone, address]);
    callback(null, { message: "User registered successfully" });
  } catch (err) {
    callback(err);
  }
};

// User login
const loginUser = async (email, password, callback) => {
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [result] = await pool.execute(query, [email]);
    if (result.length === 0) return callback({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return callback({ message: "Invalid credentials" });

    const token = generateToken(user);
    callback(null, { token, message: "Login successful", userId: user.id });
  } catch (err) {
    callback(err);
  }
};

const addFoodItem = async (foodName, description, details, imagePath, price, category, callback) => {
  try {
    const query = `
      INSERT INTO food_items (name, description, details, image_url, price, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [foodName, description, details, imagePath, price, category]);
    callback(null, { message: "Food item added successfully" });
  } catch (err) {
    callback(err);
  }
};

async function updateLoyaltyPoints(user_id, total_amount, used_points) {
  const earned_points = Math.floor(total_amount / 1000); // Calculate points earned from total_amount

  try {
    // Check if the user already has loyalty points
    const [existingPoints] = await pool.execute(
      "SELECT points FROM loyalty_points WHERE user_id = ?",
      [user_id]
    );

    if (existingPoints.length > 0) {
      // Update existing points
      const current_points = existingPoints[0].points;
      const new_points = Math.max(current_points - used_points, 0) + earned_points;

      await pool.execute(
        "UPDATE loyalty_points SET points = ? WHERE user_id = ?",
        [new_points, user_id]
      );
    } else {
      // If no existing row, log a message and skip the insert
      console.log(`No loyalty points record found for user_id: ${user_id}. Skipping update.`);
    }
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    throw error;
  }
}

async function addNotification(userId, orderId, message) {
  console.log("Adding notification to database:", { userId, orderId, message }); // Debugging log

  try {
    await pool.execute(
      `INSERT INTO notifications (user_id, order_id, message) VALUES (?, ?, ?)`,
      [userId, orderId, message]
    );
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
}

async function getNotifications() {
  try {
    const [notifications] = await pool.execute(
      `SELECT * FROM notifications WHERE is_read = FALSE ORDER BY created_at DESC`
    );
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

async function markNotificationAsRead(notificationId) {
  try {
    await pool.execute(
      `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
      [notificationId]
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

async function fetchChefStats() {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) AS totalOrders, 
        IFNULL(SUM(total_amount), 0) AS totalEarnings 
      FROM orders
      WHERE status IN ('Delivered', 'Cooking', 'Prepared for Delivery', 'Off for Delivery')
    `;
    const [stats] = await pool.execute(statsQuery);
    return stats[0];
  } catch (error) {
    console.error("Error fetching chef stats:", error);
    throw error;
  }
}

async function getAddresses(userId) {
  try {
    const [addresses] = await pool.execute(
      "SELECT * FROM addresses WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

async function addAddress(addressData) {
  try {
    const {
      userId,
      label,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      landmark
    } = addressData;

    const [result] = await pool.execute(
      `INSERT INTO addresses 
       (user_id, label, full_name, phone_number, street, city, state, zip_code, landmark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, label, fullName, phoneNumber, street, city, state, zipCode, landmark]
    );
    return { id: result.insertId, ...addressData };
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
}

async function updateAddress(id, addressData) {
  try {
    const {
      label,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      landmark
    } = addressData;

    await pool.execute(
      `UPDATE addresses 
       SET label = ?, full_name = ?, phone_number = ?, street = ?, 
           city = ?, state = ?, zip_code = ?, landmark = ?
       WHERE id = ?`,
      [label, fullName, phoneNumber, street, city, state, zipCode, landmark, id]
    );
    return { id, ...addressData };
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

async function deleteAddress(id) {
  try {
    await pool.execute("DELETE FROM addresses WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

async function addCharityRecord(userId, charityName, amount) {
  try {
    await pool.execute(
      `INSERT INTO charity (user_id, charity_name, amount) VALUES (?, ?, ?)`,
      [userId, charityName, amount]
    );
    console.log("Charity record added successfully");
  } catch (error) {
    console.error("Error adding charity record:", error);
    throw error;
  }
}

// Export functions
module.exports = {
  pool,
  insertTutorial,
  getAllTutorials,
  getTutorialById,
  getTutorialsByCategory,
  searchTutorials,
  updateTutorial,
  incrementViews,
  toggleLike,
  deleteTutorial,
  registerUser,
  loginUser,
  addFoodItem,
  updateLoyaltyPoints,
  addNotification,
  getNotifications,
  markNotificationAsRead,
  fetchChefStats,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  addCharityRecord,
};
