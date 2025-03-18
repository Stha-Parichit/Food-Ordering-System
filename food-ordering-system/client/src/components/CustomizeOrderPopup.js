import React, { useState, useEffect } from "react";
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
  MenuItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';

// Define common customization options for food items
const COMMON_TOPPINGS = [
  { id: 'extraCheese', label: 'Extra Cheese', price: 35 },
  { id: 'extraMeat', label: 'Extra Meat', price: 50 },
  { id: 'extraVeggies', label: 'Extra Veggies', price: 30 }
];

const COMMON_PREFERENCES = [
  { id: 'noOnions', label: 'No Onions' },
  { id: 'noGarlic', label: 'No Garlic' },
  { id: 'spicyLevel', label: 'Spicy Level', type: 'select', options: ['Mild', 'Medium', 'Hot', 'Extra Hot'] }
];

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingTop: 16
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16
  },
  quantityButton: {
    minWidth: 'unset'
  },
  quantityText: {
    margin: '0 16px',
    fontWeight: 'bold'
  },
  priceDisplay: {
    fontWeight: 'bold',
    color: '#ff9800',
    marginTop: 16
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  itemImage: {
    width: '100%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 16
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16
  }
}));

const CustomizeOrderPopup = ({ open, onClose, onSave, item }) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    extraCheese: false,
    extraMeat: false,
    extraVeggies: false,
    noOnions: false,
    noGarlic: false,
    spicyLevel: 'Medium',
    specialInstructions: ""
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price whenever quantity or customizations change
  useEffect(() => {
    if (!item) return;
    
    let price = item.price * quantity;
    
    // Add extra costs for toppings
    if (customization.extraCheese) price += 35 * quantity;
    if (customization.extraMeat) price += 50 * quantity;
    if (customization.extraVeggies) price += 30 * quantity;
    
    setTotalPrice(price);
  }, [item, quantity, customization]);

  // Reset customization when a new item is selected
  useEffect(() => {
    setQuantity(1);
    setCustomization({
      extraCheese: false,
      extraMeat: false,
      extraVeggies: false,
      noOnions: false,
      noGarlic: false,
      spicyLevel: 'Medium',
      specialInstructions: ""
    });
  }, [item]);

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

  const handleSave = () => {
    if (onSave && item) {
      onSave(item, {
        ...customization,
        quantity
      });
    }
    onClose();
  };

  // If no item is selected, don't render anything
  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Customize Your Order</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img 
              src={item.image_url || "/images/default-placeholder.png"} 
              alt={item.name}
              className={classes.itemImage}
            />
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">{item.name}</Typography>
            <Typography variant="body2" color="textSecondary">{item.description}</Typography>
            <Typography className={classes.priceDisplay}>Rs. {item.price}</Typography>
          </Grid>
        </Grid>

        <Divider style={{ margin: '16px 0' }} />
        
        {/* Quantity Controls */}
        <Typography className={classes.sectionTitle}>Quantity</Typography>
        <div className={classes.quantityControls}>
          <IconButton 
            size="small" 
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <RemoveIcon />
          </IconButton>
          <Typography className={classes.quantityText}>{quantity}</Typography>
          <IconButton 
            size="small" 
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <AddIcon />
          </IconButton>
        </div>
        
        {/* Toppings Section */}
        <Typography className={classes.sectionTitle}>Extra Toppings</Typography>
        <div className={classes.chipContainer}>
          {COMMON_TOPPINGS.map(topping => (
            <Chip
              key={topping.id}
              label={`${topping.label} (+Rs. ${topping.price})`}
              onClick={() => handleCustomizationChange(topping.id, !customization[topping.id])}
              color={customization[topping.id] ? "primary" : "default"}
              variant={customization[topping.id] ? "filled" : "outlined"}
              clickable
            />
          ))}
        </div>
        
        {/* Preferences Section */}
        <Typography className={classes.sectionTitle}>Preferences</Typography>
        <Grid container spacing={2}>
          {COMMON_PREFERENCES.map(pref => 
            pref.type === 'select' ? (
              <Grid item xs={12} sm={6} key={pref.id}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`${pref.id}-label`}>{pref.label}</InputLabel>
                  <Select
                    labelId={`${pref.id}-label`}
                    value={customization[pref.id]}
                    label={pref.label}
                    onChange={(e) => handleCustomizationChange(pref.id, e.target.value)}
                  >
                    {pref.options.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} key={pref.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={customization[pref.id]}
                      onChange={(e) => handleCustomizationChange(pref.id, e.target.checked)}
                    />
                  }
                  label={pref.label}
                />
              </Grid>
            )
          )}
        </Grid>
        
        {/* Special Instructions */}
        <Typography className={classes.sectionTitle}>Special Instructions</Typography>
        <TextField
          placeholder="Add any special requests or instructions for this item"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          value={customization.specialInstructions}
          onChange={(e) => handleCustomizationChange("specialInstructions", e.target.value)}
        />
        
        <Divider style={{ margin: '16px 0' }} />
        
        {/* Total Price */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">Total Price:</Typography>
          <Typography variant="h6" className={classes.priceDisplay}>
            Rs. {totalPrice.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{
            backgroundColor: '#ff9800',
            "&:hover": { backgroundColor: '#f57c00' }
          }}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomizeOrderPopup;