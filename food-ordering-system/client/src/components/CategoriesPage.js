import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBell, FaHome, FaThList, FaChartBar, FaUser, FaStar, FaHeart, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { 
  Card, CardMedia, CardContent, Grid, Typography, TextField, Box, Button, Badge, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, IconButton, Rating, 
  Dialog, DialogTitle, DialogContent, DialogActions, Menu, MenuItem, Chip, CircularProgress,
  Pagination, Tabs, Tab, Snackbar, Alert, FormControl, Select, InputLabel, Tooltip, Paper,
  LinearProgress, SwipeableDrawer, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar component
import CustomizeOrderPopup from './CustomizeOrderPopup'; // Import the CustomizeOrderPopup component

const CategoriesPage = () => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemDetailsOpen, setItemDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 100],
    rating: 0,
    dietary: []
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [featuredItems, setFeaturedItems] = useState([]);
  const [currentView, setCurrentView] = useState('grid');
  const [itemsPerPage] = useState(8);
  const [notifications, setNotifications] = useState([]);
  const [openCustomizePopup, setOpenCustomizePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);

  
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/food-items');
        setItems(response.data);
  
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
        
        // Set featured items (top rated or most popular)
        const featured = response.data
          .filter(item => item.rating >= 4.5)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setFeaturedItems(featured);
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Failed to load food items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);
  
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user_id");
    if (!isLoggedIn) {
      setNotification({
        open: true,
        message: "Please log in to access this page.",
        severity: "warning"
      });
    }
  }, []); // Removed navigate dependency

  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
    if (notification.message === "Please log in to access this page.") {
      navigate("/");
    }
  };

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Debugging: Log items to ensure they are being fetched correctly
  useEffect(() => {
    console.log('Fetched items:', items);
  }, [items]);

  // Item Handling
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setPage(1); // Reset to first page when changing category
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setItemDetailsOpen(true);
  };

  const closeItemDetails = () => {
    setItemDetailsOpen(false);
  };

  // Cart Management
  const handleAddToCart = (item) => {
    setSelectedItem({
      ...item,
      price: Number(item.price || 0), // Ensure price is a valid number
    });
    setOpenCustomizePopup(true); // Open the customization popup
  };

  const handleSaveCustomization = async (item, customization) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("Please log in to add items to your cart");
        navigate("/login");
        return;
      }
  
      const sidesValue = customization.sides
        ? customization.sides.map(side => `${side.label} × ${side.quantity}`).join(", ")
        : null;
  
      const dipSauceValue = customization.dip_sauce
        ? customization.dip_sauce.map(dip => `${dip.label} × ${dip.quantity}`).join(", ")
        : null;
  
      const response = await axios.post("http://localhost:5000/cart", {
        food_id: item.id,
        user_id: userId,
        quantity: customization.quantity || 1,
        extraCheese: customization.extraCheese || false,
        extraMeat: customization.extraMeat || false,
        extraVeggies: customization.extraVeggies || false,
        noOnions: customization.noOnions || false,
        noGarlic: customization.noGarlic || false,
        spicyLevel: customization.spicyLevel || 'Medium',
        specialInstructions: customization.specialInstructions || "",
        glutenFree: customization.glutenFree || false,
        cookingPreference: customization.cookingPreference || null,
        sides: sidesValue,
        dip_sauce: dipSauceValue
      });
  
      if (response.data.success) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = cart.findIndex(cartItem =>
          cartItem.id === item.id &&
          cartItem.customization &&
          cartItem.customization.extraCheese === customization.extraCheese &&
          cartItem.customization.extraMeat === customization.extraMeat &&
          cartItem.customization.noOnions === customization.noOnions &&
          cartItem.customization.glutenFree === customization.glutenFree &&
          cartItem.customization.cookingPreference === customization.cookingPreference &&
          cartItem.customization.dip_sauce === customization.dip_sauce
        );
  
        if (existingItemIndex !== -1) {
          cart[existingItemIndex].quantity += customization.quantity;
        } else {
          cart.push({
            ...item,
            price: parseFloat(item.price) || 0, // Ensure price is a valid number
            quantity: customization.quantity,
            customization: {
              extraCheese: customization.extraCheese,
              extraMeat: customization.extraMeat,
              extraVeggies: customization.extraVeggies,
              noOnions: customization.noOnions,
              noGarlic: customization.noGarlic,
              spicyLevel: customization.spicyLevel,
              specialInstructions: customization.specialInstructions,
              glutenFree: customization.glutenFree,
              cookingPreference: customization.cookingPreference,
              dip_sauce: customization.dip_sauce
            }
          });
        }
  
        localStorage.setItem("cart", JSON.stringify(cart));
  
        let customizationDetails = [];
        if (customization.extraCheese) customizationDetails.push("Extra Cheese");
        if (customization.extraMeat) customizationDetails.push("Extra Meat");
        if (customization.extraVeggies) customizationDetails.push("Extra Veggies");
        if (customization.noOnions) customizationDetails.push("No Onions");
        if (customization.noGarlic) customizationDetails.push("No Garlic");
        if (customization.glutenFree) customizationDetails.push("Gluten-Free");
        if (customization.cookingPreference) customizationDetails.push(`Cooking Preference: ${customization.cookingPreference}`);
        if (customization.dip_sauce && customization.dip_sauce.length > 0) {
          const dipSauceDetails = customization.dip_sauce.map(dip => `${dip.label} × ${dip.quantity}`).join(", ");
          customizationDetails.push(`Dip/Sauce: ${dipSauceDetails}`);
        }
        if (customization.sides && customization.sides.length > 0) {
          const sidesDetails = customization.sides.map(side => `${side.label} × ${side.quantity}`).join(", ");
          customizationDetails.push(`Sides: ${sidesDetails}`);
        }
        if (customization.spicyLevel !== 'Medium') customizationDetails.push(`${customization.spicyLevel} Spice`);
  
        let messageDetails = customizationDetails.length > 0
          ? ` with ${customizationDetails.join(", ")}`
          : "";
  
        setPopupMessage(`${item.name} × ${customization.quantity} added to cart${messageDetails}!`);
        setOpenPopup(true);
      } else {
        console.error("Failed to add item to cart:", response.data.message);
        alert("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding customized order:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    
    setNotification({
      open: true,
      message: 'Item removed from cart',
      severity: 'info'
    });
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const clearCart = () => {
    setCart([]);
    setNotification({
      open: true,
      message: 'Cart has been cleared',
      severity: 'info'
    });
  };

  // Favorite Management
  const toggleFavorite = (itemId) => {
    if (favorites.includes(itemId)) {
      setFavorites(favorites.filter(id => id !== itemId));
      setNotification({
        open: true,
        message: 'Removed from favorites',
        severity: 'info'
      });
    } else {
      setFavorites([...favorites, itemId]);
      setNotification({
        open: true,
        message: 'Added to favorites!',
        severity: 'success'
      });
    }
  };

  const isFavorite = (itemId) => favorites.includes(itemId);

  // Sorting and Filtering
  const handleSortChange = (option) => {
    setSortOption(option);
    setSortMenuAnchorEl(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilterOptions({
      ...filterOptions,
      [filterType]: value
    });
  };

  const applyFilters = () => {
    setFilterDrawerOpen(false);
    setPage(1); // Reset to first page when applying filters
  };

  const resetFilters = () => {
    setFilterOptions({
      priceRange: [0, 100],
      rating: 0,
      dietary: []
    });
  };

  // Ensure processedItems is not empty due to overly restrictive filters
  const processedItems = items
    .filter((item) => {
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = 
        filterOptions.priceRange[0] === 0 && filterOptions.priceRange[1] === 100 
          ? true 
          : item.price >= filterOptions.priceRange[0] && item.price <= filterOptions.priceRange[1];
      const matchesRating = filterOptions.rating === 0 ? true : item.rating >= filterOptions.rating;
      const matchesDietary = filterOptions.dietary.length === 0 || 
        (item.dietary && filterOptions.dietary.every(tag => item.dietary.includes(tag)));

      // Debugging: Log each filter condition
      console.log('Item:', item.name, {
        matchesCategory,
        matchesSearch,
        matchesPrice,
        matchesRating,
        matchesDietary
      });

      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesDietary;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Debugging: Log processedItems to verify filtering logic
  useEffect(() => {
    console.log('Processed items:', processedItems);
  }, [processedItems]);

  // Fallback: Display a message if items are empty
  if (!loading && items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No items available
        </Typography>
        <Typography variant="body2" sx={{ color: '#888' }}>
          Please check back later.
        </Typography>
      </Box>
    );
  }

  // Pagination
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedItems.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // UI Management
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCartDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setCartDrawerOpen(open);
  };

  const toggleFilterDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setFilterDrawerOpen(open);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const openSortMenu = (event) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  const closeSortMenu = () => {
    setSortMenuAnchorEl(null);
  };

  const toggleView = (view) => {
    setCurrentView(view);
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Authentication
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");
    navigate("/login");
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      setNotification({
        open: true,
        message: 'Your cart is empty',
        severity: 'warning'
      });
      return;
    }
    navigate("/checkout");
  };

  // -------------------- RENDER FUNCTIONS --------------------

  // Render item card
  const renderItemCard = (item) => {
    const price = Number(item.price || 0); // Ensure price is a valid number
  
    return (
      <Card sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        backgroundColor: '#fff',
        position: 'relative',
        '&:hover': { 
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={item.image_url}
            alt={item.name}
            sx={{ objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => openItemDetails(item)}
          />
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
            onClick={() => toggleFavorite(item.id)}
          >
            {isFavorite(item.id) ? 
              <FavoriteIcon sx={{ color: '#FF6384' }} /> : 
              <FavoriteBorderIcon sx={{ color: '#888' }} />
            }
          </IconButton>
          {item.isNew && (
            <Chip 
              label="New" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8, 
                bgcolor: '#FF6384', 
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          )}
          {item.discount > 0 && (
            <Chip 
              label={`${item.discount}% OFF`} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                left: 8, 
                bgcolor: '#4CAF50', 
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          )}
        </Box>
        <CardContent sx={{ padding: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { color: '#FF6384' }
            }}
            onClick={() => openItemDetails(item)}
          >
            {item.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={item.rating || 4.5} precision={0.5} size="small" readOnly />
            <Typography variant="body2" sx={{ ml: 0.5, color: '#777' }}>
              ({item.reviewCount || Math.floor(Math.random() * 100) + 10})
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2
            }}
          >
            {item.description || `Delicious ${item.name.toLowerCase()} prepared with fresh ingredients.`}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {(item.dietary || ['Fresh']).map((tag, idx) => (
              <Chip 
                key={idx} 
                label={tag} 
                size="small" 
                sx={{ fontSize: '0.7rem', height: 20 }} 
              />
            ))}
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: item.discount > 0 ? '#FF6384' : 'inherit' }}>
              ${item.discount > 0 
                ? (price * (1 - item.discount / 100)).toFixed(2) 
                : price.toFixed(2)}
              {item.discount > 0 && (
                <Typography 
                  component="span" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: '#999', 
                    fontSize: '0.8rem',
                    ml: 0.5
                  }}
                >
                  ${price.toFixed(2)}
                </Typography>
              )}
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleAddToCart(item)}
              sx={{ 
                backgroundColor: '#FF6384',
                '&:hover': { backgroundColor: '#f55c7a' },
                borderRadius: 8,
                textTransform: 'none'
              }}
            >
              Add <FaShoppingCart style={{ marginLeft: 5 }} />
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  // Render item list view
  const renderItemListView = (item) => {
    const price = Number(item.price || 0); // Ensure price is a valid number
  
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { 
            transform: 'translateX(5px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ display: 'flex', height: '120px' }}>
          <Box 
            sx={{ 
              width: '120px', 
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => openItemDetails(item)}
          >
            <img 
              src={item.image_url} 
              alt={item.name} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
            {item.discount > 0 && (
              <Chip 
                label={`${item.discount}% OFF`} 
                size="small" 
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  left: 5, 
                  bgcolor: '#4CAF50', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem'
                }} 
              />
            )}
          </Box>
          <Box sx={{ 
            p: 2, 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between' 
          }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': { color: '#FF6384' }
                  }}
                  onClick={() => openItemDetails(item)}
                >
                  {item.name}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => toggleFavorite(item.id)}
                  sx={{ ml: 1 }}
                >
                  {isFavorite(item.id) ? 
                    <FavoriteIcon fontSize="small" sx={{ color: '#FF6384' }} /> : 
                    <FavoriteBorderIcon fontSize="small" sx={{ color: '#888' }} />
                  }
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Rating value={item.rating || 4.5} precision={0.5} size="small" readOnly />
                <Typography variant="body2" sx={{ ml: 0.5, color: '#777', fontSize: '0.75rem' }}>
                  ({item.reviewCount || Math.floor(Math.random() * 100) + 10})
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1
                }}
              >
                {item.description || `Delicious ${item.name.toLowerCase()} prepared with fresh ingredients.`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: item.discount > 0 ? '#FF6384' : 'inherit' }}>
                ${item.discount > 0 
                  ? (price * (1 - item.discount / 100)).toFixed(2) 
                  : price.toFixed(2)}
                {item.discount > 0 && (
                  <Typography 
                    component="span" 
                    sx={{ 
                      textDecoration: 'line-through', 
                      color: '#999', 
                      fontSize: '0.8rem',
                      ml: 0.5
                    }}
                  >
                    ${price.toFixed(2)}
                  </Typography>
                )}
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleAddToCart(item)}
                sx={{ 
                  backgroundColor: '#FF6384',
                  '&:hover': { backgroundColor: '#f55c7a' },
                  borderRadius: 8,
                  textTransform: 'none'
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  };

  // Main content skeleton when loading
  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ height: 180, bgcolor: '#eee' }} />
            <CardContent>
              <Box sx={{ bgcolor: '#eee', height: 24, width: '80%', mb: 1, borderRadius: 1 }} />
              <Box sx={{ bgcolor: '#eee', height: 16, width: '40%', mb: 2, borderRadius: 1 }} />
              <Box sx={{ bgcolor: '#eee', height: 16, width: '100%', mb: 1, borderRadius: 1 }} />
              <Box sx={{ bgcolor: '#eee', height: 16, width: '90%', mb: 2, borderRadius: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ bgcolor: '#eee', height: 24, width: '30%', borderRadius: 1 }} />
                <Box sx={{ bgcolor: '#eee', height: 36, width: '40%', borderRadius: 8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Sidebar Component */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        handleLogout={handleLogout} 
      />

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        padding: { xs: 2, md: 4 },
        bgcolor: '#f5f5f7',
        borderLeft: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Mobile Header */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 2,
          backgroundColor: '#fff',
          padding: 1,
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Food Menu
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 1 }} onClick={toggleCartDrawer(true)}>
              <Badge badgeContent={cart.length} color="error">
                <FaShoppingCart />
              </Badge>
            </IconButton>
            <IconButton onClick={handleUserMenuOpen}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: '#FF6384' }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Page Title */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 3, 
          display: { xs: 'none', md: 'flex' }
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: '#333'
          }}>
            Discover Food Items
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<FaFilter />}
              onClick={toggleFilterDrawer(true)}
              sx={{ 
                borderColor: '#FF6384',
                color: '#FF6384',
                '&:hover': { borderColor: '#f55c7a', bgcolor: 'rgba(255,99,132,0.1)' }
              }}
            >
              Filter
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<SortIcon />}
              onClick={openSortMenu}
              sx={{ 
                borderColor: '#FF6384',
                color: '#FF6384',
                '&:hover': { borderColor: '#f55c7a', bgcolor: 'rgba(255,99,132,0.1)' }
              }}
            >
              Sort
            </Button>
            <Box sx={{ display: 'flex', border: '1px solid #ddd', borderRadius: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => toggleView('grid')}
                sx={{ 
                  bgcolor: currentView === 'grid' ? 'rgba(255,99,132,0.1)' : 'transparent',
                  color: currentView === 'grid' ? '#FF6384' : 'inherit'
                }}
              >
                <FaThList style={{ transform: 'rotate(90deg)' }} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => toggleView('list')}
                sx={{ 
                  bgcolor: currentView === 'list' ? 'rgba(255,99,132,0.1)' : 'transparent',
                  color: currentView === 'list' ? '#FF6384' : 'inherit'
                }}
              >
                <FaThList />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#fff', 
          padding: 2, 
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: 3
        }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for food items..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#777' }} />,
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2 }}>
            <IconButton onClick={toggleCartDrawer(true)}>
              <Badge badgeContent={cart.length} color="error">
                <FaShoppingCart />
              </Badge>
            </IconButton>
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={notifications?.length || 0} color="primary">
                <FaBell />
              </Badge>
            </IconButton>
            <IconButton sx={{ ml: 1 }} onClick={handleUserMenuOpen}>
              <Avatar sx={{ bgcolor: '#FF6384' }}>
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Box>

        {/* Mobile Filter and Sort Bar */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          justifyContent: 'space-between', 
          mb: 2,
          gap: 1
        }}>
          <Button 
            fullWidth
            variant="outlined" 
            startIcon={<FaFilter />}
            onClick={toggleFilterDrawer(true)}
            size="small"
            sx={{ 
              borderColor: '#FF6384',
              color: '#FF6384',
              '&:hover': { borderColor: '#f55c7a', bgcolor: 'rgba(255,99,132,0.1)' }
            }}
          >
            Filter
          </Button>
          <Button 
            fullWidth
            variant="outlined" 
            startIcon={<SortIcon />}
            onClick={openSortMenu}
            size="small"
            sx={{ 
              borderColor: '#FF6384',
              color: '#FF6384',
              '&:hover': { borderColor: '#f55c7a', bgcolor: 'rgba(255,99,132,0.1)' }
            }}
          >
            Sort
          </Button>
          <Box sx={{ 
            display: 'flex', 
            border: '1px solid #ddd', 
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <IconButton 
              size="small" 
              onClick={() => toggleView('grid')}
              sx={{ 
                bgcolor: currentView === 'grid' ? 'rgba(255,99,132,0.1)' : 'transparent',
                color: currentView === 'grid' ? '#FF6384' : 'inherit',
                borderRadius: 0
              }}
            >
              <FaThList style={{ transform: 'rotate(90deg)' }} />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => toggleView('list')}
              sx={{ 
                bgcolor: currentView === 'list' ? 'rgba(255,99,132,0.1)' : 'transparent',
                color: currentView === 'list' ? '#FF6384' : 'inherit',
                borderRadius: 0
              }}
            >
              <FaThList />
            </IconButton>
          </Box>
        </Box>

        {/* Category Chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {categories.map(category => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? "filled" : "outlined"}
              sx={{
                bgcolor: selectedCategory === category ? '#FF6384' : 'white',
                color: selectedCategory === category ? 'white' : 'inherit',
                borderColor: '#FF6384',
                '&:hover': { bgcolor: selectedCategory === category ? '#f55c7a' : 'rgba(255,99,132,0.1)' },
                transition: 'all 0.2s',
                fontWeight: selectedCategory === category ? 'bold' : 'normal'
              }}
            />
          ))}
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <>
            <LinearProgress sx={{ mb: 2 }} />
            {renderSkeletons()}
          </>
        ) : (
          <>
            {/* Featured Items Section */}
            {!selectedCategory && !searchQuery && page === 1 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                  <FaStar style={{ color: '#FFD700', marginRight: 8 }} /> Featured Items
                </Typography>
                <Grid container spacing={3}>
                  {featuredItems.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.id}>
                      {renderItemCard(item)}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Results Info */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              background: 'white',
              padding: 2,
              borderRadius: 2,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="body1">
                Showing {processedItems.length === 0 ? '0' : indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, processedItems.length)} of {processedItems.length} results
                {selectedCategory && ` in "${selectedCategory}"`}
                {searchQuery && ` for "${searchQuery}"`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {sortOption && (
                  <Chip 
                    label={
                      sortOption === 'price-asc' ? 'Price: Low to High' :
                      sortOption === 'price-desc' ? 'Price: High to Low' :
                      sortOption === 'rating-desc' ? 'Highest Rated' :
                      sortOption === 'name-asc' ? 'Name: A-Z' : 'Sorted'
                    }
                    size="small"
                    onDelete={() => setSortOption('')}
                    sx={{ mr: 1 }}
                  />
                )}
                {(filterOptions.priceRange[0] > 0 || 
                  filterOptions.priceRange[1] < 100 ||
                  filterOptions.rating > 0 ||
                  filterOptions.dietary.length > 0) && (
                  <Chip 
                    label="Filtered" 
                    size="small"
                    onDelete={resetFilters}
                    color="primary"
                  />
                )}
              </Box>
            </Box>

            {/* No Results Message */}
            {processedItems.length === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                  No items found
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#888' }}>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    resetFilters();
                  }}
                  sx={{ 
                    bgcolor: '#FF6384',
                    '&:hover': { bgcolor: '#f55c7a' }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}

            {/* Items Grid/List */}
            {processedItems.length > 0 && (
              currentView === 'grid' ? (
                <Grid container spacing={3}>
                  {currentItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                      {renderItemCard(item)}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box>
                  {currentItems.map((item) => renderItemListView(item))}
                </Box>
              )
            )}

            {/* Pagination */}
            {processedItems.length > itemsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root.Mui-selected': {
                      backgroundColor: '#FF6384',
                      color: 'white'
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Item Details Modal */}
      <Dialog 
        open={itemDetailsOpen} 
        onClose={closeItemDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              pb: 1
            }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {selectedItem.name}
              </Typography>
              <IconButton onClick={closeItemDetails} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 2 }}>
                <Box sx={{ 
                  width: { xs: '100%', md: '40%' }, 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.name} 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: 8,
                      objectFit: 'cover'
                    }} 
                  />
                  {selectedItem.discount > 0 && (
                    <Chip 
                      label={`${selectedItem.discount}% OFF`} 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        left: 8, 
                        bgcolor: '#4CAF50', 
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  )}
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={() => toggleFavorite(selectedItem.id)}
                  >
                    {isFavorite(selectedItem.id) ? 
                      <FavoriteIcon sx={{ color: '#FF6384' }} /> : 
                      <FavoriteBorderIcon sx={{ color: '#888' }} />
                    }
                  </IconButton>
                </Box>
                <Box sx={{ 
                  width: { xs: '100%', md: '60%' }, 
                  pl: { xs: 0, md: 3 },
                  mt: { xs: 2, md: 0 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={selectedItem.rating || 4.5} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: '#777' }}>
                      ({selectedItem.reviewCount || Math.floor(Math.random() * 100) + 10} reviews)
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedItem.description || `Delicious ${selectedItem.name.toLowerCase()} prepared with fresh ingredients.`}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: selectedItem.discount > 0 ? '#FF6384' : 'inherit' }}>
                    ${selectedItem.discount > 0 
                      ? (parseFloat(selectedItem.price || 0) * (1 - selectedItem.discount / 100)).toFixed(2) 
                      : parseFloat(selectedItem.price || 0).toFixed(2)}
                    {selectedItem.discount > 0 && (
                      <Typography 
                        component="span" 
                        sx={{ 
                          textDecoration: 'line-through', 
                          color: '#999', 
                          fontSize: '1rem',
                          ml: 1
                        }}
                      >
                        ${parseFloat(selectedItem.price || 0).toFixed(2)}
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Dietary Information:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {(selectedItem.dietary || ['Fresh']).map((tag, idx) => (
                      <Chip 
                        key={idx} 
                        label={tag} 
                        size="small" 
                        sx={{ fontSize: '0.7rem', height: 24 }} 
                      />
                    ))}
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mt: 3,
                    mb: 2, 
                    gap: 2
                  }}>
                    <Button
                      variant="contained"
                      onClick={() => handleAddToCart(selectedItem)}
                      sx={{ 
                        backgroundColor: '#FF6384',
                        '&:hover': { backgroundColor: '#f55c7a' },
                        borderRadius: 8,
                        textTransform: 'none',
                        flexGrow: 1
                      }}
                    >
                      Add to Cart <FaShoppingCart style={{ marginLeft: 8 }} />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => toggleFavorite(selectedItem.id)}
                      sx={{ 
                        borderColor: '#FF6384',
                        color: isFavorite(selectedItem.id) ? '#FF6384' : 'inherit',
                        '&:hover': { borderColor: '#f55c7a', bgcolor: 'rgba(255,99,132,0.1)' },
                        borderRadius: 8,
                        textTransform: 'none'
                      }}
                    >
                      {isFavorite(selectedItem.id) ? 'Saved' : 'Save'} <FaHeart style={{ marginLeft: 8 }} />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Cart Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={toggleCartDrawer(false)}
        onOpen={toggleCartDrawer(true)}
      >
        <Box sx={{ width: 350, maxWidth: '100vw', p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Shopping Cart ({cart.length})
            </Typography>
            <IconButton onClick={toggleCartDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {cart.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' 
            }}>
              <FaShoppingCart style={{ fontSize: 48, color: '#ddd', marginBottom: 16 }} />
              <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#888' }}>
                Add some items to get started
              </Typography>
              <Button
                variant="contained"
                onClick={toggleCartDrawer(false)}
                sx={{ 
                  bgcolor: '#FF6384',
                  '&:hover': { bgcolor: '#f55c7a' }
                }}
              >
                Browse Menu
              </Button>
            </Box>
          ) : (
            <>
              <List sx={{ mb: 3 }}>
                {cart.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        width: '100%', 
                        alignItems: 'center',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: 1,
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                          />
                        </Box>
                        <Box sx={{ ml: 2, overflow: 'hidden', flexGrow: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 'bold',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${parseFloat(item.price)} × {item.quantity}
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mt: 0.5 
                          }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              sx={{ p: 0.5 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              sx={{ p: 0.5 }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ ml: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            ${(parseFloat(item.price) * item.quantity)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => removeFromCart(item.id)}
                            sx={{ 
                              p: 0.5, 
                              color: '#999',
                              '&:hover': { color: '#FF6384' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ 
                bgcolor: '#f8f8f8', 
                p: 2, 
                borderRadius: 2,
                mb: 3
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">${getCartTotal()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Delivery:</Typography>
                  <Typography variant="body2">${cart.length > 0 ? '2.99' : '0.00'}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    ${cart.length > 0 ? (parseFloat(getCartTotal()) + 2.99).toFixed(2) : '0.00'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={proceedToCheckout}
                  sx={{ 
                    bgcolor: '#FF6384',
                    '&:hover': { bgcolor: '#f55c7a' },
                    borderRadius: 8,
                    py: 1
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={clearCart}
                  sx={{ 
                    borderColor: '#ddd',
                    color: '#666',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    borderRadius: 8
                  }}
                >
                  Clear Cart
                </Button>
              </Box>
            </>
          )}
        </Box>
      </SwipeableDrawer>

      {/* Filter Drawer */}
      <SwipeableDrawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={toggleFilterDrawer(false)}
        onOpen={toggleFilterDrawer(true)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Filters
            </Typography>
            <IconButton onClick={toggleFilterDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Price Range
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* Price range implementation would go here */}
              <Box sx={{ px: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Min: ${filterOptions.priceRange[0]} - Max: ${filterOptions.priceRange[1]}
                </Typography>
                {/* Slider component would be implemented here */}
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dietary Preferences
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Organic'].map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onClick={() => {
                      const current = filterOptions.dietary;
                      handleFilterChange('dietary', 
                        current.includes(option) 
                          ? current.filter(item => item !== option)
                          : [...current, option]
                      );
                    }}
                    color={filterOptions.dietary.includes(option) ? "primary" : "default"}
                    variant={filterOptions.dietary.includes(option) ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Minimum Rating
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={filterOptions.rating}
                  onChange={(event, newValue) => {
                    handleFilterChange('rating', newValue);
                  }}
                  precision={0.5}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {filterOptions.rating > 0 ? `${filterOptions.rating}+` : 'Any'}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={applyFilters}
              sx={{ 
                bgcolor: '#FF6384',
                '&:hover': { bgcolor: '#f55c7a' }
              }}
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{ 
                borderColor: '#ddd',
                color: '#666',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchorEl}
        open={Boolean(sortMenuAnchorEl)}
        onClose={closeSortMenu}
      >
        <MenuItem 
          onClick={() => handleSortChange('price-asc')}
          selected={sortOption === 'price-asc'}
        >
          Price: Low to High
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('price-desc')}
          selected={sortOption === 'price-desc'}
        >
          Price: High to Low
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('rating-desc')}
          selected={sortOption === 'rating-desc'}
        >
          Highest Rated
        </MenuItem>
        <MenuItem 
          onClick={() => handleSortChange('name-asc')}
          selected={sortOption === 'name-asc'}
        >
          Name: A-Z
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem>
          <ListItemIcon>
            <FaUser size={16} />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FaHeart size={16} />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FaShoppingCart size={16} />
          </ListItemIcon>
          <ListItemText primary="My Orders" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleNotificationClose} // Updated to use handleNotificationClose
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Customize Order Popup */}
      {selectedItem && (
        <CustomizeOrderPopup
          open={openCustomizePopup}
          onClose={() => setOpenCustomizePopup(false)}
          onSave={handleSaveCustomization}
          item={selectedItem} // Pass the selected item with a valid price
        />
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={openPopup}
        autoHideDuration={3000}
        onClose={() => setOpenPopup(false)}
        message={popupMessage}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#43a047",
            color: "#fff"
          }
        }}
      />
    </Box>
  );
};

export default CategoriesPage;