import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Container,
  Box,
  Chip,
  CardActionArea,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TutorialList = () => {
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTutorials();
  }, []);

  useEffect(() => {
    filterTutorials();
  }, [category, searchQuery, tutorials]);

  const fetchTutorials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tutorials');
      setTutorials(response.data);
      setFilteredTutorials(response.data);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    }
  };

  const filterTutorials = () => {
    let filtered = [...tutorials];

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === category);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTutorials(filtered);
  };

  const getVideoThumbnail = (videoUrl) => {
    // Extract video ID from YouTube URL
    const videoId = videoUrl.split('v=')[1];
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const handleTutorialClick = (tutorialId) => {
    navigate(`/tutorial/${tutorialId}`);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'error'
    };
    return colors[level] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cooking Tutorials
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Main Course">Main Course</MenuItem>
                <MenuItem value="Appetizer">Appetizer</MenuItem>
                <MenuItem value="Dessert">Dessert</MenuItem>
                <MenuItem value="Beverage">Beverage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search tutorials"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredTutorials.map((tutorial) => (
          <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => handleTutorialClick(tutorial.id)}>
                <CardMedia
                  component="img"
                  height="180"
                  image={getVideoThumbnail(tutorial.video_url)}
                  alt={tutorial.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {tutorial.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {tutorial.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={tutorial.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={tutorial.difficulty_level}
                      size="small"
                      color={getDifficultyColor(tutorial.difficulty_level)}
                    />
                    <Chip
                      label={`${tutorial.duration} min`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TutorialList;