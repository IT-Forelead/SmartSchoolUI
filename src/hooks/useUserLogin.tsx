import { AuthTokens, LoginData } from "@/models/auth.interface";
import axios from "@/services/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const postUserData = async (data: LoginData) => {
  return await axios.post<AuthTokens>("/auth/login", data);
};

/* Mutations */
export const useUserLogin = () => {
  // return useMutation((data: LoginData) => postUserData(data), {});
  return useMutation({
    mutationFn: (data: LoginData) => postUserData(data),
    onError: (err: AxiosError) => err,
  });
};
