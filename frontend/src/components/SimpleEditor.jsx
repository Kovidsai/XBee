import { useState, useRef } from "react";
import {useNavigate} from "react-router-dom";
import { Box, TextField, Paper, IconButton, Button, CircularProgress, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePostData } from "../components/customHooks/usePostData";



export default function SimpleEditor() {
  const [inputText, setInputText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { mutate: uploadPost, isPending: isPostPending, error: postError } = usePostData("api/uploadpost", () => {
    // alert("Post Uploaded SuccessFully");
    setInputText("");
    setPreviewImage(null);
    setSelectedFile(null);
    navigate("/dashboard");
  });

  // Allowed Image Types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, GIF, and WEBP files are allowed.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove Image & Reset File Input
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Submit Post
  const handleSubmit = async () => {
    if (!inputText.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("content", inputText);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await uploadPost(formData);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", borderRadius: 2, mt: 5 }} elevation={3}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label="What's happening?"
        variant="outlined"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        sx={{ mb: 2 }}
      />

      {previewImage && (
        <Box sx={{ position: "relative", mt: 2, textAlign: "center" }}>
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", maxHeight: 300, borderRadius: 8 }}
          />
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
            }}
            onClick={handleRemoveImage}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <IconButton component="label" sx={{ bgcolor: "#f0f0f0", p: 0.6, borderRadius: 2 }}>
          <ImageIcon fontSize="medium" color="primary" />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </IconButton>

        <Box sx={{ display: "flex" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isUploading || isPostPending}
          >
            {isUploading || isPostPending ? <CircularProgress size={24} color="inherit" /> : "Post"}
          </Button>
        </Box>
      </Box>

      {postError && <Typography color="error" mt={2}>Error posting content</Typography>}
    </Paper>
  );
}
