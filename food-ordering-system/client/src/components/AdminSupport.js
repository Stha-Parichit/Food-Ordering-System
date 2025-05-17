import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  TablePagination,
  TextareaAutosize,
  Tooltip
} from "@mui/material";
import {
  Reply as ReplyIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  PriorityHigh as PriorityHighIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/support/tickets");
      setTickets(response.data);
      setFilteredTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      await axios.post(`/api/support/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage
      });

      // Update the ticket in the local state
      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket.id
          ? { ...ticket, status: "resolved", lastReply: new Date().toISOString() }
          : ticket
      ));

      setReplyDialogOpen(false);
      setReplyMessage("");
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await axios.put(`/api/support/tickets/${ticketId}/close`);
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: "closed" }
          : ticket
      ));
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#2196F3";
      case "in_progress":
        return "#FFA726";
      case "resolved":
        return "#4CAF50";
      case "closed":
        return "#9E9E9E";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FFA726";
      case "low":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f7f8fc", minHeight: "100vh" }}>
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { xs: "100%", md: "calc(100% - 280px)" },
          ml: { xs: 0, md: "0" }
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#1a1a2e" }}>
            Support Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchTickets}
            sx={{
              bgcolor: "#FF6384",
              '&:hover': { bgcolor: "#FF4D6D" }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {tickets.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Open Tickets
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#2196F3">
                  {tickets.filter(t => t.status === "open").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#FFA726">
                  {tickets.filter(t => t.status === "in_progress").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Resolved
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="#4CAF50">
                  {tickets.filter(t => t.status === "resolved").length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search tickets..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: "300px" }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            }}
          />
          <FormControl size="small" sx={{ minWidth: "150px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: "150px" }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tickets Table */}
        <Card sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress sx={{ color: "#FF6384" }} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Last Update</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTickets
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((ticket) => (
                        <TableRow key={ticket.id} hover>
                          <TableCell>#{ticket.id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.userEmail}</TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.status}
                              size="small"
                              sx={{
                                bgcolor: `${getStatusColor(ticket.status)}20`,
                                color: getStatusColor(ticket.status),
                                fontWeight: "bold"
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              sx={{
                                bgcolor: `${getPriorityColor(ticket.priority)}20`,
                                color: getPriorityColor(ticket.priority),
                                fontWeight: "bold"
                              }}
                            />
                          </TableCell>
                          <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Reply">
                              <IconButton
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setReplyDialogOpen(true);
                                }}
                                disabled={ticket.status === "closed"}
                                size="small"
                              >
                                <ReplyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Close Ticket">
                              <IconButton
                                onClick={() => handleCloseTicket(ticket.id)}
                                disabled={ticket.status === "closed"}
                                size="small"
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTickets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Card>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={() => setReplyDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reply to Ticket #{selectedTicket?.id}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Original Message:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedTicket?.message}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleReply}
              variant="contained"
              disabled={!replyMessage.trim()}
              sx={{
                bgcolor: "#FF6384",
                '&:hover': { bgcolor: "#FF4D6D" }
              }}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AdminSupport; 