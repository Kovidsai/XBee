import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles"; // Import Theme Hook
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function Sidebar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme(); // Get current theme

  const openModal = () => {
    console.log("New Post modal opening..."); // Debugging log
    navigate("/new-post", { state: { background: location } }); // Pass background state
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      p={2}
      bgcolor={theme.palette.background.paper} // Adapts to dark mode
      color={theme.palette.text.primary} // Adapts text color
    >
      {/* App Title */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        XBee
      </Typography>
      {/* Navigation Links */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <HomeIcon sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/profile")}>
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        {/* Use openModal to navigate correctly */}
        <ListItem disablePadding>
          <ListItemButton onClick={openModal}>
            <ListItemIcon>
              <AddCircleOutlineIcon sx={{ color: theme.palette.text.primary }} />
            </ListItemIcon>
            <ListItemText primary="Add Post" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Dark Mode Toggle */}
      <ListItem disablePadding>
        <ListItemButton onClick={toggleDarkMode}>
          <ListItemIcon>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
          <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ my: 2, bgcolor: theme.palette.divider }} />{" "}
      {/* Adapt divider color */}
      {/* Logout Button */}
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        startIcon={<ExitToAppIcon />}
        onClick={() => {
          sessionStorage.removeItem("token");
          window.location.href = "/login";
        }}
        sx={{
          color: theme.palette.text.primary, // Ensure text is visible
          borderColor: theme.palette.divider, // Ensure border adapts to theme
          "&:hover": {
            backgroundColor: theme.palette.action.hover, // Adapt hover effect
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
