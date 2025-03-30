import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePutData } from "../components/customHooks/usePutData";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  Paper,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditProfile() {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get passed userData from Profile page
  const theme = useTheme(); // Get theme for dark/light mode
  const [username, setUsername] = useState(state?.user?.name || "");
  const [bio, setBio] = useState(state?.user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(state?.user?.profile_pic);
  const [isUploading, setIsUploading] = useState(false);

  const onSuccess = () => navigate("/profile");
  const { mutate: updateProfile, error } = usePutData("api/update-profile", onSuccess);

  // Allowed Image Types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.");
      return;
    }

    setProfilePic(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove Image & Reset File Input
  const handleRemoveImage = () => {
    setPreview(null);
    setProfilePic(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleSubmit = async () => {
    console.log("started");
    const formData = new FormData();
    formData.append("name", username);
    formData.append("bio", bio);
    if (profilePic) {
        formData.append("image", profilePic);
    }
    
    try {
      updateProfile(formData);
      console.log(error);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 4,
        p: 3,
        borderRadius: 3,
        bgcolor: theme.palette.background.paper, // Dark/Light mode support
      }}
    >
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
        Edit Profile
      </Typography>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <label htmlFor="upload-photo">
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-photo"
            type="file"
            onChange={handleImageUpload}
          />
          <Avatar
            src={preview || "/default-avatar.png"}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              cursor: "pointer",
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<PhotoCamera />}
            sx={{ textTransform: "none" }}
          >
            Change Profile Picture
          </Button>
        </label>
      </Box>

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ my: 2 }}
      />

      <TextField
        fullWidth
        label="Bio"
        variant="outlined"
        multiline
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button
        onClick={handleSubmit}
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>
    </Paper>
  );
}
