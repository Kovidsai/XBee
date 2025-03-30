import React from "react";
import { Card, CardContent, Avatar, Typography, Stack } from "@mui/material";

const CommentCard = ({ comment }) => {
  return (
    <Card sx={{ maxWidth: 600, mb: 2, p: 1, borderRadius: 2, boxShadow: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "flex-start" }}>
        <Avatar src={comment.profile_pic} alt={comment.author} sx={{ mr: 2 }} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight="bold">{comment.author}</Typography>
            <Typography variant="caption" color="text.secondary">
              • {new Date(comment.created_at).toLocaleDateString()}
            </Typography>
          </Stack>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }} // Fixes text overflow
          >
            {comment.content}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
