import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/addresses/${userId}`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showNotification('Failed to fetch addresses', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      label: '',
      fullName: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: ''
    });
    setOpenDialog(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      landmark: address.landmark || ''
    });
    setOpenDialog(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`);
      showNotification('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      showNotification('Failed to delete address', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAddress) {
        await axios.put(`http://localhost:5000/api/addresses/${editingAddress.id}`, {
          ...formData,
          userId
        });
        showNotification('Address updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/addresses', {
          ...formData,
          userId
        });
        showNotification('Address added successfully');
      }
      setOpenDialog(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      showNotification('Failed to save address', 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          padding: { xs: 2, md: 4 },
          bgcolor: '#f5f5f7',
          borderLeft: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* Mobile Header */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            backgroundColor: '#fff',
            padding: 1,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            My Addresses
          </Typography>
        </Box>

        {/* Existing AddressesPage Content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" fontWeight="bold">My Addresses</Typography>
            <Button
              variant="contained"
              onClick={handleAddAddress}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                }
              }}
            >
              Add New Address
            </Button>
          </Box>

          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} key={address.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOnIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{address.label}</Typography>
                          <Typography variant="body2">{address.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${address.street}, ${address.city}`}<br />
                            {`${address.state} ${address.zipCode}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.phoneNumber}
                          </Typography>
                          {address.landmark && (
                            <Typography variant="body2" color="text.secondary">
                              Landmark: {address.landmark}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleEditAddress(address)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteAddress(address.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
                <IconButton onClick={() => setOpenDialog(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address Label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    placeholder="e.g., Home, Work, etc."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Landmark (Optional)"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                  }
                }}
              >
                {editingAddress ? 'Update' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
          >
            <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default AddressesPage;
