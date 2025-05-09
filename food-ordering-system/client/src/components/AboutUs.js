import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Divider,
  Button,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import Section from '@mui/material/Box';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import {
  FastfoodOutlined,
  LocalShippingOutlined,
  EmojiEmotionsOutlined,
  StyleOutlined,
  SpeedOutlined,
  SecurityOutlined,
  LinkedIn,
  Twitter,
  Instagram,
  ArrowDownward,
  Email
} from '@mui/icons-material';

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showContent, setShowContent] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Show content with slight delay for entrance animation
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Scroll tracking for animations
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.7;
      
      const sections = document.querySelectorAll('.scroll-section');
      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition && 
            section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <SpeedOutlined fontSize="large" />,
      title: "Lightning Fast Delivery",
      description: "From kitchen to your doorstep in record time, we prioritize speed without compromising quality"
    },
    {
      icon: <FastfoodOutlined fontSize="large" />,
      title: "Premium Quality Food",
      description: "Fresh, locally-sourced ingredients prepared by expert chefs with attention to detail"
    },
    {
      icon: <SecurityOutlined fontSize="large" />,
      title: "Secure Experience",
      description: "End-to-end encryption and secure payment gateways protect your data and transactions"
    },
    {
      icon: <StyleOutlined fontSize="large" />,
      title: "Seamless Ordering",
      description: "Intuitive interface designed for quick, hassle-free ordering at your fingertips"
    },
    {
      icon: <LocalShippingOutlined fontSize="large" />,
      title: "Extensive Coverage",
      description: "Serving neighborhoods across the city with expanding delivery zones every month"
    },
    {
      icon: <EmojiEmotionsOutlined fontSize="large" />,
      title: "Customer First",
      description: "Dedicated support team available 24/7 to ensure your complete satisfaction"
    }
  ];

  const teamMembers = [
    {
      name: "Parichit Shrestha",
      role: "Founder & Culinary Visionary",
      image: "/images/team/kushal.jpg",
      description: "Former chef with a passion for technology and innovation in food service. Kushal brings 10+ years of culinary expertise to YO Food.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Parichit Shrestha",
      role: "Tech Innovation Lead",
      image: "/images/team/parichit.jpg",
      description: "Tech genius responsible for our cutting-edge platform. Parichit's background in UX design and AI makes ordering food a delightful experience.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
  ];

  const stats = [
    { value: "50k+", label: "Daily Orders" },
    { value: "500+", label: "Restaurant Partners" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "15+", label: "Cities Covered" }
  ];

  // Custom theme colors
  const primaryColor = '#FF5722';
  const secondaryColor = '#2E7D32';
  const accentColor = '#FFC107';
  const darkColor = '#263238';
  const lightColor = '#FAFAFA';

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${lightColor} 0%, #E0E0E0 100%)`,
      color: darkColor,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
      />
      
      <Box component="main" sx={{ 
        flexGrow: 1, 
        position: 'relative',
        overflowX: 'hidden'
      }}>
        {/* Abstract background elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '35%',
            height: '35%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primaryColor}22 0%, ${primaryColor}11 70%, ${primaryColor}00 100%)`,
            filter: 'blur(40px)',
            transform: 'rotate(-15deg)'
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '30%',
            left: '-10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentColor}22 0%, ${accentColor}11 70%, ${accentColor}00 100%)`,
            filter: 'blur(60px)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '-15%',
            right: '10%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${secondaryColor}22 0%, ${secondaryColor}11 70%, ${secondaryColor}00 100%)`,
            filter: 'blur(50px)',
          }} />
        </Box>
        
        {/* Hero Section */}
        <Box 
          id="hero" 
          className="scroll-section"
          sx={{ 
            position: 'relative', 
            pt: { xs: 12, md: 20 }, 
            pb: { xs: 10, md: 16 },
            textAlign: 'center', 
            overflow: 'hidden',
            borderBottom: `1px solid ${primaryColor}22`
          }}
        >
          <Container maxWidth="lg">
            <Fade in={showContent} timeout={1000}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: primaryColor,
                    fontWeight: 600,
                    letterSpacing: 3,
                    display: 'block',
                    mb: 2
                  }}
                >
                  WELCOME TO
                </Typography>
                <Typography 
                  variant="h1"
                  sx={{ 
                    fontWeight: 900,
                    color: darkColor,
                    mb: 2,
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                    lineHeight: 1.1,
                    textShadow: `2px 2px 4px ${primaryColor}22`,
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '8px',
                      bottom: '-8px',
                      left: 0,
                      backgroundColor: primaryColor,
                      borderRadius: '4px'
                    }
                  }}
                >
                  YO<span style={{ color: primaryColor }}>Food</span>
                </Typography>
                <Typography 
                  variant="h5"
                  sx={{ 
                    color: darkColor,
                    fontWeight: 500,
                    maxWidth: '850px',
                    margin: '2rem auto',
                    lineHeight: 1.8,
                    opacity: 0.8
                  }}
                >
                  Revolutionizing the way you experience food, combining cutting-edge technology 
                  with culinary excellence to bring exceptional meals right to your doorstep.
                </Typography>
                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 3 }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => scrollToSection('mission')}
                    sx={{ 
                      backgroundColor: primaryColor,
                      color: '#fff',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#E64A19',
                        transform: 'translateY(-3px)',
                        boxShadow: `0 10px 20px ${primaryColor}44`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Our Story
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    onClick={() => scrollToSection('features')}
                    sx={{ 
                      color: primaryColor,
                      borderColor: primaryColor,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: primaryColor,
                        backgroundColor: `${primaryColor}11`,
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Why Choose Us
                  </Button>
                </Box>
                <Box sx={{ mt: 8 }}>
                  <IconButton 
                    onClick={() => scrollToSection('mission')}
                    sx={{ 
                      animation: 'bounce 2s infinite',
                      '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                        '40%': { transform: 'translateY(-20px)' },
                        '60%': { transform: 'translateY(-10px)' }
                      },
                      color: primaryColor
                    }}
                  >
                    <ArrowDownward fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            </Fade>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          backgroundColor: primaryColor, 
          color: '#fff',
          py: { xs: 4, md: 6 },
          position: 'relative',
          zIndex: 1
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Slide in={activeSection === 'hero' || activeSection === 'mission'} 
                         direction="up" 
                         timeout={500 + (index * 100)}
                         mountOnEnter
                         unmountOnExit>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: { xs: 2, md: 3 }
                    }}>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          mb: 1
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontWeight: 500,
                          opacity: 0.9
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Mission & Vision Section */}
        <Section 
          id="mission" 
          className="scroll-section"
          sx={{ 
            pt: { xs: 8, md: 16 }, 
            pb: { xs: 8, md: 16 },
            position: 'relative',
            zIndex: 1
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: darkColor,
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60%',
                    height: '4px',
                    bottom: '-8px',
                    left: '20%',
                    backgroundColor: primaryColor,
                    borderRadius: '4px'
                  }
                }}
              >
                Our Mission & Vision
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: `${darkColor}99`,
                  maxWidth: '700px',
                  margin: '1.5rem auto',
                }}
              >
                Driven by purpose and focused on transforming the food delivery platform
              </Typography>
            </Box>
            
            <Grid container spacing={6} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <Fade in={activeSection === 'mission'} timeout={1000}>
                  <Card 
                    elevation={6}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: `1px solid ${primaryColor}22`,
                      background: `linear-gradient(135deg, #fff 0%, ${lightColor} 100%)`,
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 30px ${darkColor}22`
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        backgroundColor: primaryColor,
                        color: '#fff',
                        py: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="overline" fontWeight={600} letterSpacing={1}>
                        OUR MISSION
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h4" sx={{ mb: 3, color: darkColor, fontWeight: 700 }}>
                        Revolutionizing Food Delivery
                      </Typography>
                      <Typography variant="body1" sx={{ color: `${darkColor}cc`, lineHeight: 1.8, mb: 4, flexGrow: 1 }}>
                        To transform the food delivery platform by creating seamless connections between customers 
                        and exceptional culinary experiences. We strive to provide unparalleled service, 
                        technological innovation, and a sustainable ecosystem that benefits customers, 
                        restaurants, and delivery partners alike.
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: `${primaryColor}11`, 
                        borderRadius: 2,
                        borderLeft: `4px solid ${primaryColor}`
                      }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: `${darkColor}99` }}>
                          "We don't just deliver food; we deliver experiences that create memories."
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Fade in={activeSection === 'mission'} timeout={1000} style={{ transitionDelay: '300ms' }}>
                  <Card 
                    elevation={6}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: `1px solid ${secondaryColor}22`,
                      background: `linear-gradient(135deg, #fff 0%, ${lightColor} 100%)`,
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 30px ${darkColor}22`
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        backgroundColor: secondaryColor,
                        color: '#fff',
                        py: 1,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="overline" fontWeight={600} letterSpacing={1}>
                        OUR VISION
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h4" sx={{ mb: 3, color: darkColor, fontWeight: 700 }}>
                        Redefining Convenience
                      </Typography>
                      <Typography variant="body1" sx={{ color: `${darkColor}cc`, lineHeight: 1.8, mb: 4, flexGrow: 1 }}>
                        To become the global leader in food delivery by pioneering innovations that 
                        anticipate customer needs and exceed expectations. We envision a world where 
                        quality food is accessible to everyone, everywhere, while supporting local 
                        businesses and promoting sustainable practices across the entire food ecosystem.
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: `${secondaryColor}11`, 
                        borderRadius: 2,
                        borderLeft: `4px solid ${secondaryColor}`
                      }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: `${darkColor}99` }}>
                          "Our vision is to make exceptional food as accessible as opening your front door."
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Section>

        {/* Features Section */}
        <Box 
          id="features" 
          className="scroll-section"
          sx={{ 
            py: { xs: 8, md: 16 }, 
            backgroundColor: `${darkColor}05`,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: darkColor,
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60%',
                    height: '4px',
                    bottom: '-8px',
                    left: '20%',
                    backgroundColor: primaryColor,
                    borderRadius: '4px'
                  }
                }}
              >
                Why Choose YO<span style={{ color: primaryColor }}>Food</span>
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: `${darkColor}99`,
                  maxWidth: '700px',
                  margin: '1.5rem auto',
                }}
              >
                Experience the difference with our exceptional service and innovative features
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade 
                    in={activeSection === 'features'} 
                    timeout={600 + (index * 150)}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card 
                      elevation={2}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 20px ${darkColor}22`,
                          '& .feature-icon': {
                            transform: 'scale(1.1)',
                            backgroundColor: primaryColor,
                            color: '#fff'
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Avatar 
                          className="feature-icon"
                          sx={{ 
                            bgcolor: `${primaryColor}22`,
                            color: primaryColor,
                            width: 80,
                            height: 80,
                            mb: 3,
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: `0 8px 16px ${primaryColor}33`
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography variant="h5" sx={{ mb: 2, color: darkColor, fontWeight: 700 }}>
                          {feature.title}
                        </Typography>
                        <Divider sx={{ width: '40%', my: 2, borderColor: `${primaryColor}44` }} />
                        <Typography variant="body1" sx={{ color: `${darkColor}99`, lineHeight: 1.7 }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Team Section */}
        <Box 
          id="team" 
          className="scroll-section"
          sx={{ 
            py: { xs: 8, md: 16 }, 
            position: 'relative',
            zIndex: 1
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  color: darkColor,
                  mb: 2,
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60%',
                    height: '4px',
                    bottom: '-8px',
                    left: '20%',
                    backgroundColor: primaryColor,
                    borderRadius: '4px'
                  }
                }}
              >
                Meet Our Team
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: `${darkColor}99`,
                  maxWidth: '700px',
                  margin: '1.5rem auto',
                }}
              >
                The passionate individuals behind YO<span style={{ color: primaryColor }}>Food</span>'s success
              </Typography>
            </Box>
            
            <Grid container spacing={6} justifyContent="center">
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={5} key={index}>
                  <Fade 
                    in={activeSection === 'team'} 
                    timeout={1000}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <Card 
                      elevation={5}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, #fff 0%, ${lightColor} 100%)`,
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 20px 30px ${darkColor}22`,
                          '& .team-image': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                    >
                      <Box sx={{ 
                        width: { xs: '100%', sm: '40%' },
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundColor: primaryColor
                      }}>
                        <Avatar 
                          src={member.image}
                          className="team-image"
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.5s ease',
                            borderRadius: 0
                          }}
                        />
                      </Box>
                      <CardContent sx={{ 
                        p: 4, 
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              mb: 1, 
                              color: darkColor, 
                              fontWeight: 700 
                            }}
                          >
                            {member.name}
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              mb: 2, 
                              color: primaryColor, 
                              fontWeight: 600 
                            }}
                          >
                            {member.role}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: `${darkColor}99`, 
                              lineHeight: 1.7,
                              mb: 3
                            }}
                          >
                            {member.description}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}>
                          <Tooltip title="Twitter">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: '#1DA1F2',
                                '&:hover': {
                                  backgroundColor: '#1DA1F2',
                                  color: '#fff'
                                }
                              }}
                            >
                              <Twitter />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="LinkedIn">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: '#0077B5',
                                '&:hover': {
                                  backgroundColor: '#0077B5',
                                  color: '#fff'
                                }
                              }}
                            >
                              <LinkedIn />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Instagram">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: '#E1306C',
                                '&:hover': {
                                  backgroundColor: '#E1306C',
                                  color: '#fff'
                                }
                              }}
                            >
                              <Instagram />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Email">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: primaryColor,
                                '&:hover': {
                                  backgroundColor: primaryColor,
                                  color: '#fff'
                                }
                              }}
                            >
                              <Email />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        {/* <Box sx={{ 
          backgroundColor: primaryColor,
          color: '#fff',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z" fill="%23FFFFFF" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: '30px 30px',
          }}/>
          
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Fade in={true} timeout={1000}>
                  <Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 3
                      }}
                    >
                      Ready to Experience the Best Food Delivery?
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 400,
                        mb: 4,
                        opacity: 0.9,
                        lineHeight: 1.6
                      }}
                    >
                      Join thousands of satisfied customers who enjoy their favorite meals 
                      delivered right to their doorstep with just a few taps.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/menu')}
                        sx={{ 
                          backgroundColor: '#fff',
                          color: primaryColor,
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: lightColor,
                            transform: 'translateY(-3px)',
                            boxShadow: `0 10px 20px rgba(0,0,0,0.2)`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Browse Menu
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{ 
                          color: '#fff',
                          borderColor: '#fff',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-3px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Sign Up Now
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={5}>
                <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
                  <Paper 
                    elevation={10}
                    sx={{ 
                      p: 3, 
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ color: darkColor, fontWeight: 700 }}>
                        Download Our App
                      </Typography>
                      <Typography variant="body2" sx={{ color: `${darkColor}99`, mt: 1 }}>
                        Get the full experience on your mobile device
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      justifyContent: 'center'
                    }}>
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          backgroundColor: '#000',
                          color: '#fff',
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#333'
                          }
                        }}
                      >
                        App Store
                      </Button>
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          backgroundColor: '#689f38',
                          color: '#fff',
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#558b2f'
                          }
                        }}
                      >
                        Google Play
                      </Button>
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box> */}
        
        {/* Footer */}
        {/* <Box sx={{ 
          backgroundColor: darkColor,
          color: '#fff',
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 }
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  YO<span style={{ color: primaryColor }}>Food</span>
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    opacity: 0.7,
                    lineHeight: 1.7
                  }}
                >
                  Revolutionizing food delivery with cutting-edge technology and exceptional culinary experiences. 
                  Our passion is connecting people with amazing food from their favorite local restaurants.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <IconButton sx={{ color: '#fff' }}>
                    <Twitter />
                  </IconButton>
                  <IconButton sx={{ color: '#fff' }}>
                    <Instagram />
                  </IconButton>
                  <IconButton sx={{ color: '#fff' }}>
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['About Us', 'Careers', 'Blog', 'Press Kit', 'Contact'].map((item, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.7,
                        '&:hover': {
                          opacity: 1,
                          color: primaryColor
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Partner Terms', 'Security'].map((item, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.7,
                        '&:hover': {
                          opacity: 1,
                          color: primaryColor
                        },
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Subscribe to Our Newsletter
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    opacity: 0.7
                  }}
                >
                  Get the latest updates, promotions, and culinary insights delivered to your inbox.
                </Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1
                }}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      flexGrow: 1,
                      outline: 'none'
                    }}
                  />
                  <Button 
                    variant="contained"
                    sx={{ 
                      backgroundColor: primaryColor,
                      color: '#fff',
                      py: { xs: 1.5, sm: 1 },
                      px: 3,
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: '#E64A19'
                      }
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2
            }}>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                © {new Date().getFullYear()} YOFood. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                {['Accessibility', 'Sitemap', 'Support'].map((item, index) => (
                  <Typography 
                    key={index} 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.6,
                      '&:hover': {
                        opacity: 1,
                        textDecoration: 'underline'
                      },
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Container>
        </Box> */}
      </Box>
    </Box>
  );
};

export default AboutUs;