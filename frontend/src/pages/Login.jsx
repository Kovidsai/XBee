import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseURL } from "../contexts/BaseURLProvider";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const {baseUrl} = useBaseURL();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const {mutate, error} = useMutation({
    mutationFn: async(credentials) => {
      const response = await axios.post(`${baseUrl}/auth/login`, credentials);
      return response.data;
    }, 
    onSuccess: (data) => {
      // sessionStorage.setItem("token", data.token); // Store JWT token
      alert("Login successful!");
      login(data.token);
      navigate("/dashboard"); // Redirect to dashboard
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(credentials);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none", color: "#1976D2" }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
