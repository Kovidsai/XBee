import { useState } from "react";
import { usePostData } from "./customHooks/usePostData";
import { Avatar, TextField, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useAddComment from "./customHooks/useAddComment";

export default function CommentInputBox({ postId, user}) {
  const [comment, setComment] = useState("");


  const { mutate } = usePostData(`api/${postId}/comment`);
  // const { mutate } = useAddComment();

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  function handleCommentSubmission(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    mutate({postId, content: comment });
    window.location.reload();
    setComment("");
     // Clear input after posting
  }

  return (
    <Box display="flex" alignItems="center" gap={2} width="60%">
      {/* Profile Picture */}
      <Avatar src={user?.profilePic} alt={user?.name} sx={{ width: 40, height: 40 }} />

      {/* Comment Input */}
      <TextField
        fullWidth
        placeholder="Post your reply"
        variant="outlined"
        size="small"
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={(e) => e.key === "Enter" && handleCommentSubmission(e)}
        sx={{ borderRadius: "20px", "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
      />

      {/* Post Button */}
      <IconButton onClick={handleCommentSubmission} color="primary" disabled={!comment.trim()}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
