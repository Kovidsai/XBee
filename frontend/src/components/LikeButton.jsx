import { useState } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { usePostData } from "./customHooks/usePostData";
import { useDeleteData } from "./customHooks/useDeleteData";

export default function LikeButton({ post, initialLiked, initialLikesCount }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  
  const { mutate: likePost } = usePostData(`api/like/${post.id}`);
  const { mutate: unlikePost } = useDeleteData(`api/unlike/${post.id}`);
  
  async function toggleLike() {
    try {
      if (!liked) {
        likePost(); // Call the mutation function
        post.liked = true;
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        unlikePost(); // Call the mutation function
        setLiked(false);
        post.liked = false;
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={toggleLike} color={liked ? "error" : "default"}>
        {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
      <Typography variant="body2">{likesCount}</Typography>
    </Box>
  );
}
