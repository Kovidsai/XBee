import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

export const usePutData = (endpoint, onSuccess = () => {}) => {
  const {baseUrl} = useBaseURL();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`${baseUrl}/${endpoint}`, data, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      return response.data;
    },
    onSuccess,
  });
};
