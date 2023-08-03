import { AuthTokens } from "@/models/auth.interface";
import axios, { AxiosHeaderValue, HeadersDefaults } from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

axios.defaults.baseURL = process.env.API_URI;

type Headers = {
  "Content-Type": string;
  Authorization: string;
} & { [key: string]: AxiosHeaderValue };

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
});

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
} as Headers & HeadersDefaults;

axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie("access-token");
    if (token) {
      // Configure this as per your backend requirements
      config.headers!["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axiosClient.get<AuthTokens>("/auth/refresh", {
            headers: {
              Authorization: `Bearer ${getCookie("refresh-token")!}`,
            },
          });

          setCookie("access-token", rs.data.accessToken);
          setCookie("refresh-token", rs.data.refreshToken);

          return axiosClient(originalConfig);
        } catch (_error) {
          alert("Your session has been expired!");
          // Logging out the user by removing all the tokens from local
          deleteCookie("access-token");
          deleteCookie("refresh-token");
          deleteCookie("user-info");
          // Redirecting the user to the landing page
          window.location.href = window.location.origin;
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
