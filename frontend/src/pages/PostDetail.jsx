import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CommentInputBox from "../components/CommentInputBox";
import CommentCard from "../components/CommentCard";
import { useTheme } from "@mui/material";
import useInfiniteGetData from "../components/customHooks/useInfiniteGetData";
import useGetData from "../components/customHooks/useGetData";
import FullPost from "../components/FullPost";
import { useQueryClient } from "@tanstack/react-query";

export default function PostDetail() {
  const { postId } = useParams();
  const theme = useTheme();
  const observerRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingComments,
  } = useInfiniteGetData(`api/allcomments/${postId}`, ["comments", postId]); // Include postId in queryKey for refetching

  const {
    data: post,
    isLoading: isLoadingPost,
    isError,
  } = useGetData(`api/post/${postId}`);


  // Flatten paginated data
  const allComments = commentsData?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  // console.log("Processed Comments:", allComments);
  // console.log("Processed Comments:", commentsData);

  // Infinite Scroll Effect
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Fetching next page...");
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }  // Trigger when the element is fully in view
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);



  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">Error loading post</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ✅ Header Bar */}
      <Box
        width="1200px"
        justifyContent="center"
        py={1.5}
        px={2}
        position="sticky"
        top={0}
        zIndex={1}
        bgcolor={theme.palette.background.paper}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Typography variant="h6" fontWeight="bold">Post</Typography>
      </Box>

      {/* ✅ Post Content */}
      {post ? (
        <Box sx={{ width: "100%" }}>
          <FullPost key={post.id} post={post} />
        </Box>
      ) : (
        !isLoadingPost && (
          <Typography sx={{ mt: 5, textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
            Error loading post
          </Typography>
        )
      )}

      {/* ✅ Comment Input Box */}
      <Box mt={2} p={2} bgcolor={theme.palette.background.paper} borderRadius={2}>
        <CommentInputBox postId={postId} post={post} />
      </Box>

      {/* ✅ Comments Section */}
      <Box mt={2}>
        {allComments.length > 0 ? (
          allComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" textAlign="center">
            No comments yet.
          </Typography>
        )}

        {/* ✅ Loading Spinner */}
        {isLoadingComments && <CircularProgress sx={{ mt: 3 }} />}

        {/* ✅ Infinite Scroll Trigger */}
        <div ref={observerRef} style={{ height: 10, marginTop: 20 }}></div>


        {/* ✅ Fetching More Posts Indicator */}
        {isFetchingNextPage && <Typography>Loading more Comments...</Typography>}
      </Box>
    </Box>
  );
}
