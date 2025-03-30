import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

export const useDeleteData = (endpoint, onSuccess = () => {}) => {
  const {baseUrl} = useBaseURL();
  return useMutation({
    mutationFn: async () => {
      await axios.delete(`${baseUrl}/${endpoint}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
    },
    onSuccess, // Allows dynamic success handling
  });
};
