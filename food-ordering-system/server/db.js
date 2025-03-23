require("dotenv").config();
// const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'food_ordering',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

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
        file_size BIGINT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
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
        (title, description, category, difficulty_level, duration, video_url, file_size, file_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tutorial.title,
          tutorial.description,
          tutorial.category,
          tutorial.difficultyLevel,
          tutorial.duration,
          tutorial.videoUrl,
          tutorial.fileSize,
          tutorial.fileType,
          tutorial.createdAt || new Date().toISOString()
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
      
      return { id: tutorialId, ...tutorial };
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
        video_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
};
