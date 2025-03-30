import { useEffect, useRef } from "react";
import { useTheme } from "@mui/material";
import XCard from "../components/XCard";
import useInfiniteGetData from "../components/customHooks/useInfiniteGetData";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";

export default function Dashboard() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteGetData("api/posts", ["posts"]);

  const observerRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      // { threshold: 1.0 }
      { rootMargin: "200px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];
  console.log("Processed Posts:", posts);

  return (
    <Box id="dashboard-container">
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
        <Typography
          variant="h6"
          fontWeight="bold"
          onClick={() => {
            document.getElementById("dashboard-container")?.scrollTo({ top: 10, behavior: "smooth" });
          } }
          sx={{ cursor: "pointer" }}
        >
          Home
        </Typography>
      </Box>

      {/* ✅ Posts Stack (Responsive) */}
      {posts.length > 0 ? (
        <Stack spacing={2} sx={{ width: "100%", maxWidth: "600px" }}>
          {" "}
          {/* ✅ Max width for better readability */}
          {posts.map((post) => (
            <Box sx={{ width: "100%" }}>
              <XCard key={post.id} post={post} />
            </Box>
          ))}
        </Stack>
      ) : (
        !isLoading && (
          <Typography
            sx={{
              mt: 5,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            No posts available.
          </Typography>
        )
      )}

      {/* ✅ Loading Spinner */}
      {isLoading && <CircularProgress sx={{ mt: 3 }} />}

      {/* ✅ Infinite Scroll Trigger */}
      <div ref={observerRef} style={{ height: 10, marginTop: 20 }}></div>

      {/* ✅ Fetching More Posts Indicator */}
      {isFetchingNextPage && <Typography>Loading more posts...</Typography>}
    </Box>
  );
}
