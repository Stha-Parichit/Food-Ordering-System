import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Box, Typography, Button, Rating } from '@mui/material';

const OrderingCard = ({ image, title, initialRating, price, onRatingChange, onOrderNow }) => {
  const [rating, setRating] = useState(initialRating); // State to manage the rating
  const navigate = useNavigate();

  // Handle star click to update the rating
  const handleRatingChange = (event, newRating) => {
    setRating(newRating); // Update the local rating state
    if (onRatingChange) {
      onRatingChange(newRating); // Optionally call a parent function to update the global rating
    }
  };

  const handleClick = async () => {
    if (onOrderNow) {
      await onOrderNow(); // Add the item to the cart
    }
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <Card sx={{ width: 150, marginBottom: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8, }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Rating
            name="food-rating"
            value={rating}
            precision={0.5}
            onChange={handleRatingChange}
            sx={{ marginRight: 1 }}
          />
          <Typography variant="body2">{rating.toFixed(1)} / 5</Typography>
        </Box>

        {/* Price */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Rs. {price}
        </Typography>

        {/* Order Now Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleClick}
          sx={{
            backgroundColor: '#FF5722', // Custom color for the button
            '&:hover': {
              backgroundColor: '#FF3D00', // Darker hover effect
            },
          }}
        >
          Order Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderingCard;
