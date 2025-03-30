import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button } from "@mui/material";
import { useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  // Load dark mode preference from sessionStorage
  const [darkMode, setDarkMode] = useState(() => {
    return sessionStorage.getItem("darkMode") === "true";
  });

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      sessionStorage.setItem("darkMode", !prevMode);
      return !prevMode;
    });
  };

  // Create a theme based on dark mode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Applies dark/light mode styles globally */}
        <Router>
          <Button
            onClick={toggleDarkMode}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </Button>
          <AppRoutes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
