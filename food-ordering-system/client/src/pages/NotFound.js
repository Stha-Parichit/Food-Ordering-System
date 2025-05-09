import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
import PowerIcon from '@mui/icons-material/Power';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

const NotFound = () => {
  const theme = useTheme();
  const [glitchActive, setGlitchActive] = useState(false);
  const [explosion, setExplosion] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  const [poweringDown, setPoweringDown] = useState(false);
  const [scanlineActive, setScanlineActive] = useState(true);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [matrixRain, setMatrixRain] = useState(false);
  const [konami, setKonami] = useState([]);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rainRef = useRef(null);
  
  // Easter egg - Konami code sequence
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  
  // Handle key presses for Konami code
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonami(prev => {
        const updatedKonami = [...prev, e.key];
        if (updatedKonami.length > konamiCode.length) {
          updatedKonami.shift();
        }
        
        // Check if Konami code is entered
        if (updatedKonami.join(',') === konamiCode.join(',')) {
          setMatrixRain(true);
          setTimeout(() => setMatrixRain(false), 10000);
        }
        
        return updatedKonami;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Matrix rain effect
  useEffect(() => {
    if (matrixRain && rainRef.current) {
      const canvas = rainRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      
      // Characters to display
      const chars = '404ERRORNOTFOUNDSYSTEMFAILUREアイウエオカキクケコサシスセソタチツテト12345678900xDEADBEEF'.split('');
      
      // Array to track the y position of each column
      const drops = Array(Math.floor(columns)).fill(1);
      
      const drawMatrix = () => {
        // Translucent black background to show trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Green text
        ctx.fillStyle = theme.palette.error.main;
        ctx.font = `${fontSize}px monospace`;
        
        // Loop over each column
        for (let i = 0; i < drops.length; i++) {
          // Random character
          const char = chars[Math.floor(Math.random() * chars.length)];
          
          // Draw the character
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          
          // Move the drop down
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // Increment y coordinate
          drops[i]++;
        }
      };
      
      const matrixInterval = setInterval(drawMatrix, 50);
      
      return () => {
        clearInterval(matrixInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      };
    }
  }, [matrixRain, theme.palette.error.main]);
  
  // Mini game setup
  useEffect(() => {
    if (miniGameActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = 300;
      canvas.height = 200;
      
      // Game variables
      let ship = { x: 150, y: 180, width: 20, height: 20, color: theme.palette.error.main };
      let bullets = [];
      let enemies = [];
      let score = 0;
      
      // Create enemies
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
          enemies.push({
            x: 30 + j * 30,
            y: 30 + i * 20,
            width: 20,
            height: 10,
            color: i % 2 === 0 ? theme.palette.error.light : '#fff',
            dirX: 1
          });
        }
      }
      
      const draw = () => {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ship
        ctx.fillStyle = ship.color;
        ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
        
        // Draw bullets
        bullets.forEach(bullet => {
          ctx.fillStyle = '#fff';
          ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Draw enemies
        enemies.forEach(enemy => {
          ctx.fillStyle = enemy.color;
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.fillText(`SCORE: ${score}`, 10, 20);
      };
      
      // Game update logic
      const update = () => {
        // Move bullets
        bullets = bullets.filter(bullet => {
          bullet.y -= 5;
          
          // Check for collisions with enemies
          enemies = enemies.filter(enemy => {
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ) {
              score += 10;
              return false; // Remove the enemy
            }
            return true;
          });
          
          return bullet.y > 0;
        });
        
        // Move enemies
        let shouldChangeDirection = false;
        
        enemies.forEach(enemy => {
          enemy.x += enemy.dirX;
          
          if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            shouldChangeDirection = true;
          }
        });
        
        if (shouldChangeDirection) {
          enemies.forEach(enemy => {
            enemy.dirX *= -1;
            enemy.y += 5;
          });
        }
        
        // Check for game end
        if (enemies.length === 0) {
          ctx.fillStyle = '#fff';
          ctx.font = '20px monospace';
          ctx.fillText('YOU WIN! SCORE: ' + score, 60, 100);
          return false;
        }
        
        if (enemies.some(enemy => enemy.y + enemy.height >= ship.y)) {
          ctx.fillStyle = '#fff';
          ctx.font = '20px monospace';
          ctx.fillText('GAME OVER! SCORE: ' + score, 50, 100);
          return false;
        }
        
        return true;
      };
      
      // Game loop
      let gameRunning = true;
      const gameLoop = () => {
        if (gameRunning) {
          gameRunning = update();
          draw();
          requestAnimationFrame(gameLoop);
        }
      };
      
      // Start game loop
      gameLoop();
      
      // Event listeners for ship control
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft' && ship.x > 0) {
          ship.x -= 10;
        } else if (e.key === 'ArrowRight' && ship.x + ship.width < canvas.width) {
          ship.x += 10;
        } else if (e.key === ' ') {
          bullets.push({
            x: ship.x + ship.width / 2 - 2,
            y: ship.y,
            width: 4,
            height: 10
          });
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        gameRunning = false;
      };
    }
  }, [miniGameActive, theme.palette.error.light, theme.palette.error.main]);
  
  // Handle mouse movement for interactive elements
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      // Random glitch based on mouse movement
      if (Math.random() > 0.99) {
        triggerGlitch(0.3);
      }
    }
  };
  
  // Trigger glitch effect with custom intensity
  const triggerGlitch = (intensity = 1) => {
    setGlitchIntensity(intensity);
    setGlitchActive(true);
    setTimeout(() => {
      setGlitchActive(false);
      setGlitchIntensity(0);
    }, 150 * intensity);
  };
  
  // Terminal typing effect
  const typeTerminalText = (text) => {
    let i = 0;
    setTerminalText('');
    const typing = setInterval(() => {
      if (i < text.length) {
        setTerminalText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 40);
    
    return () => clearInterval(typing);
  };
  
  // Power down effect
  const handlePowerDown = () => {
    setPoweringDown(true);
    triggerGlitch(3);
    
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };
  
  // Toggle Easter egg
  const toggleEasterEgg = () => {
    setShowEasterEgg(!showEasterEgg);
    
    if (!showEasterEgg) {
      typeTerminalText('SECRET DEBUG MODE ACTIVATED... PRESS KONAMI CODE FOR MATRIX EFFECT');
    } else {
      setTerminalText('');
    }
  };

  // Trigger initial animations
  useEffect(() => {
    // Initial loading sequence
    setTimeout(() => {
      setExplosion(true);
      setTimeout(() => {
        setShowContent(true);
        
        // Start terminal typing after content appears
        typeTerminalText('SYSTEM FAILURE: DIRECTORY NOT FOUND. ERROR CODE: 404. ATTEMPTING TO RECOVER DATA...');
      }, 600);
    }, 500);
    
    // Set up random glitch effect interval
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch(Math.random() * 0.5 + 0.5);
      }
    }, 3000);
    
    // Set up scanline flicker
    const scanlineInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setScanlineActive(false);
        setTimeout(() => setScanlineActive(true), 100);
      }
    }, 2000);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => Math.random() > 0.7 && triggerGlitch()}
      sx={{
        minHeight: '100vh',
        background: '#000',
        overflowY: { xs: 'auto', md: 'hidden' },
        overflowX: 'hidden',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'none',
        transition: 'all 0.5s',
        filter: poweringDown ? 'brightness(0)' : 'none',
      }}
    >
      {/* Custom cursor */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: { xs: '20px', md: '30px' },
          height: { xs: '20px', md: '30px' },
          borderRadius: '50%',
          border: `2px solid ${theme.palette.error.main}`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '5px',
            height: '5px',
            backgroundColor: glitchActive ? theme.palette.primary.main : theme.palette.error.light,
            borderRadius: '50%',
          }
        }}
      />

      {/* Matrix rain canvas */}
      {matrixRain && (
        <canvas
          ref={rainRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Scanlines effect */}
      {scanlineActive && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 4,
            opacity: 0.2,
            animation: 'scanlines 8s linear infinite',
            '@keyframes scanlines': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '0 100%' }
            }
          }}
        />
      )}

      {/* VHS tracking effect */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          opacity: glitchActive ? 0.5 : 0,
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255, 0, 0, 0.5) 2px, rgba(255, 0, 0, 0.5) 4px)',
          transform: glitchActive ? `translateY(${Math.random() * 10}px)` : 'none',
          animation: 'tracking 2s linear infinite',
          '@keyframes tracking': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '0 100px' }
          }
        }}
      />

      {/* Animated grid background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${theme.palette.error.dark}22 1px, transparent 1px), 
                           linear-gradient(90deg, ${theme.palette.error.dark}22 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'gridMove 15s linear infinite',
          opacity: 0.3,
          '@keyframes gridMove': {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '40px 40px' },
          },
        }}
      />

      {/* Explosion animation */}
      {explosion && Array(20).fill(0).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        return (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 80 + 20,
              height: Math.random() * 10 + 5,
              backgroundColor: i % 2 === 0 ? theme.palette.error.main : theme.palette.error.light,
              left: '50%',
              top: '50%',
              opacity: showContent ? 0 : 0.8,
              transition: 'all 1s cubic-bezier(.17,.67,.83,.67)',
              transform: showContent 
                ? `translate(-50%, -50%) rotate(${angle}rad) translateX(${distance * 4}px)` 
                : `translate(-50%, -50%) rotate(${angle}rad) translateX(0)`,
            }}
          />
        );
      })}

      {/* Distortion overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: glitchActive ? 0.2 : 0.05,
          pointerEvents: 'none',
          zIndex: 1,
          animation: glitchActive ? 'noise 0.2s steps(2) infinite' : 'none',
          '@keyframes noise': {
            '0%': { transform: 'translate(0)' },
            '10%': { transform: 'translate(-5%, -5%)' },
            '20%': { transform: 'translate(10%, 5%)' },
            '30%': { transform: 'translate(5%, 0%)' },
            '40%': { transform: 'translate(-5%, 10%)' },
            '50%': { transform: 'translate(-10%, 5%)' },
            '60%': { transform: 'translate(20%, 0%)' },
            '70%': { transform: 'translate(0%, 10%)' },
            '80%': { transform: 'translate(-15%, 0%)' },
            '90%': { transform: 'translate(10%, 5%)' },
            '100%': { transform: 'translate(5%, 0%)' },
          }
        }}
      />

      {/* Glitching 404 text */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none',
          overflow: 'visible',
          marginTop: { xs: '-4rem', sm: '-10rem' },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '12rem', sm: '20rem', md: '30rem' },
            fontWeight: 900,
            color: 'black',
            textShadow: `
              4px 4px 0 ${theme.palette.error.main},
              7px 7px 0 ${theme.palette.error.dark}
            `,
            position: 'relative',
            opacity: showContent ? 1 : 0,
            transition: 'opacity 0.5s ease',
            animation: glitchActive ? 'glitch 0.15s infinite' : 'none',
            '@keyframes glitch': {
              '0%': { transform: `translate(${-5 * glitchIntensity}px, 0)` },
              '25%': { transform: `translate(${5 * glitchIntensity}px, 0)` },
              '50%': { transform: `translate(${-5 * glitchIntensity}px, 0)` },
              '75%': { transform: `translate(${5 * glitchIntensity}px, 0)` },
              '100%': { transform: 'translate(0, 0)' },
            },
          }}
        >
          404
        </Typography>

        {/* Glitch effect elements */}
        {glitchActive && (
          <>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '12rem', sm: '20rem', md: '30rem' },
                fontWeight: 900,
                color: theme.palette.error.main,
                opacity: 0.8,
                position: 'absolute',
                top: 0,
                left: '3px',
                pointerEvents: 'none',
                transform: 'translateX(-5px)',
                clipPath: 'polygon(0 25%, 100% 25%, 100% 30%, 0 30%)',
              }}
            >
              404
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '12rem', sm: '20rem', md: '30rem' },
                fontWeight: 900,
                color: theme.palette.primary.main,
                opacity: 0.8,
                position: 'absolute',
                top: 0,
                left: '-3px',
                pointerEvents: 'none',
                transform: 'translateX(5px)',
                clipPath: 'polygon(0 60%, 100% 60%, 100% 65%, 0 65%)',
              }}
            >
              404
            </Typography>
          </>
        )}
      </Box>

      {/* Terminal text */}
      {terminalText && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            maxWidth: '600px',
            width: '90%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: `1px solid ${theme.palette.error.main}`,
            p: 2,
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.error.light,
              fontFamily: 'monospace',
              position: 'relative',
              pl: 2,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: theme.palette.error.main,
                borderRadius: '50%',
                animation: 'blink 1s infinite',
              },
              '@keyframes blink': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0 },
              },
            }}
          >
            {terminalText}
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: '10px',
                height: '18px',
                backgroundColor: '#fff',
                ml: 0.5,
                animation: 'blink 1s infinite',
              }}
            />
          </Typography>
        </Box>
      )}

      {/* Mini game canvas */}
      {miniGameActive && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: `2px solid ${theme.palette.error.main}`,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              mb: 2,
              fontFamily: 'monospace',
            }}
          >
            404 SPACE INVADERS
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#ccc',
              mb: 2,
              fontFamily: 'monospace',
            }}
          >
            Use ← → to move, SPACE to shoot
          </Typography>
          <canvas
            ref={canvasRef}
            style={{ border: `1px solid ${theme.palette.grey[800]}` }}
          />
          <Button
            onClick={() => setMiniGameActive(false)}
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              fontFamily: 'monospace',
            }}
          >
            CLOSE GAME
          </Button>
        </Box>
      )}

      {/* Main content */}
      <Container maxWidth="md">
        <Box
          sx={{
            opacity: showContent ? 1 : 0,
            transform: showContent 
              ? { xs: 'translateY(60%)', md: 'translateY(80%)' } 
              : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s',
          }}
        >
          <Box 
            sx={{ 
              textAlign: 'center',
              position: 'relative',
              zIndex: 5,
              mt: { xs: '20vh', md: 0 }, 
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                mb: 3,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '4px',
                textShadow: `2px 2px 8px ${alpha(theme.palette.error.main, 0.6)}`,
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: glitchActive ? `repeating-linear-gradient(90deg, transparent, rgba(255,0,0,0.2) 1px, transparent 2px)` : 'none',
                  pointerEvents: 'none',
                  opacity: 0.5,
                }
              }}
            >
              SIGNAL LOST
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: alpha('#fff', 0.8),
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontFamily: 'monospace',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                position: 'relative',
                px: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '-20px',
                  top: '50%',
                  width: '10px',
                  height: '10px',
                  backgroundColor: theme.palette.error.main,
                  borderRadius: '50%',
                  animation: 'blink 1s infinite',
                },
                '&::first-letter': {
                  color: theme.palette.error.main,
                  fontWeight: 'bold',
                  fontSize: '1.5em',
                }
              }}
            >
              THE PAGE YOU'RE LOOKING FOR HAS BEEN DELETED, MOVED, OR POSSIBLY NEVER EXISTED
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
              }}
            >
              <Button
                component={Link}
                to="/"
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  background: theme.palette.error.main,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: 0,
                  border: '2px solid #fff',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  letterSpacing: 1,
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 5,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.4)}, transparent)`,
                  },
                  '&:hover': {
                    zIndex: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    backgroundColor: theme.palette.error.dark,
                    transform: 'scale(1.05)',
                    '&::before': {
                      animation: 'shine 1s',
                      '@keyframes shine': {
                        '100%': {
                          left: '100%',
                        },
                      },
                    },
                  },
                }}
              >
                RETURN HOME
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outlined"
                size="large"
                startIcon={<ReplayIcon />}
                sx={{
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  borderWidth: 2,
                  borderRadius: 0,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: theme.palette.error.light,
                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                TRY AGAIN
              </Button>
            </Box>
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 6,
                gap: 4,
              }}
            >
              <Button
                onClick={toggleEasterEgg}
                startIcon={<BugReportIcon />}
                sx={{
                  color: alpha('#fff', 0.6),
                  borderColor: alpha('#fff', 0.3),
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  '&:hover': {
                    color: theme.palette.error.light,
                    borderColor: theme.palette.error.light,
                  },
                }}
              >
                DEBUG
              </Button>
              <Button
                onClick={() => setMiniGameActive(true)}
                startIcon={<VideogameAssetIcon />}
                sx={{
                  color: alpha('#fff', 0.6),
                  borderColor: alpha('#fff', 0.3),
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  '&:hover': {
                    color: theme.palette.error.light,
                    borderColor: theme.palette.error.light,
                  },
                }}
              >
                PLAY GAME
              </Button>
              <Button
                onClick={handlePowerDown}
                startIcon={<PowerIcon />}
                sx={{
                  color: alpha('#fff', 0.6),
                  borderColor: alpha('#fff', 0.3),
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  '&:hover': {
                    color: theme.palette.error.light,
                    borderColor: theme.palette.error.light,
                  },
                }}
              >
                POWER OFF
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;