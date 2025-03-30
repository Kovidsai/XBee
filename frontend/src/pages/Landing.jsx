import { Link } from "react-router-dom";
import { Container, Typography, Button, Box, Grid } from "@mui/material";

function Landing() {
  return (
    <Container maxWidth="lg">
      <Grid container sx={{ height: "100vh", alignItems: "center" }}>
        {/* Left Section (Branding) */}
        <Grid item xs={12} md={6}>
          <Typography variant="h2" fontWeight="bold" color="primary">
            XB
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "text.secondary" }}>
           Share. Engage. Connect.
          </Typography>
        </Grid>

        {/* Right Section (Login/Register) */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 4,
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Join XBee today.
            </Typography>
            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
                sx={{ fontSize: "1rem", py: 1 }}
              >
                Sign up
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="primary"
                sx={{ fontSize: "1rem", py: 1 }}
              >
                Log in
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Landing;
