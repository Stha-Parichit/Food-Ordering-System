// import React, { useState, useEffect } from "react";
// import { 
//   Dialog, 
//   DialogTitle, 
//   DialogContent, 
//   DialogActions,
//   Typography,
//   TextField,
//   FormControlLabel,
//   Checkbox,
//   Button,
//   Grid,
//   Divider,
//   Box,
//   IconButton,
//   Chip,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from "@mui/material";
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import CloseIcon from '@mui/icons-material/Close';
// import { makeStyles } from '@mui/styles';

// // Define common customization options for food items
// const COMMON_TOPPINGS = [
//   { id: 'extraCheese', label: 'Extra Cheese', price: 35 },
//   { id: 'extraMeat', label: 'Extra Meat', price: 50 },
//   { id: 'extraVeggies', label: 'Extra Veggies', price: 30 }
// ];

// const COMMON_PREFERENCES = [
//   { id: 'noOnions', label: 'No Onions' },
//   { id: 'noGarlic', label: 'No Garlic' },
//   { id: 'spicyLevel', label: 'Spicy Level', type: 'select', options: ['Mild', 'Medium', 'Hot', 'Extra Hot'] }
// ];

// const useStyles = makeStyles((theme) => ({
//   dialogContent: {
//     paddingTop: 16
//   },
//   quantityControls: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: 16
//   },
//   quantityButton: {
//     minWidth: 'unset'
//   },
//   quantityText: {
//     margin: '0 16px',
//     fontWeight: 'bold'
//   },
//   priceDisplay: {
//     fontWeight: 'bold',
//     color: '#ff9800',
//     marginTop: 16
//   },
//   sectionTitle: {
//     marginTop: 16,
//     marginBottom: 8,
//     fontWeight: 'bold'
//   },
//   itemImage: {
//     width: '100%',
//     height: 120,
//     objectFit: 'cover',
//     borderRadius: 8,
//     marginBottom: 16
//   },
//   chipContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginTop: 8,
//     marginBottom: 16
//   }
// }));

// const CustomizeOrderPopup = ({ open, onClose, onSave, item }) => {
//   const classes = useStyles();
//   const [quantity, setQuantity] = useState(1);
//   const [customization, setCustomization] = useState({
//     extraCheese: false,
//     extraMeat: false,
//     extraVeggies: false,
//     noOnions: false,
//     noGarlic: false,
//     spicyLevel: 'Medium',
//     specialInstructions: ""
//   });
//   const [totalPrice, setTotalPrice] = useState(0);

//   // Calculate total price whenever quantity or customizations change
//   useEffect(() => {
//     console.log("Item received in popup:", item); // Debugging log
//     if (!item || item.price == null) return; // Ensure item and price exist
  
//     let price = Number(item.price) * quantity; // Convert price to number
    
//     // Add extra costs for toppings
//     if (customization.extraCheese) price += 35 * quantity;
//     if (customization.extraMeat) price += 50 * quantity;
//     if (customization.extraVeggies) price += 30 * quantity;
    
//     console.log("Calculated Total Price:", price); // Debugging log
//     setTotalPrice(price);
//   }, [item, quantity, customization]);

//   // Reset customization when a new item is selected
//   useEffect(() => {
//     setQuantity(1);
//     setCustomization({
//       extraCheese: false,
//       extraMeat: false,
//       extraVeggies: false,
//       noOnions: false,
//       noGarlic: false,
//       spicyLevel: 'Medium',
//       specialInstructions: ""
//     });
//   }, [item]);

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };

//   const handleCustomizationChange = (name, value) => {
//     setCustomization(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSave = () => {
//     if (onSave && item) {
//       onSave(item, {
//         ...customization,
//         quantity
//       });
//     }
//     onClose();
//   };

//   // If no item is selected, don't render anything
//   if (!item) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h6">Customize Your Order</Typography>
//           <IconButton onClick={onClose} size="small">
//             <CloseIcon />
//           </IconButton>
//         </div>
//       </DialogTitle>
      
//       <DialogContent className={classes.dialogContent}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={4}>
//             <img 
//               src={item.image_url || "/images/default-placeholder.png"} 
//               alt={item.name}
//               className={classes.itemImage}
//             />
//           </Grid>
          
//           <Grid item xs={12} sm={8}>
//             <Typography variant="h6">{item.name}</Typography>
//             <Typography variant="body2" color="textSecondary">{item.description}</Typography>
//             <Typography className={classes.priceDisplay}>Rs. {item.price}</Typography>
//           </Grid>
//         </Grid>

//         <Divider style={{ margin: '16px 0' }} />
        
//         {/* Quantity Controls */}
//         <Typography className={classes.sectionTitle}>Quantity</Typography>
//         <div className={classes.quantityControls}>
//           <IconButton 
//             size="small" 
//             onClick={() => handleQuantityChange(quantity - 1)}
//             disabled={quantity <= 1}
//           >
//             <RemoveIcon />
//           </IconButton>
//           <Typography className={classes.quantityText}>{quantity}</Typography>
//           <IconButton 
//             size="small" 
//             onClick={() => handleQuantityChange(quantity + 1)}
//           >
//             <AddIcon />
//           </IconButton>
//         </div>
        
//         {/* Toppings Section */}
//         <Typography className={classes.sectionTitle}>Extra Toppings</Typography>
//         <div className={classes.chipContainer}>
//           {COMMON_TOPPINGS.map(topping => (
//             <Chip
//               key={topping.id}
//               label={`${topping.label} (+Rs. ${topping.price})`}
//               onClick={() => handleCustomizationChange(topping.id, !customization[topping.id])}
//               color={customization[topping.id] ? "primary" : "default"}
//               variant={customization[topping.id] ? "filled" : "outlined"}
//               clickable
//             />
//           ))}
//         </div>
        
//         {/* Preferences Section */}
//         <Typography className={classes.sectionTitle}>Preferences</Typography>
//         <Grid container spacing={2}>
//           {COMMON_PREFERENCES.map(pref => 
//             pref.type === 'select' ? (
//               <Grid item xs={12} sm={6} key={pref.id}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel id={`${pref.id}-label`}>{pref.label}</InputLabel>
//                   <Select
//                     labelId={`${pref.id}-label`}
//                     value={customization[pref.id]}
//                     label={pref.label}
//                     onChange={(e) => handleCustomizationChange(pref.id, e.target.value)}
//                   >
//                     {pref.options.map(option => (
//                       <MenuItem key={option} value={option}>{option}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//             ) : (
//               <Grid item xs={12} sm={6} key={pref.id}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={customization[pref.id]}
//                       onChange={(e) => handleCustomizationChange(pref.id, e.target.checked)}
//                     />
//                   }
//                   label={pref.label}
//                 />
//               </Grid>
//             )
//           )}
//         </Grid>
        
//         {/* Special Instructions */}
//         <Typography className={classes.sectionTitle}>Special Instructions</Typography>
//         <TextField
//           placeholder="Add any special requests or instructions for this item"
//           variant="outlined"
//           fullWidth
//           multiline
//           rows={2}
//           value={customization.specialInstructions}
//           onChange={(e) => handleCustomizationChange("specialInstructions", e.target.value)}
//         />
        
//         <Divider style={{ margin: '16px 0' }} />
        
//         {/* Total Price */}
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="subtitle1">Total Price:</Typography>
//           <Typography variant="h6" className={classes.priceDisplay}>
//             Rs. {totalPrice.toFixed(2)}
//           </Typography>
//         </Box>
//       </DialogContent>
      
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button 
//           onClick={handleSave} 
//           variant="contained" 
//           color="primary"
//           sx={{
//             backgroundColor: '#ff9800',
//             "&:hover": { backgroundColor: '#f57c00' }
//           }}
//         >
//           Add to Cart
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CustomizeOrderPopup;



import React, { useState, useEffect, useMemo } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Divider,
  Box,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Paper,
  Badge,
  Avatar,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Fade,
  Zoom
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Define customization categories with more detailed options
const CUSTOMIZATION_CATEGORIES = {
  toppings: [
    { id: 'extraCheese', label: 'Extra Cheese', price: 35, image: '/images/toppings/cheese.jpg', popular: true, veg: true },
    { id: 'extraMeat', label: 'Double Meat', price: 50, image: '/images/toppings/meat.jpg', popular: true, veg: false },
    { id: 'extraVeggies', label: 'Extra Veggies', price: 30, image: '/images/toppings/veggies.jpg', veg: true },
    { id: 'jalapenos', label: 'Jalapeños', price: 25, image: '/images/toppings/jalapenos.jpg', veg: true },
    { id: 'olives', label: 'Black Olives', price: 20, image: '/images/toppings/olives.jpg', veg: true },
    { id: 'mushrooms', label: 'Mushrooms', price: 30, image: '/images/toppings/mushrooms.jpg', veg: true },
    { id: 'bacon', label: 'Crispy Bacon', price: 45, image: '/images/toppings/bacon.jpg', veg: false },
  ],
  preferences: [
    { id: 'noOnions', label: 'No Onions', type: 'toggle' },
    { id: 'noGarlic', label: 'No Garlic', type: 'toggle' },
    { id: 'glutenFree', label: 'Gluten-Free Option', type: 'toggle', price: 40 },
    { id: 'spicyLevel', label: 'Spicy Level', type: 'slider', min: 0, max: 4, 
      marks: [
        { value: 0, label: 'No Spice' },
        { value: 1, label: 'Mild' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Hot' },
        { value: 4, label: 'Extra Hot' }
      ]
    },
    { id: 'cookingPreference', label: 'Cooking Preference', type: 'select', 
      options: ['Well Done', 'Medium Well', 'Medium', 'Medium Rare', 'Rare'] 
    }
  ],
  sides: [
    { id: 'frenchFries', label: 'French Fries', price: 99, image: '/images/sides/fries.jpg', veg: true },
    { id: 'onionRings', label: 'Onion Rings', price: 129, image: '/images/sides/onion-rings.jpg', veg: true },
    { id: 'garlicBread', label: 'Garlic Bread', price: 149, image: '/images/sides/garlic-bread.jpg', veg: true },
    { id: 'coleslaw', label: 'Coleslaw', price: 79, image: '/images/sides/coleslaw.jpg', veg: true }
  ],
  dips: [
    { id: 'ketchup', label: 'Ketchup', price: 15, image: '/images/dips/ketchup.jpg', veg: true },
    { id: 'mayo', label: 'Mayonnaise', price: 20, image: '/images/dips/mayo.jpg', veg: true },
    { id: 'chipotle', label: 'Chipotle Dip', price: 25, image: '/images/dips/chipotle.jpg', veg: true },
    { id: 'bbq', label: 'BBQ Sauce', price: 25, image: '/images/dips/bbq.jpg', veg: true },
    { id: 'cheese', label: 'Cheese Dip', price: 30, image: '/images/dips/cheese.jpg', veg: true }
  ]
};

// Styled Components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 0,
    top: 13,
    padding: '0 4px',
    backgroundColor: theme.palette.success.main,
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.contrastText,
  fontWeight: 'bold',
}));

const NutritionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
}));

const ToppingCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-4px)',
  },
}));

const CustomizeOrderPopup = ({ open, onClose, onSave, item, favoriteItems, onToggleFavorite }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasCustomized, setHasCustomized] = useState(false);
  const [recommendedOptions, setRecommendedOptions] = useState([]);
  const [editingNotes, setEditingNotes] = useState(false);
  
  // Derived state
  const selectedExtras = useMemo(() => {
    return Object.entries(customization).filter(([key, value]) => 
      (typeof value === 'boolean' && value === true) || 
      (typeof value === 'number' && value > 0)
    ).length;
  }, [customization]);
  
  // Initialize customization state
  useEffect(() => {
    if (!item) return;
    
    // Reset states
    setQuantity(1);
    setHasCustomized(false);
    setIsExpanded(true);
    setTabValue(0);
    setEditingNotes(false);
    
    // Check if item is in favorites
    setIsFavorite(favoriteItems?.some(favItem => favItem.id === item.id) || false);
    
    // Initialize preferences with default values
    const initialCustomization = {};
    
    // Initialize toppings
    CUSTOMIZATION_CATEGORIES.toppings.forEach(topping => {
      initialCustomization[topping.id] = false;
    });
    
    // Initialize preferences
    CUSTOMIZATION_CATEGORIES.preferences.forEach(pref => {
      if (pref.type === 'toggle') {
        initialCustomization[pref.id] = false;
      } else if (pref.type === 'slider') {
        initialCustomization[pref.id] = pref.min ? pref.min : 0;
      } else if (pref.type === 'select') {
        initialCustomization[pref.id] = pref.options[0];
      }
    });
    
    // Initialize sides and dips
    CUSTOMIZATION_CATEGORIES.sides.forEach(side => {
      initialCustomization[side.id] = 0;
    });
    
    CUSTOMIZATION_CATEGORIES.dips.forEach(dip => {
      initialCustomization[dip.id] = 0;
    });
    
    // Add special instructions
    initialCustomization.specialInstructions = "";
    
    setCustomization(initialCustomization);
    
    // Set recommended customizations based on the item type
    if (item.category === 'burgers') {
      setRecommendedOptions(['extraCheese', 'bacon', 'jalapenos', 'frenchFries']);
    } else if (item.category === 'pizza') {
      setRecommendedOptions(['extraCheese', 'extraVeggies', 'olives', 'mushrooms']);
    } else if (item.category === 'pasta') {
      setRecommendedOptions(['extraCheese', 'garlicBread', 'noGarlic']);
    } else {
      setRecommendedOptions([]);
    }
  }, [item, favoriteItems]);
  
  // Calculate total price whenever quantity or customizations change
  useEffect(() => {
    if (!item || item.price == null) return;
  
    let price = Number(item.price) * quantity;
    
    // Add cost for toppings
    CUSTOMIZATION_CATEGORIES.toppings.forEach(topping => {
      if (customization[topping.id]) {
        price += topping.price * quantity;
      }
    });
    
    // Add cost for preferences (if any)
    CUSTOMIZATION_CATEGORIES.preferences.forEach(pref => {
      if (pref.price && customization[pref.id]) {
        price += pref.price * quantity;
      }
    });
    
    // Add cost for sides
    CUSTOMIZATION_CATEGORIES.sides.forEach(side => {
      if (customization[side.id] > 0) {
        price += side.price * customization[side.id];
      }
    });
    
    // Add cost for dips
    CUSTOMIZATION_CATEGORIES.dips.forEach(dip => {
      if (customization[dip.id] > 0) {
        price += dip.price * customization[dip.id];
      }
    });
    
    setTotalPrice(price);
  }, [item, quantity, customization]);
  
  // Track if user has customized the order
  useEffect(() => {
    if (!item) return;
    
    const hasAnyCustomization = CUSTOMIZATION_CATEGORIES.toppings.some(topping => 
      customization[topping.id]
    ) || CUSTOMIZATION_CATEGORIES.preferences.some(pref => 
      pref.type === 'toggle' ? customization[pref.id] : 
      pref.type === 'slider' ? customization[pref.id] > 0 : 
      false
    ) || CUSTOMIZATION_CATEGORIES.sides.some(side => 
      customization[side.id] > 0
    ) || CUSTOMIZATION_CATEGORIES.dips.some(dip => 
      customization[dip.id] > 0
    ) || customization.specialInstructions?.trim()?.length > 0;
    
    setHasCustomized(hasAnyCustomization);
  }, [item, customization]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleCustomizationChange = (name, value) => {
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSetDipQuantity = (dipId, value) => {
    if (value >= 0) {
      handleCustomizationChange(dipId, value);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onToggleFavorite && item) {
      onToggleFavorite(item.id);
    }
  };

  const handleSave = () => {
    if (onSave && item) {
      setIsLoading(true);
      
      // Simulate network request
      setTimeout(() => {
        onSave(item, {
          ...customization,
          quantity,
          isFavorite
        });
        setIsLoading(false);
        onClose();
      }, 600);
    }
  };

  const isRecommended = (optionId) => {
    return recommendedOptions.includes(optionId);
  };

  // If no item is selected, don't render anything
  if (!item) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ padding: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Customize Your Order</Typography>
          <Box>
            <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton onClick={handleToggleFavorite} color={isFavorite ? "primary" : "default"} size="small">
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ padding: 0 }}>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box position="relative">
                <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                  <img 
                    src={item.image_url || "/images/default-placeholder.png"} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: isMobile ? 180 : 200,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                </Zoom>
                {item.isVeg && (
                  <Box position="absolute" top={8} right={8}>
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Vegetarian" 
                      size="small" 
                      color="success"
                    />
                  </Box>
                )}
                {item.isNew && (
                  <Box position="absolute" top={8} left={8}>
                    <Chip 
                      icon={<LocalOfferIcon />} 
                      label="New" 
                      size="small" 
                      color="secondary"
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {item.description}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <PriceTag>
                  Rs. {item.price.toFixed(2)}
                </PriceTag>
                
                {item.calories && (
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.calories} calories
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Nutrition Information */}
              {item.nutrition && (
                <Accordion 
                  expanded={isExpanded} 
                  onChange={() => setIsExpanded(!isExpanded)}
                  sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Nutrition Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {item.nutrition.protein && (
                        <Grid item xs={6}>
                          <NutritionItem>
                            <InfoIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              Protein: {item.nutrition.protein}g
                            </Typography>
                          </NutritionItem>
                        </Grid>
                      )}
                      {item.nutrition.carbs && (
                        <Grid item xs={6}>
                          <NutritionItem>
                            <InfoIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              Carbs: {item.nutrition.carbs}g
                            </Typography>
                          </NutritionItem>
                        </Grid>
                      )}
                      {item.nutrition.fat && (
                        <Grid item xs={6}>
                          <NutritionItem>
                            <InfoIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              Fat: {item.nutrition.fat}g
                            </Typography>
                          </NutritionItem>
                        </Grid>
                      )}
                      {item.nutrition.sodium && (
                        <Grid item xs={6}>
                          <NutritionItem>
                            <InfoIcon fontSize="small" color="primary" />
                            <Typography variant="body2">
                              Sodium: {item.nutrition.sodium}mg
                            </Typography>
                          </NutritionItem>
                        </Grid>
                      )}
                    </Grid>
                    
                    {item.allergens && (
                      <Box mt={1}>
                        <Typography variant="subtitle2" color="error">
                          Allergens: {item.allergens.join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          
          {/* Quantity Controls */}
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold" mr={2}>
              Quantity
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                sx={{ borderRadius: 0 }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 2, py: 0.5, fontWeight: 'bold' }}>
                {quantity}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(quantity + 1)}
                sx={{ borderRadius: 0 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Customization Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label={
                <Box display="flex" alignItems="center">
                  <Typography>Toppings</Typography>
                  {selectedExtras > 0 && (
                    <StyledBadge badgeContent={selectedExtras} color="success" />
                  )}
                </Box>
              } />
              <Tab label="Preferences" />
              <Tab label="Sides" />
              <Tab label="Dips & Sauces" />
            </Tabs>
          </Box>
          
          {/* Toppings Tab */}
          <Box role="tabpanel" hidden={tabValue !== 0} p={2}>
            {tabValue === 0 && (
              <Fade in={tabValue === 0}>
                <Box>
                  <Grid container spacing={2}>
                    {CUSTOMIZATION_CATEGORIES.toppings.map(topping => (
                      <Grid item xs={6} sm={4} md={3} key={topping.id}>
                        <Zoom in={true} style={{ transitionDelay: '150ms' }}>
                          <ToppingCard 
                            selected={customization[topping.id]} 
                            onClick={() => handleCustomizationChange(topping.id, !customization[topping.id])}
                            elevation={customization[topping.id] ? 3 : 1}
                          >
                            {isRecommended(topping.id) && (
                              <Box position="absolute" top={-8} right={-8}>
                                <Chip 
                                  label="Recommended" 
                                  size="small" 
                                  color="secondary"
                                  sx={{ transform: 'scale(0.8)' }}
                                />
                              </Box>
                            )}
                            <Avatar 
                              src={topping.image} 
                              alt={topping.label}
                              sx={{ width: 56, height: 56, mb: 1 }}
                            />
                            <Typography variant="body2" align="center" gutterBottom>
                              {topping.label}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              +Rs. {topping.price}
                            </Typography>
                            {customization[topping.id] && (
                              <Box 
                                position="absolute" 
                                bottom={8} 
                                right={8}
                                sx={{ color: 'primary.main' }}
                              >
                                <CheckCircleIcon />
                              </Box>
                            )}
                          </ToppingCard>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Preferences Tab */}
          <Box role="tabpanel" hidden={tabValue !== 1} p={2}>
            {tabValue === 1 && (
              <Fade in={tabValue === 1}>
                <Box>
                  <Grid container spacing={2}>
                    {CUSTOMIZATION_CATEGORIES.preferences.map(pref => (
                      <Grid item xs={12} key={pref.id}>
                        <Paper sx={{ p: 2 }}>
                          {pref.type === 'toggle' ? (
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography>
                                {pref.label}
                                {pref.price && ` (+Rs. ${pref.price})`}
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={customization[pref.id]}
                                    onChange={(e) => handleCustomizationChange(pref.id, e.target.checked)}
                                    color="primary"
                                  />
                                }
                                label=""
                              />
                            </Box>
                          ) : pref.type === 'slider' ? (
                            <Box>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography id={`${pref.id}-slider-label`}>
                                  {pref.label}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  {pref.marks.find(mark => mark.value === customization[pref.id])?.label || ''}
                                </Typography>
                              </Box>
                              <Slider
                                value={customization[pref.id]}
                                onChange={(e, newValue) => handleCustomizationChange(pref.id, newValue)}
                                min={pref.min}
                                max={pref.max}
                                marks={pref.marks}
                                step={1}
                                valueLabelDisplay="auto"
                                aria-labelledby={`${pref.id}-slider-label`}
                              />
                            </Box>
                          ) : pref.type === 'select' ? (
                            <FormControl fullWidth>
                              <InputLabel id={`${pref.id}-select-label`}>{pref.label}</InputLabel>
                              <Select
                                labelId={`${pref.id}-select-label`}
                                value={customization[pref.id]}
                                label={pref.label}
                                onChange={(e) => handleCustomizationChange(pref.id, e.target.value)}
                              >
                                {pref.options.map(option => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : null}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Sides Tab */}
          <Box role="tabpanel" hidden={tabValue !== 2} p={2}>
            {tabValue === 2 && (
              <Fade in={tabValue === 2}>
                <Box>
                  <Grid container spacing={2}>
                    {CUSTOMIZATION_CATEGORIES.sides.map(side => (
                      <Grid item xs={12} sm={6} key={side.id}>
                        <Paper sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Avatar 
                                src={side.image} 
                                alt={side.label}
                                sx={{ width: 48, height: 48, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle2">
                                  {side.label}
                                  {isRecommended(side.id) && (
                                    <Chip 
                                      label="Recommended" 
                                      size="small" 
                                      color="secondary"
                                      sx={{ ml: 1, transform: 'scale(0.8)' }}
                                    />
                                  )}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  Rs. {side.price}
                                </Typography>
                              </Box>
                            </Box>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <IconButton 
                                size="small" 
                                onClick={() => handleCustomizationChange(side.id, Math.max(0, customization[side.id] - 1))}
                                disabled={customization[side.id] <= 0}
                                sx={{ borderRadius: 0 }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography sx={{ px: 2, py: 0.5, fontWeight: 'bold' }}>
                                {customization[side.id] || 0}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleCustomizationChange(side.id, (customization[side.id] || 0) + 1)}
                                sx={{ borderRadius: 0 }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Dips & Sauces Tab */}
          <Box role="tabpanel" hidden={tabValue !== 3} p={2}>
            {tabValue === 3 && (
              <Fade in={tabValue === 3}>
                <Box>
                  <Grid container spacing={2}>
                    {CUSTOMIZATION_CATEGORIES.dips.map(dip => (
                      <Grid item xs={12} sm={6} key={dip.id}>
                        <Paper sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Avatar 
                                src={dip.image} 
                                alt={dip.label}
                                sx={{ width: 40, height: 40, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle2">{dip.label}</Typography>
                                <Typography variant="body2" color="primary">
                                  Rs. {dip.price}
                                </Typography>
                              </Box>
                            </Box>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <IconButton 
                                size="small" 
                                onClick={() =>handleSetDipQuantity(dip.id, Math.max(0, customization[dip.id] - 1))}
                                disabled={customization[dip.id] <= 0}
                                sx={{ borderRadius: 0 }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography sx={{ px: 2, py: 0.5, fontWeight: 'bold' }}>
                                {customization[dip.id] || 0}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleSetDipQuantity(dip.id, (customization[dip.id] || 0) + 1)}
                                sx={{ borderRadius: 0 }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            )}
          </Box>
          
          {/* Special Instructions */}
          <Box p={2}>
            <Accordion expanded={editingNotes} onChange={() => setEditingNotes(!editingNotes)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Special Instructions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  placeholder="Add any special requests or instructions for this item"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={customization.specialInstructions || ""}
                  onChange={(e) => handleCustomizationChange("specialInstructions", e.target.value)}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Please note that special instructions are subject to availability.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          {/* Show customization summary if user has made changes */}
          {hasCustomized && (
            <Box p={2}>
              <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="subtitle2" gutterBottom>Your Customizations:</Typography>
                <Box sx={{ maxHeight: 100, overflowY: 'auto' }}>
                  <Grid container spacing={1}>
                    {/* Show selected toppings */}
                    {CUSTOMIZATION_CATEGORIES.toppings.filter(t => customization[t.id]).map(topping => (
                      <Grid item xs={6} key={topping.id}>
                        <Typography variant="body2">• {topping.label}</Typography>
                      </Grid>
                    ))}
                    
                    {/* Show selected preferences */}
                    {CUSTOMIZATION_CATEGORIES.preferences
                      .filter(p => p.type === 'toggle' && customization[p.id])
                      .map(pref => (
                        <Grid item xs={6} key={pref.id}>
                          <Typography variant="body2">• {pref.label}</Typography>
                        </Grid>
                    ))}
                    
                    {/* Show spicy level if set */}
                    {customization.spicyLevel > 0 && (
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          • Spice: {
                            CUSTOMIZATION_CATEGORIES.preferences
                              .find(p => p.id === 'spicyLevel')
                              ?.marks?.find(m => m.value === customization.spicyLevel)?.label || ''
                          }
                        </Typography>
                      </Grid>
                    )}
                    
                    {/* Show cooking preference if set */}
                    {customization.cookingPreference && (
                      <Grid item xs={6}>
                        <Typography variant="body2">• {customization.cookingPreference}</Typography>
                      </Grid>
                    )}
                    
                    {/* Show selected sides */}
                    {CUSTOMIZATION_CATEGORIES.sides.filter(s => customization[s.id] > 0).map(side => (
                      <Grid item xs={6} key={side.id}>
                        <Typography variant="body2">• {side.label} × {customization[side.id]}</Typography>
                      </Grid>
                    ))}
                    
                    {/* Show selected dips */}
                    {CUSTOMIZATION_CATEGORIES.dips.filter(d => customization[d.id] > 0).map(dip => (
                      <Grid item xs={6} key={dip.id}>
                        <Typography variant="body2">• {dip.label} × {customization[dip.id]}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" color="primary">
            Rs. {totalPrice.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {quantity > 1 ? `Rs. ${(totalPrice / quantity).toFixed(2)} each × ${quantity}` : ''}
          </Typography>
        </Box>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              backgroundColor: '#ff9800',
              "&:hover": { backgroundColor: '#f57c00' }
            }}
          >
            {isLoading ? "Adding..." : hasCustomized ? "Add Customized Item" : "Add to Cart"}
          </Button>
        </Box>
      </DialogActions>
      
      {/* Confirmation Alert showing at the bottom for quick actions */}
      <Fade in={hasCustomized}>
        <Box 
          sx={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            width: 'calc(100% - 32px)',
            maxWidth: 500,
            display: hasCustomized ? 'block' : 'none'
          }}
        >
          <Alert 
            severity="success" 
            sx={{ 
              boxShadow: theme.shadows[6],
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="body2">
                {selectedExtras} customization{selectedExtras !== 1 ? 's' : ''} added!
              </Typography>
              <Button 
                size="small" 
                onClick={() => setTabValue(0)}
                variant="outlined"
                color="success"
              >
                Review
              </Button>
            </Box>
          </Alert>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default CustomizeOrderPopup;