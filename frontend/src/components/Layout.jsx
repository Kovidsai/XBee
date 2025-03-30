import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useTheme, useMediaQuery, Box } from "@mui/material";

export default function Layout({ darkMode, toggleDarkMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box display="flex" height="100vh" bgcolor={theme.palette.background.default}>
      {/* Sidebar - Fixed Position */}
      <Box
        width="20%"
        p={2}
        bgcolor={theme.palette.background.paper}
        color={theme.palette.text.primary}
        sx={{ position: "fixed", height: "100%", left: 0, borderRight: `1px solid ${theme.palette.divider}` }}
      >
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "20%", mr: "20%", overflowY: "auto", width: "60%", overflowX: "hidden" }}>
        <Outlet /> {/* Renders the current page inside */}
      </Box>

       {/* ✅ Right Sidebar (Hidden on Mobile) */}
       {!isMobile && (
        <Box
          width="20%"
          p={2}
          bgcolor={theme.palette.background.paper}
          color={theme.palette.text.primary}
          sx={{ position: "fixed", height: "100%", right: 0, borderLeft: `1px solid ${theme.palette.divider}` }}
        >
          {/* Future Widgets/Trends */}
        </Box>
      )}
    </Box>
  );
}
