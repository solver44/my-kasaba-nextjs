import TOKENS from "@/utils/config";
import { readJSONFile } from "@/utils/jsonUtils";
import axios from "axios";
export const BASE_URL = "https://kiat.kasaba.uz";
import * as https from "https";
// export const BASE_URL = "http://localhost:8000";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  httpsAgent,
};

export function getDeleteResponse(data) {
  return data.status === 204 ? true : false;
}
export const $axios = axios.create({
  baseURL: BASE_URL,
  ...config,
});

export const $publicAxios = axios.create({
  baseURL: "/api",
  httpsAgent,
});

// Interceptor to handle 401 errors and refresh the token
$axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error?.response &&
      (error.response?.data?.error === "invalid_token" ||
        error.response.status === 401 ||
        (error.response.status === 500 &&
          error.response.data.path === "/rest/services/application/login"))
    ) {
      try {
        if (!TOKENS.renew) {
          // Clear access token and refresh token
          TOKENS.ACCESS_TOKEN = "";
          TOKENS.REFRESH_TOKEN = "";
          // Refresh the token
          try {
            var result = await axios.get("/api/refreshToken"); // Use $axios to make the request
          } catch (error) {
            console.log(error);
          }
          const tokens = result?.data;
          if (!tokens) return Promise.reject(error);
          const accessToken = tokens?.access_token;
          TOKENS.ACCESS_TOKEN = accessToken;
          TOKENS.REFRESH_TOKEN = tokens?.refresh_token;
          TOKENS.renew = true;
        }

        // Update the original request headers with the new access token
        error.config.headers.Authorization = `Bearer ${TOKENS.ACCESS_TOKEN}`;

        if (window?.location?.pathname === "/auth")
          return $axios.request(error.config); // Use $axios to make the request

        window.clearTimeout(globalThis.relTimeout);
        // globalThis.relTimeout = window.setTimeout(() => {
        //   window.location.reload();
        // }, 500);
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
  try {
    if (typeof window === "undefined") {
      // Running on the server-side (SSR)
      token = (await readJSONFile())?.accessToken;
    } else {
      // Running on the client-side (browser)
      token = TOKENS.ACCESS_TOKEN;
    }
  } catch (error) {}
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
