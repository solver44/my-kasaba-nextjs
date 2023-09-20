import TOKENS from "@/utils/config";
import { readJSONFile } from "@/utils/jsonUtils";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
export const $axios = axios.create({
  baseURL: "http://test.kasaba.uz:8000/",
  ...config,
});

export const $publicAxios = axios.create({
  baseURL: "/api",
});

// Interceptor to handle 401 errors and refresh the token
$axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      (error.response?.data?.error === "invalid_token" ||
        error.response.status === 401)
    ) {
      try {
        if (!TOKENS.renew) {
          // Clear access token and refresh token
          TOKENS.ACCESS_TOKEN = "";
          TOKENS.REFRESH_TOKEN = "";
          // Refresh the token
          const result = await axios.get("/api/refreshToken"); // Use $axios to make the request
          const tokens = result?.data;
          if (!tokens) return Promise.reject(error);
          const accessToken = tokens?.access_token;
          TOKENS.ACCESS_TOKEN = accessToken;
          TOKENS.REFRESH_TOKEN = tokens?.refresh_token;
          TOKENS.renew = true;
        }

        // Update the original request headers with the new access token
        error.config.headers.Authorization = `Bearer ${TOKENS.ACCESS_TOKEN}`;

        // Retry the original request with the updated token
        return $axios.request(error.config); // Use $axios to make the request
      } catch (refreshError) {
        throw refreshError;
      }
    }

    // If the error is not a 401, pass it along
    return Promise.reject(error);
  }
);

$axios.interceptors.request.use(async (config) => {
  let token = "";
  if (typeof window === "undefined") {
    // Running on the server-side (SSR)
    token = (await readJSONFile())?.accessToken;
  } else {
    // Running on the client-side (browser)
    token = TOKENS.ACCESS_TOKEN;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
