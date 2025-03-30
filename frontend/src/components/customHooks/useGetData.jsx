import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useBaseURL } from "../../contexts/BaseURLProvider";

const useGetData = (endpoint, queryKey = [], onSuccess) => {
  const {baseUrl} = useBaseURL();
  return useQuery({
    queryKey:
      Array.isArray(queryKey) && queryKey.length > 0 ? queryKey : [endpoint],
    queryFn: () => axios.get(`${baseUrl}/${endpoint}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      }).then((res) => res.data.data),
    onSuccess,
  });
};

export default useGetData;
