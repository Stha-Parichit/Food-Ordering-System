import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });
const BASE_URL = 'http://localhost:5000';

export const fetchUsers = () => API.get('/users');

// Fetch all food items
export const getFoodItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food-items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching food items:', error);
      throw error;
    }
  };
  
  // Add a new food item
  export const addFoodItem = async (foodItem) => {
    try {
      const response = await axios.post(`${BASE_URL}/food-items`, foodItem);
      return response.data;
    } catch (error) {
      console.error('Error adding food item:', error);
      throw error;
    }
  };
  
  // Delete a food item by ID
  export const deleteFoodItem = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/food-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting food item:', error);
      throw error;
    }
  };