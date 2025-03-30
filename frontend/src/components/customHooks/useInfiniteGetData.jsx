import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

const useInfiniteGetData = (endpoint, queryKey = []) => {
  const { baseUrl } = useBaseURL();

  return useInfiniteQuery({
    queryKey:
      Array.isArray(queryKey) && queryKey.length > 0 ? queryKey : [endpoint],

    queryFn: async ({ pageParam = null }) => {
      const res = await axios.get(`${baseUrl}/${endpoint}`, {
        params: { lastSeen: pageParam, limit: 10 },
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      return res.data;
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage?.data || lastPage.data.length === 0) return undefined; // No more data
      const lastItem = lastPage.data[lastPage.data.length - 1]; // Get last post
      return lastItem.created_at; // Pass last timestamp for next request
    },

    initialPageParam: null, // Start from the latest posts
  });
};

export default useInfiniteGetData;

/**
 * import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

const useInfiniteGetData = (endpoint, queryKey = []) => {
  const { baseUrl } = useBaseURL();

  return useInfiniteQuery({
    queryKey: queryKey.length > 0 ? queryKey : [endpoint],

    queryFn: async ({ pageParam = "" }) => {
      const response = await axios.get(`${baseUrl}/${endpoint}`, {
        params: { lastSeen: pageParam, limit: 5 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage?.data || lastPage.data.length === 0) return undefined;
      return lastPage.data[lastPage.data.length - 1].created_at; // Pass last post's timestamp
    },
  });
};

export default useInfiniteGetData;

 */
