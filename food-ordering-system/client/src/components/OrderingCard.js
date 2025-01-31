import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const OrderingCard = ({ image, title, initialRating, price, onRatingChange, onOrderNow }) => {
  const [rating, setRating] = useState(initialRating); // State to manage the rating
  const navigate = useNavigate();

  // Handle star click to update the rating
  const handleStarClick = (newRating) => {
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

  // Generate an array of stars based on the rating (e.g., 4.5 stars)
  const starArray = new Array(5).fill(false).map((_, index) => index < Math.floor(rating));
  const hasHalfStar = rating % 1 !== 0; // Check if there is a half-star

  return (
    <div className="ordering-card">
      <img src={image} alt={title} className="food-image" />
      <h3 className="food-title">{title}</h3>

      <div className="rating-and-price">
        <div className="rating">
          {/* Render full stars */}
          {starArray.map((filled, index) => (
            <span
              key={index}
              className={`star ${filled ? 'filled' : ''}`}
              onClick={() => handleStarClick(index + 1)} // Handle click to update rating
            >
              ★
            </span>
          ))}
          
          {/* Render half star if applicable */}
          {hasHalfStar && (
            <span
              className="star half"
              onClick={() => handleStarClick(Math.floor(rating) + 0.5)} // Handle half-star click
            >
              ★
            </span>
          )}
        </div>

        <div className="price">Rs. {price}</div>
      </div>

      <button className="order-now-button" onClick={handleClick}>Order Now</button>
    </div>
  );
};

export default OrderingCard;
