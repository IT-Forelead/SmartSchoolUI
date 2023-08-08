import { AuthTokens, LoginData } from "@/models/auth.interface";
import axios from "@/services/axios";
import { useMutation } from "@tanstack/react-query";

const postUserData = async (data: LoginData) => {
  return await axios.post<AuthTokens>("/auth/login", data);
};

export const useUserLogin = () => {
  return useMutation((data: LoginData) => postUserData(data), {});
};
