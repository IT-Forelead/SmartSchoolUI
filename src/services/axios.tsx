import { refreshToken } from "@/lib/refresh.token";
import axios, { AxiosHeaderValue, HeadersDefaults } from "axios";
import { getCookie } from "cookies-next";

type Headers = {
  "Content-Type": string;
  Authorization: string;
} & { [key: string]: AxiosHeaderValue };

export const publicAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
});

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
    const config = err.config;

    if (config.url !== "/auth/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 403 && !config?.sent) {
        config.sent = true;

        const result = await refreshToken()
        if (result?.accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${result?.accessToken}`,
          }
        }
        let res = await axios(config)
        return res?.data
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
