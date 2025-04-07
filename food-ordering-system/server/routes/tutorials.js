const express = require('express');
const { insertTutorial, getAllTutorials, getTutorialById } = require('../db');

const router = express.Router();

// Add CSP middleware for YouTube domains
router.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' https://img.youtube.com https://i.ytimg.com; " +
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com; " +
    "script-src 'self' https://www.youtube.com https://s.ytimg.com https://www.google.com; " +
    "connect-src https://www.youtube.com https://youtubei.googleapis.com"
  );
  next();
});


// Helper function to validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// Upload tutorial
router.post('/upload', async (req, res) => {
  try {
    // Validate required fields including YouTube URL
    const requiredFields = ['title', 'description', 'category', 'difficultyLevel', 'duration', 'ingredients', 'videoUrl'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        fields: missingFields
      });
    }

    // Validate URL format
    if (!isValidUrl(req.body.videoUrl)) {
      return res.status(400).json({
        message: 'Invalid URL format'
      });
    }

    // Parse and validate ingredients
    let ingredients;
    try {
      ingredients = Array.isArray(req.body.ingredients) ? req.body.ingredients : JSON.parse(req.body.ingredients);
      if (!Array.isArray(ingredients)) {
        throw new Error('Ingredients must be an array');
      }
    } catch (error) {
      return res.status(400).json({
        message: 'Invalid ingredients format',
        error: error.message
      });
    }

    const tutorialData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      difficultyLevel: req.body.difficultyLevel,
      duration: parseInt(req.body.duration),
      videoUrl: req.body.videoUrl,
      ingredients: ingredients
    };

    const tutorial = await insertTutorial(tutorialData);
    res.status(201).json(tutorial);
  } catch (error) {
    console.error('Error uploading tutorial:', error);
    res.status(500).json({ message: 'Failed to upload tutorial', error: error.message });
  }
});

// Get all tutorials
router.get('/', async (req, res) => {
  try {
    const tutorials = await getAllTutorials();
    res.status(200).json(tutorials);
  } catch (error) {
    console.error('Error getting tutorials:', error);
    res.status(500).json({ message: 'Failed to get tutorials', error: error.message });
  }
});

// Get tutorial by ID
router.get('/:id', async (req, res) => {
  try {
    const tutorial = await getTutorialById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.status(200).json(tutorial);
  } catch (error) {
    console.error('Error getting tutorial:', error);
    res.status(500).json({ message: 'Failed to get tutorial', error: error.message });
  }
});

module.exports = router;