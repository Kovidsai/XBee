import {
    Avatar,
    Box,
    Typography,
    IconButton,
    Stack,
    Card,
  } from "@mui/material";
  import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
  import LikeButton from "./LikeButton";
  import ShareButton from "./ShareButton";
  
  export default function FullPost({ post }) {
    console.log("Post Data in FullPost:", post);

    return (
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 2,
          gap: 2,
          width: "100%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 2,
        }}
      >
        {/* ✅ Profile Picture */}
        <Avatar
          src={post.profile_pic}
          alt={post.author}
          sx={{ width: 50, height: 50 }}
        />
  
        {/* ✅ Post Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Username & Timestamp */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight="bold">{post.author}</Typography>
            <Typography variant="caption" color="text.secondary">
              • {new Date(post.created_at).toLocaleDateString()}
            </Typography>
          </Stack>
          {/* Post Text */}
          <Typography
            sx={{
              mt: 1,
              fontSize: 15,
              wordBreak: "break-word", whiteSpace: "pre-wrap",
            }}
          >
            {post.content}
          </Typography>
          {/* Post Image (if available) */}
          {post.image_url && (
            <Box
              component="img"
              src={post.image_url}
              sx={{
                width: "100%",
                borderRadius: 2,
                mt: 1,
              }}
            />
          )}
          {/* ✅ Action Buttons */}
          <Stack direction="row" spacing={4} mt={1}>
            <LikeButton
              post={post}
              initialLikesCount={post.likes_count}
              initialLiked={post.liked}
            />
            <Box display="flex" alignItems="center">
              <IconButton  size="small">
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
                <Typography variant="body2"> {post.comments_count}</Typography>
            </Box>
            <ShareButton postId={post.id} />
          </Stack>
        </Box>
      </Card>
    );
  }
  