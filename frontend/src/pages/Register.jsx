import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { useBaseURL } from "../contexts/BaseURLProvider";
import { useMutation } from "@tanstack/react-query";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const {baseUrl} = useBaseURL();
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };


  const {mutate, error} = useMutation({
    mutationFn: async(user) => {
      const response = await axios.post(`${baseUrl}/auth/register`, user);
      return response.data;
    },
    onSuccess:() => {
      alert("Registration successfull");
      navigate("/login");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(user);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976D2" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
