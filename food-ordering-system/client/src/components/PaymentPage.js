import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(localStorage.getItem("deliveryAddress") || "");
  const [selectedDiscount, setSelectedDiscount] = useState(JSON.parse(localStorage.getItem("selectedDiscount")) || { title: "0", amount: "0" });
  const [selectedCharity, setSelectedCharity] = useState(JSON.parse(localStorage.getItem("selectedCharity")) || { amount: "Rs. 0" });
  const [paymentMethod, setPaymentMethod] = useState('Standard');
  const [openDialog, setOpenDialog] = useState(false);
  const [mpin, setMpin] = useState("");
  const [message, setMessage] = useState("");
  const [receiptOpen, setReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await axios.get("http://localhost:5000/cart", {
          params: { user_id: userId }
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = getTotal();
  const deliveryFee = 60;
  const charityDonation = selectedCharity ? parseInt(selectedCharity.amount.replace('Rs. ', '')) : 0;
  const discountAmount = selectedDiscount ? (subtotal * parseInt(selectedDiscount.title) / 100) : 0;
  const total = subtotal + deliveryFee + charityDonation - discountAmount;

  const handlePayClick = () => {
    setOpenDialog(true); // Open the dialog when the "Pay" button is clicked
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    // Validate the MPIN (hardcoded validation for testing)
    if (mpin === "2181") { // Simulating successful MPIN validation
      try {
        const userId = localStorage.getItem("user_id");
        await axios.delete(`http://localhost:5000/cart`, {
          params: { user_id: userId }
        });

        // Add or update loyalty points
        await axios.post("http://localhost:5000/loyalty-points", {
          user_id: userId,
          total_amount: total
        });

        // Deduct points from user's loyalty points
        if (selectedDiscount && selectedDiscount.requiredPoints) {
          await axios.post("http://localhost:5000/deduct-loyalty-points", {
            user_id: userId,
            points: selectedDiscount.requiredPoints
          });
        }

        // Clear local storage
        localStorage.removeItem("deliveryAddress");
        localStorage.removeItem("selectedDiscount");
        localStorage.removeItem("selectedCharity");

        setReceiptOpen(true); // Open the receipt popup
      } catch (error) {
        console.error("Error processing payment:", error);
        setMessage("Payment successful, but failed to process some actions.");
      }
    } else {
      setMessage("Invalid MPIN. Please try again.");
    }

    setOpenDialog(false); // Close the dialog after payment submission attempt
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const logoUrl = `${window.location.origin}/images/logo.png`;
  
    // Define position and size of the logo (smaller size)
    const logoX = 5;
    const logoY = 5;
    const logoSize = 10;
  
    // Add Logo (with circular clipping)
    doc.setFillColor(255, 255, 255); // Fill color for the circular mask (white)
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F'); // Draw circle for clipping
    doc.addImage(logoUrl, "PNG", logoX, logoY, logoSize, logoSize);
  
    // Title Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice for Charity Donation", 70, 20);
  
    // Company Info Section
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your Company Name", 10, 30);
    doc.text("1234 Street Address", 10, 35);
    doc.text("City, Country, Zip", 10, 40);
    doc.text("Phone: (123) 456-7890", 10, 45);
    doc.text("Email: info@yourcompany.com", 10, 50);
  
    // Invoice Info Section
    const invoiceNumber = `#${Math.floor(Math.random() * 100000)}`; // Random invoice number
    const invoiceDate = new Date().toLocaleDateString();
    doc.text(`Invoice Number: ${invoiceNumber}`, 150, 30);
    doc.text(`Date: ${invoiceDate}`, 150, 35);
  
    // Donation & Payment Info Section (Styled as a Table)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Donation & Payment Details", 20, 60);
    doc.setFont("helvetica", "normal");
    
    // Table headers
    doc.text("Description", 20, 70);
    doc.text("Amount (Rs.)", 150, 70);
    
    // Table data
    doc.text(`Charity: ${selectedCharity?.title || "N/A"}`, 20, 80);
    doc.text(`Rs. ${charityDonation}`, 150, 80);
    doc.text(`Delivery Fee:`, 20, 90);
    doc.text(`Rs. ${deliveryFee}`, 150, 90);
    doc.text(`Discount:`, 20, 100);
    doc.text(`-Rs. ${discountAmount}`, 150, 100);
    doc.text(`Total Amount:`, 20, 110);
    doc.text(`Rs. ${total}`, 150, 110);
  
    // Tax Exemption Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("This donation is tax-exempt under applicable tax laws.", 20, 120);
    doc.text("Please retain this invoice for your records.", 20, 125);
  
    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your support!", 20, 130);
    doc.text("Your Company Name © 2025", 20, 135);
  
    // Save the document
    doc.save("invoice.pdf");
  };
  
  

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, color: "green" }}>
          eSewa Payment Test
        </Typography>
        <TextField
          label="Subtotal"
          variant="outlined"
          value={`₹ ${subtotal}`}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Delivery Fee"
          variant="outlined"
          value={`₹ ${deliveryFee}`}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Charity Donation"
          variant="outlined"
          value={`₹ ${charityDonation}`}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Loyalty Discount"
          variant="outlined"
          value={`-₹ ${discountAmount}`}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Total"
          variant="outlined"
          value={`₹ ${total}`}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />

        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: "12px",
              fontSize: "16px",
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "green",
              },
            }}
            onClick={handlePayClick} // Open dialog when clicked
          >
            Pay
          </Button>
        </Box>
        
        {message && <Typography variant="body2" sx={{ color: "red", mt: 2, textAlign: "center" }}>{message}</Typography>}
      </Paper>

      {/* MPIN Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Enter MPIN</DialogTitle>
        <DialogContent>
          <TextField
            label="MPIN"
            variant="outlined"
            type="password"
            value={mpin}
            onChange={(e) => setMpin(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitPayment} color="primary">
            Submit Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)}>
        <DialogTitle>Payment Successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Your payment was successful!</Typography>
          <Typography variant="body1">Charity: {selectedCharity?.title || "N/A"}</Typography>
          <Typography variant="body1">Amount: Rs. {charityDonation}</Typography>
          <Typography variant="body1">Date: {new Date().toLocaleDateString()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownloadReceipt} color="primary">
            Download Receipt
          </Button>
          <Button onClick={() => navigate('/home')} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;
