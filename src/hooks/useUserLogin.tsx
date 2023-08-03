import { useMutation } from "@tanstack/react-query";
import { AuthTokens, LoginData } from "@/models/auth.interface";
import axios from "@/services/axios";

const postUserData = async (data: LoginData) => {
  return await axios.post<AuthTokens>("/auth/login", data);
};

export const useUserLogin = () => {
  return useMutation((data: LoginData) => postUserData(data), {});
};
