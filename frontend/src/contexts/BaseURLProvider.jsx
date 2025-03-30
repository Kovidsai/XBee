import { createContext, useContext } from "react";

const ApiContext = createContext();

export function BaseURLProvider({ children }) {
  const baseUrl = import.meta.env.VITE_ENV === "local"
    ? import.meta.env.VITE_BASE_URL_LOCAL
    : import.meta.env.VITE_BASE_URL_LAMBDA;

  return (
    <ApiContext.Provider value={{ baseUrl }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useBaseURL() {
  return useContext(ApiContext);
}
