import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  Alert,
  Snackbar,
  Fade,
  Avatar,
  InputAdornment
} from "@mui/material";
import {
  CloudUpload,
  PlayCircleOutline,
  Delete,
  AddCircle,
  AccessTime,
  Restaurant,
  Tag,
  Videocam,
  ChevronRight,
  CheckCircle
} from "@mui/icons-material";
import { motion } from "framer-motion";
import axios from "axios";

const difficulty = ["Beginner", "Intermediate", "Advanced", "Expert"];
const categories = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Vegan",
  "Desserts",
  "Baking",
  "Grilling",
  "Other"
];

const UploadTutorial = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    duration: "",
    ingredients: [],
    currentIngredient: ""
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddIngredient = () => {
    if (formData.currentIngredient.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, prev.currentIngredient.trim()],
        currentIngredient: ""
      }));
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for the video
      const objectUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(objectUrl);
      
      // Estimate duration based on file size (rough estimate)
      // Average cooking video is about 10MB per minute
      const estimatedMinutes = Math.ceil(selectedFile.size / (10 * 1024 * 1024));
      
      setFormData(prev => ({
        ...prev,
        duration: estimatedMinutes.toString()
      }));
    }
  };

  const handleDeleteVideo = () => {
    setFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const { title, description, category, difficultyLevel } = formData;
    return title.trim() && description.trim() && category && difficultyLevel && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setUploadError("Please fill in all required fields");
      setOpenSnackbar(true);
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const data = new FormData();
    data.append("video", file);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("difficultyLevel", formData.difficultyLevel);
    data.append("duration", formData.duration);
    data.append("ingredients", JSON.stringify(formData.ingredients));
    data.append("createdAt", new Date().toISOString());
    
    try {
      await axios.post("http://localhost:5000/api/upload-tutorial", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      setUploadSuccess(true);
      setOpenSnackbar(true);
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          difficultyLevel: "",
          duration: "",
          ingredients: [],
          currentIngredient: ""
        });
        setFile(null);
        setVideoPreview(null);
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error.response?.data?.message || 
        "Failed to upload tutorial. Please try again."
      );
      setOpenSnackbar(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper 
        elevation={3} 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}
      >
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              width: 60,
              height: 60
            }}
          >
            <Videocam fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Upload Cooking Tutorial
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Share your culinary expertise with our community
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Left side - Video Upload */}
          <Grid item xs={12} md={5}>
            <Box 
              sx={{ 
                height: "100%",
                display: "flex",
                flexDirection: "column" 
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tutorial Video
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 2,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 300,
                  border: `2px dashed ${theme.palette.grey[300]}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.grey[50],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: "rgba(63, 81, 181, 0.04)"
                  }
                }}
              >
                {!videoPreview ? (
                  <Box 
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center",
                      p: 4,
                      textAlign: "center"
                    }}
                  >
                    <CloudUpload color="primary" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6" color="primary" gutterBottom>
                      Drag and drop your video here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Or click to browse files (MP4, MOV, AVI)
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => fileInputRef.current.click()}
                      startIcon={<AddCircle />}
                      sx={{ 
                        mt: 2,
                        px: 3,
                        py: 1,
                        borderRadius: 8,
                        textTransform: "none",
                        fontSize: "1rem"
                      }}
                    >
                      Select Video
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleVideoChange}
                      accept="video/*"
                      style={{ display: "none" }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <Box
                      component="video"
                      src={videoPreview}
                      controls
                      sx={{
                        width: "100%",
                        maxHeight: 300,
                        borderRadius: 2,
                        objectFit: "contain"
                      }}
                    />
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2">
                        {file?.name}
                      </Typography>
                      <IconButton 
                        color="error" 
                        onClick={handleDeleteVideo}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>
              
              {file && (
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Duration (mins):
                        </Typography>
                      </Box>
                      <TextField
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="e.g. 15"
                        size="small"
                        type="number"
                        fullWidth
                        margin="dense"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">min</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tag fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Difficulty:
                        </Typography>
                      </Box>
                      <FormControl fullWidth margin="dense" size="small">
                        <Select
                          name="difficultyLevel"
                          value={formData.difficultyLevel}
                          onChange={handleInputChange}
                          displayEmpty
                        >
                          <MenuItem disabled value="">Select difficulty</MenuItem>
                          {difficulty.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right side - Tutorial Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tutorial Details
            </Typography>
            
            <TextField
              label="Tutorial Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              placeholder="e.g. Perfect Homemade Pizza From Scratch"
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              placeholder="Describe your tutorial and what viewers will learn..."
              required
            />
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Restaurant fontSize="small" color="action" />
                <Typography variant="body2" fontWeight="medium">
                  Ingredients
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  name="currentIngredient"
                  value={formData.currentIngredient}
                  onChange={handleInputChange}
                  placeholder="Add an ingredient"
                  fullWidth
                  size="small"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIngredient();
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddIngredient}
                  sx={{ minWidth: "fit-content" }}
                >
                  Add
                </Button>
              </Box>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                {formData.ingredients.length > 0 ? (
                  formData.ingredients.map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient}
                      onDelete={() => handleRemoveIngredient(index)}
                      sx={{ m: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    No ingredients added yet
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 6, px: 3 }}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                endIcon={isUploading ? null : <ChevronRight />}
                disabled={isUploading || !validateForm()}
                onClick={handleSubmit}
                sx={{ 
                  borderRadius: 6,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                }}
              >
                {isUploading ? "Uploading..." : "Upload Tutorial"}
              </Button>
            </Box>
            
            {isUploading && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {uploadProgress < 100 ? "Uploading..." : "Processing..."}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(63, 81, 181, 0.1)'
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>
                  {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          TransitionComponent={Fade}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={uploadSuccess ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
            icon={uploadSuccess ? <CheckCircle /> : undefined}
          >
            {uploadSuccess ? "Tutorial uploaded successfully!" : uploadError}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default UploadTutorial;