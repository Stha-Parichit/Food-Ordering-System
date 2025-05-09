import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Snackbar,
  Avatar,
  Divider,
  Grow,
  IconButton as MuiIconButton,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  Send,
  ArrowForward,
} from '@mui/icons-material';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSnackbar({
        open: true,
        message: 'Message sent successfully!',
        severity: 'success',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
      minHeight: "100vh",
    }}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Background elements for visual interest */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}>
          <Box sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,122,69,0.1) 0%, rgba(255,77,0,0.05) 70%, rgba(255,77,0,0) 100%)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '-5%',
            left: '-10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,122,69,0.05) 0%, rgba(255,77,0,0.02) 70%, rgba(255,77,0,0) 100%)',
          }} />
        </Box>
        
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              textAlign: 'center', 
              mb: 5, 
              fontWeight: 800,
              color: '#2d3436',
              textShadow: '0px 1px 2px rgba(0,0,0,0.1)',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Get In Touch With Us
          </Typography>
          
          <Card 
            elevation={12}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1), 0 1px 8px rgba(0,0,0,0.07)',
              background: '#ffffff',
            }}
          >
            <Grid container>
              {/* Contact Information Section */}
              <Grid item xs={12} md={5}>
                <Box sx={{
                  height: '100%',
                  p: { xs: 4, md: 5 },
                  background: 'linear-gradient(135deg, #FF7A45 0%, #FF4D00 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Decorative circles for the contact info background */}
                  <Box sx={{
                    position: 'absolute',
                    top: '10%',
                    right: '-20%',
                    width: '60%',
                    height: '60%',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    zIndex: 0,
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-15%',
                    width: '50%',
                    height: '50%',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    zIndex: 0,
                  }} />
                  
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 4,
                        fontSize: { xs: '1.75rem', md: '2.125rem' },
                      }}
                    >
                      Contact Information
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 5, 
                        opacity: 0.9,
                        fontSize: '1rem',
                        lineHeight: 1.6,
                      }}
                    >
                      Feel free to reach out to us through any of these channels. We're here to help with any questions or feedback you may have.
                    </Typography>

                    <Box sx={{ mb: 5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 44,
                            height: 44,
                          }}
                        >
                          <LocationOn />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Our Location
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Shankharapur-1 Kathmandu, Nepal
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 44,
                            height: 44,
                          }}
                        >
                          <Phone />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Phone Number
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            +977 9861234567
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            width: 44,
                            height: 44,
                          }}
                        >
                          <Email />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Email Address
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            parichit562181@gmail.com
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Follow Us
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <SocialIconButton color="rgba(255,255,255,0.2)" hoverColor="rgba(255,255,255,0.3)">
                        <Facebook />
                      </SocialIconButton>
                      <SocialIconButton color="rgba(255,255,255,0.2)" hoverColor="rgba(255,255,255,0.3)">
                        <Instagram />
                      </SocialIconButton>
                      <SocialIconButton color="rgba(255,255,255,0.2)" hoverColor="rgba(255,255,255,0.3)">
                        <Twitter />
                      </SocialIconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Contact Form Section */}
              <Grid item xs={12} md={7}>
                <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#2d3436',
                      mb: 1,
                      fontSize: { xs: '1.75rem', md: '2.125rem' },
                    }}
                  >
                    Send Us a Message
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 4,
                      fontSize: '1rem',
                    }}
                  >
                    We'd love to hear from you. Please fill out the form below.
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          multiline
                          rows={5}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          endIcon={<Send />}
                          size="large"
                          disableElevation
                          sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            fontSize: '1rem',
                            textTransform: 'none',
                            background: 'linear-gradient(to right, #FF7A45, #FF4D00)',
                            boxShadow: '0 4px 14px rgba(255, 77, 0, 0.4)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'linear-gradient(to right, #FF4D00, #CA2E00)',
                              boxShadow: '0 6px 20px rgba(255, 77, 0, 0.6)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Card>
          
          {/* FAQ Section */}
          <Box sx={{ mt: 8, mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                textAlign: 'center', 
                mb: 5, 
                fontWeight: 700,
                color: '#2d3436',
              }}
            >
              Frequently Asked Questions
            </Typography>
            
            <Grid container spacing={3}>
              {faqs.map((faq, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Grow in={true} timeout={(index + 1) * 300}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        borderRadius: 3, 
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#FF4D00' }}>
                          {faq.question}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {faq.answer}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          {/* Map or Business Hours */}
          <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
            <Paper 
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2d3436' }}>
                Business Hours
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, mb: { xs: 2, sm: 0 } }}>
                    <Typography variant="h6" sx={{ color: '#FF4D00', fontWeight: 600 }}>
                      Weekdays
                    </Typography>
                    <Typography variant="body1">
                      9:00 AM - 6:00 PM
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, mb: { xs: 2, sm: 0 } }}>
                    <Typography variant="h6" sx={{ color: '#FF4D00', fontWeight: 600 }}>
                      Saturday
                    </Typography>
                    <Typography variant="body1">
                      10:00 AM - 4:00 PM
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#FF4D00', fontWeight: 600 }}>
                      Sunday
                    </Typography>
                    <Typography variant="body1">
                      Closed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

// Custom social media icon button
const SocialIconButton = ({ color, hoverColor, children, ...props }) => (
  <MuiIconButton
    sx={{
      backgroundColor: color,
      color: 'white',
      '&:hover': {
        backgroundColor: hoverColor,
      },
      transition: 'all 0.3s ease',
    }}
    {...props}
  >
    {children}
  </MuiIconButton>
);

// FAQ data
const faqs = [
  {
    question: "How quickly do you respond to inquiries?",
    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please contact us directly by phone."
  },
  {
    question: "Do you offer services outside of Kathmandu?",
    answer: "Yes, we offer our services throughout Nepal. For locations outside Kathmandu, additional travel charges may apply depending on the distance."
  },
  {
    question: "Can I schedule a consultation before committing?",
    answer: "Absolutely! We offer free initial consultations to discuss your needs and how we can best assist you. Please contact us to schedule an appointment."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash and mobile payment services like Khalti for your convenience."
  }
];

export default ContactUs;