import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  CircularProgress, 
  Container,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Rating,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Avatar,
  Skeleton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import VideocamIcon from "@mui/icons-material/Videocam";

const ViewTutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [savedTutorials, setSavedTutorials] = useState({});
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [currentSort, setCurrentSort] = useState("Newest");

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tutorials");
        // Add placeholder data for demo purposes if the API returns empty results
        const tutorialsData = response.data.length > 0 ? response.data : generatePlaceholderData();
        setTutorials(tutorialsData);
        setFilteredTutorials(tutorialsData);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        setError("Failed to load tutorials. Please try again later.");
        // Use placeholder data for demo if API fails
        const placeholderData = generatePlaceholderData();
        setTutorials(placeholderData);
        setFilteredTutorials(placeholderData);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  // Generate placeholder data for demo purposes
  const generatePlaceholderData = () => {
    return [
      {
        id: 1,
        title: "Perfect Homemade Pizza",
        description: "Learn how to make an authentic Italian pizza from scratch with a crispy crust and delicious toppings.",
        video_url: "https://example.com/videos/pizza-tutorial.mp4",
        thumbnail: "/images/pizza-tutorial.jpg",
        author: "Chef Mario",
        duration: "12:34",
        views: 15420,
        likes: 1250,
        created_at: "2025-03-01T10:30:00Z",
        category: "Italian",
        rating: 4.8
      },
      {
        id: 2,
        title: "Sushi Rolling Masterclass",
        description: "Master the art of sushi rolling with this step-by-step guide to making perfect maki rolls every time.",
        video_url: "https://example.com/videos/sushi-tutorial.mp4",
        thumbnail: "/images/sushi-tutorial.jpg",
        author: "Chef Akira",
        duration: "18:22",
        views: 8930,
        likes: 720,
        created_at: "2025-02-28T14:15:00Z",
        category: "Japanese",
        rating: 4.6
      },
      {
        id: 3,
        title: "Perfect Chocolate Cake",
        description: "Bake a moist and decadent chocolate cake that's perfect for any celebration or special occasion.",
        video_url: "https://example.com/videos/chocolate-cake.mp4",
        thumbnail: "/images/chocolate-cake.jpg",
        author: "Pastry Chef Emma",
        duration: "15:45",
        views: 12340,
        likes: 980,
        created_at: "2025-02-25T09:45:00Z",
        category: "Desserts",
        rating: 4.9
      },
      {
        id: 4,
        title: "Thai Green Curry",
        description: "Create an authentic Thai green curry with the perfect balance of spicy, sweet, and savory flavors.",
        video_url: "https://example.com/videos/thai-curry.mp4",
        thumbnail: "/images/thai-curry.jpg",
        author: "Chef Nong",
        duration: "14:18",
        views: 7850,
        likes: 650,
        created_at: "2025-03-10T16:20:00Z",
        category: "Thai",
        rating: 4.7
      },
      {
        id: 5,
        title: "French Croissants",
        description: "Learn the techniques for making flaky, buttery French croissants from scratch in your home kitchen.",
        video_url: "https://example.com/videos/croissants.mp4",
        thumbnail: "/images/croissants.jpg",
        author: "Chef Jean",
        duration: "22:05",
        views: 9320,
        likes: 820,
        created_at: "2025-03-15T11:10:00Z",
        category: "French",
        rating: 4.5
      },
      {
        id: 6,
        title: "Indian Butter Chicken",
        description: "Master this classic Indian dish with tender chicken pieces in a rich, creamy tomato sauce.",
        video_url: "https://example.com/videos/butter-chicken.mp4",
        thumbnail: "/images/butter-chicken.jpg",
        author: "Chef Priya",
        duration: "16:30",
        views: 11250,
        likes: 940,
        created_at: "2025-03-05T13:25:00Z",
        category: "Indian",
        rating: 4.8
      }
    ];
  };

  // Filter tutorials based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTutorials(tutorials);
    } else {
      const filtered = tutorials.filter(tutorial => 
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutorial.category && tutorial.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTutorials(filtered);
    }
  }, [searchQuery, tutorials]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setFilterAnchorEl(null);
    
    if (filter === "All") {
      setFilteredTutorials(tutorials);
    } else {
      const filtered = tutorials.filter(tutorial => 
        tutorial.category === filter
      );
      setFilteredTutorials(filtered);
    }
  };

  // Handle sort change
  const handleSortChange = (sort) => {
    setCurrentSort(sort);
    setSortAnchorEl(null);
    
    let sorted = [...filteredTutorials];
    
    switch (sort) {
      case "Newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "Oldest":
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "Most Viewed":
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "Most Liked":
        sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "Highest Rated":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default to newest
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    setFilteredTutorials(sorted);
  };

  // Toggle save tutorial
  const handleSaveTutorial = (id) => {
    setSavedTutorials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Format views count
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 1 }} />
              <Skeleton variant="text" width="80%" height={30} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error && tutorials.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2, bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <VideocamIcon sx={{ fontSize: 32, color: "#ff9800", mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Cooking Tutorials
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          href="/upload-tutorial"
          sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
        >
          Share Your Tutorial
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, borderRadius: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="Search tutorials..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9e9e9e" }} />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<FilterListIcon />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{ minWidth: 120 }}
        >
          {currentFilter}
        </Button>
        
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
        >
          <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
          <MenuItem onClick={() => handleFilterChange("Italian")}>Italian</MenuItem>
          <MenuItem onClick={() => handleFilterChange("Japanese")}>Japanese</MenuItem>
          <MenuItem onClick={() => handleFilterChange("Indian")}>Indian</MenuItem>
          <MenuItem onClick={() => handleFilterChange("Thai")}>Thai</MenuItem>
          <MenuItem onClick={() => handleFilterChange("French")}>French</MenuItem>
          <MenuItem onClick={() => handleFilterChange("Desserts")}>Desserts</MenuItem>
        </Menu>
        
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<SortIcon />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          sx={{ minWidth: 140 }}
        >
          {currentSort}
        </Button>
        
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSortChange("Newest")}>Newest</MenuItem>
          <MenuItem onClick={() => handleSortChange("Oldest")}>Oldest</MenuItem>
          <MenuItem onClick={() => handleSortChange("Most Viewed")}>Most Viewed</MenuItem>
          <MenuItem onClick={() => handleSortChange("Most Liked")}>Most Liked</MenuItem>
          <MenuItem onClick={() => handleSortChange("Highest Rated")}>Highest Rated</MenuItem>
        </Menu>
      </Paper>

      {/* Tutorials Grid */}
      {filteredTutorials.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            No tutorials found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTutorials.map((tutorial) => (
            <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
              <Card 
                sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="div"
                    sx={{ 
                      pt: "56.25%", // 16:9 aspect ratio
                      position: "relative",
                      cursor: "pointer"
                    }}
                    image={tutorial.thumbnail || `/api/placeholder/400/225`}
                  >
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        bottom: 10, 
                        right: 10, 
                        bgcolor: "rgba(0,0,0,0.7)", 
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem"
                      }}
                    >
                      {tutorial.duration}
                    </Box>
                    
                    <Box 
                      sx={{ 
                        position: "absolute", 
                        top: 10, 
                        right: 10
                      }}
                    >
                      <IconButton 
                        sx={{ color: "white", bgcolor: "rgba(0,0,0,0.3)" }}
                        onClick={() => handleSaveTutorial(tutorial.id)}
                      >
                        {savedTutorials[tutorial.id] ? 
                          <BookmarkIcon sx={{ color: "#ff9800" }} /> : 
                          <BookmarkBorderIcon />
                        }
                      </IconButton>
                    </Box>
                  </CardMedia>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip 
                      label={tutorial.category || "Cooking"} 
                      size="small"
                      sx={{ 
                        bgcolor: "#f0f4c3", 
                        color: "#827717",
                        fontWeight: "bold",
                        fontSize: "0.7rem"
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(tutorial.created_at)}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: "600", 
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      mb: 1
                    }}
                  >
                    {tutorial.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "2.5em"
                    }}
                  >
                    {tutorial.description}
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1, mt: "auto" }}>
                    <Avatar 
                      src={`/api/placeholder/30/30`} 
                      alt={tutorial.author}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {tutorial.author}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Rating 
                        value={tutorial.rating || 0} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                      />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {tutorial.rating?.toFixed(1) || "N/A"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                      <Typography variant="caption" sx={{ display: "flex", alignItems: "center" }}>
                        <ThumbUpIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                        {tutorial.likes || 0}
                      </Typography>
                      <Typography variant="caption">
                        {formatViews(tutorial.views || 0)} views
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <Divider />
                
                <Box sx={{ display: "flex", p: 1 }}>
                  <Button 
                    fullWidth 
                    variant="text" 
                    size="small"
                    sx={{ color: "#ff9800" }}
                  >
                    Watch Now
                  </Button>
                  <IconButton size="small">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Load More Button */}
      {filteredTutorials.length > 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button 
            variant="outlined" 
            color="inherit"
            sx={{ px: 4 }}
          >
            Load More
          </Button>
        </Box>
      )}
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          mt: 6, 
          py: 3, 
          textAlign: "center",
          borderTop: "1px solid #e0e0e0"
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © YOO!!! All Rights Reserved — Discover and share cooking tutorials
        </Typography>
      </Box>
    </Container>
  );
};

export default ViewTutorials;