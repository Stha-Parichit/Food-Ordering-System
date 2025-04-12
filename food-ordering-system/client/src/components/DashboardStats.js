import React, { memo } from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const DashboardStats = memo(({ 
  totalSpent, 
  totalOrders, 
  loyaltyPoints, 
  nextLevel, 
  pointsToNextReward 
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
          height: '100%', 
          background: 'linear-gradient(135deg,rgb(255, 161, 99) 0%, #FF8E53 100%)' 
        }}>
          <CardContent sx={{ p: 3, color: 'white' }}>
            <Typography variant="h6" gutterBottom>Total Spent</Typography>
            <Typography variant="h4" fontWeight="bold">Rs. {totalSpent}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>+18% from last month</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* ...remaining stats cards... */}
    </Grid>
  );
});

DashboardStats.displayName = 'DashboardStats';
export default DashboardStats;
