import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FoodManager.css";

const FoodManager = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = () => {
    if (itemName && itemDescription && itemImage) {
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("description", itemDescription);
      formData.append("image", itemImage); // Attach the image file

      fetch("http://localhost:5000/food", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })
        .then((res) => {
          if (res.ok) {
            alert("Item added successfully.");
            navigate("/"); // Redirect after success
          } else {
            alert("Error adding item.");
          }
        })
        .catch((err) => console.error("Error submitting item:", err));
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="food-manager-container">
      <h2>Add New Item</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <textarea
        placeholder="Item Description"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
      ></textarea>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FoodManager;
