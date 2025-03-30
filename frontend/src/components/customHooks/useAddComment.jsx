import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

const useAddComment = (postId, onSuccess = () => {}) => {
  const { baseUrl } = useBaseURL();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment) => {
      const response = await axios.post(
        `${baseUrl}/api/comment/${postId}`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: (newComment) => {
      // Update comments list in cache
      queryClient.setQueryData(["comments", postId], (oldData) => {
        if (!oldData) return { pages: [[newComment]], hasMore: true }; 
        return {
          ...oldData,
          pages: [
            [{ ...newComment }, ...oldData.pages[0]], // Add new comment at the start
            ...oldData.pages.slice(1),
          ],
        };
      });

      // Update comment count in posts cache
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.data.map((post) =>
              post.id === postId ? { ...post, comments_count: post.comments_count + 1 } : post
            )
          ),
        };
      });

      onSuccess(); // Execute additional callback if needed
    },
  });
};

export default useAddComment;
