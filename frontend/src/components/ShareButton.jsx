import { useState } from "react";
import { IconButton, Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function ShareButton({ postId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleCopyLink = () => {
    const postLink = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postLink)
      .then(() => setSnackbarOpen(true)) // Show Snackbar when copied
      .catch((error) => console.error("Failed to copy:", error));

    handleCloseMenu(); // Close the menu after copying
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <ShareIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={handleCopyLink}>
          <ContentCopyIcon fontSize="small" style={{ marginRight: 8 }} />
          Copy Link
        </MenuItem>
      </Menu>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Disappears after 3 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Bottom position
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Link copied!
        </Alert>
      </Snackbar>
    </>
  );
}

