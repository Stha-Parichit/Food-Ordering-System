import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  IconButton, 
  Avatar, 
  Button,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Card,
  CardContent,
  Menu,
  MenuItem,
  TablePagination,
  CircularProgress,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SortIcon from "@mui/icons-material/Sort";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const navigate = useNavigate();

  // Mock user status for demonstration
  const userStatus = {
    active: ["john.doe@example.com", "lisa.smith@example.com", "mike.johnson@example.com"],
    inactive: ["anna.wilson@example.com"],
    new: ["james.brown@example.com", "sarah.williams@example.com"]
  };

  useEffect(() => {
    document.title = "User Management - Admin Panel";
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      filterUsers();
      updateStats();
    }
  }, [users, searchQuery, activeFilter]);

  const updateStats = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      inactive: users.filter(u => u.status === "inactive").length,
      new: users.filter(u => {
        const createdDate = new Date(u.created_at);
        return createdDate >= thirtyDaysAgo;
      }).length
    };

    setUserStats(stats);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      
      // Keep original status from API response
      const usersWithFormattedDates = response.data.map(user => {
        return {
          ...user,
          lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never",
          registeredDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"
        };
      });
      
      setUsers(usersWithFormattedDates);
      setFilteredUsers(usersWithFormattedDates);
      updateStats();
      
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && String(user.phone).includes(searchQuery))
      );
    }
    
    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "new") {
        // Filter for users registered in last 30 days
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        filtered = filtered.filter(user => {
          const createdDate = new Date(user.created_at);
          return createdDate >= thirtyDaysAgo;
        });
      } else {
        // Filter by active/inactive status
        filtered = filtered.filter(user => user.status === activeFilter);
      }
    }
    
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      handleCloseMenu();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      status: user.status || 'active'
    });
    setEditDialogOpen(true);
    handleCloseMenu();
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`/api/users/${editingUser.id}`, editFormData);
      
      // Update the users list with the edited user data
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...editFormData }
            : user
        )
      );
      
      // Update filtered users as well
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...editFormData }
            : user
        )
      );

      setEditDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(0);
  };

  const generateRandomDate = (older = false) => {
    const start = older ? new Date(2022, 0, 1) : new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return { bg: "#E9F7EF", color: "#27AE60" };
      case "inactive":
        return { bg: "#FDEBD0", color: "#F39C12" };
      case "new":
        return { bg: "#E8F0FE", color: "#3498DB" };
      default:
        return { bg: "#F2F3F4", color: "#7F8C8D" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "new":
        return "New";
      default:
        return "Unknown";
    }
  };

  const exportUserData = () => {
    // This would normally handle exporting the data
    console.log("Exporting user data...");
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f7f8fc", minHeight: "100vh" }}>
      {/* AdminSidebar Component */}
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 }, 
          width: { xs: "100%", md: "calc(100% - 280px)" },
          ml: { xs: 0, md: "0" }
        }}
      >
        {/* Header and Stats Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#1a1a2e" }}>
            User Management
          </Typography>
          {/* <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            sx={{ 
              borderRadius: "8px", 
              bgcolor: "#FF6384", 
              '&:hover': { bgcolor: "#FF4D6D" } 
            }}
            onClick={() => navigate("/add-user")}
          >
            Add New User
          </Button> */}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {userStats.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last updated today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#27AE60">
                  {userStats.active}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Math.round((userStats.active / userStats.total) * 100)}% of total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  New Users
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#3498DB">
                  {userStats.new}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Last 30 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Inactive Users
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#F39C12">
                  {userStats.inactive}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Require attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <TextField
            placeholder="Search by name, email or phone"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              minWidth: { xs: "100%", sm: "300px" },
              bgcolor: "white",
              borderRadius: "8px",
              '& .MuiOutlinedInput-root': {
                borderRadius: "8px"
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button 
              variant={activeFilter === "all" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleFilterChange("all")}
              sx={{ 
                borderRadius: "20px",
                bgcolor: activeFilter === "all" ? "#FF6384" : "transparent",
                '&:hover': { bgcolor: activeFilter === "all" ? "#FF4D6D" : "rgba(255,99,132,0.08)" },
                color: activeFilter === "all" ? "white" : "#1a1a2e",
                borderColor: activeFilter === "all" ? "#FF6384" : "rgba(0,0,0,0.12)"
              }}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === "active" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleFilterChange("active")}
              sx={{ 
                borderRadius: "20px",
                bgcolor: activeFilter === "active" ? "#27AE60" : "transparent",
                '&:hover': { bgcolor: activeFilter === "active" ? "#219653" : "rgba(39,174,96,0.08)" },
                color: activeFilter === "active" ? "white" : "#27AE60",
                borderColor: activeFilter === "active" ? "#27AE60" : "rgba(39,174,96,0.5)"
              }}
            >
              Active
            </Button>
            <Button 
              variant={activeFilter === "new" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleFilterChange("new")}
              sx={{ 
                borderRadius: "20px",
                bgcolor: activeFilter === "new" ? "#3498DB" : "transparent",
                '&:hover': { bgcolor: activeFilter === "new" ? "#2980B9" : "rgba(52,152,219,0.08)" },
                color: activeFilter === "new" ? "white" : "#3498DB",
                borderColor: activeFilter === "new" ? "#3498DB" : "rgba(52,152,219,0.5)"
              }}
            >
              New (30 days)
            </Button>
            <Button 
              variant={activeFilter === "inactive" ? "contained" : "outlined"}
              size="small"
              onClick={() => handleFilterChange("inactive")}
              sx={{ 
                borderRadius: "20px",
                bgcolor: activeFilter === "inactive" ? "#F39C12" : "transparent",
                '&:hover': { bgcolor: activeFilter === "inactive" ? "#D35400" : "rgba(243,156,18,0.08)" },
                color: activeFilter === "inactive" ? "white" : "#F39C12",
                borderColor: activeFilter === "inactive" ? "#F39C12" : "rgba(243,156,18,0.5)"
              }}
            >
              Inactive
            </Button>
            {/* <Tooltip title="Export Data">
              <IconButton 
                onClick={exportUserData}
                sx={{ 
                  bgcolor: "white", 
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)", 
                  '&:hover': { bgcolor: "#f5f5f5" } 
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Box>

        {/* User Table */}
        <Card sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", mb: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
              <CircularProgress sx={{ color: "#FF6384" }} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Status
                          <IconButton size="small">
                            <SortIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Registered Date
                          <IconButton size="small">
                            <SortIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Last Login</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                      const statusStyle = getStatusColor(user.status);
                      return (
                        <TableRow 
                          key={user.id}
                          sx={{ 
                            '&:hover': { bgcolor: "#f8f9fa" },
                            transition: "background-color 0.2s"
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: "#FF6384", 
                                  width: 40, 
                                  height: 40,
                                  mr: 2,
                                  border: "2px solid white",
                                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                }}
                              >
                                {user.fullName?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {user.fullName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  ID: #{user.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.phone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusLabel(user.status)} 
                              size="small"
                              sx={{ 
                                bgcolor: statusStyle.bg, 
                                color: statusStyle.color,
                                fontWeight: "bold",
                                borderRadius: "6px"
                              }} 
                            />
                          </TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell>{user.lastLogin}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              onClick={(e) => handleOpenMenu(e, user)}
                              size="small"
                              sx={{ 
                                bgcolor: "#f5f6f8", 
                                '&:hover': { bgcolor: "#e9ecef" } 
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1">No users found matching your criteria</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>

        {/* Back to Dashboard button - can be removed or moved to header area */}
        <Box sx={{ textAlign: "center" }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate("/admin-dashboard")}
            sx={{ borderRadius: "8px" }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>

      {/* User Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { 
            minWidth: 180,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }
        }}
      >
        <MenuItem onClick={() => selectedUser && handleEditUser(selectedUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1, color: "#3498DB" }} />
          Edit User
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleDeleteUser(selectedUser.id)}
          sx={{ color: "#E74C3C" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: "#f8f9fa", 
          borderBottom: "1px solid #e9ecef",
          py: 2
        }}>
          Edit User
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={editFormData.fullName}
                onChange={handleEditFormChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                disabled
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={editFormData.address}
                onChange={handleEditFormChange}
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Note: Users registered within the last 30 days are counted as new users
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: "1px solid #e9ecef" 
        }}>
          <Button 
            onClick={handleCloseEditDialog}
            sx={{ 
              color: "#6c757d",
              '&:hover': { bgcolor: "#f8f9fa" }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            sx={{ 
              bgcolor: "#FF6384",
              '&:hover': { bgcolor: "#FF4D6D" }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllUsers;