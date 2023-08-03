"use client";
import { LoginData } from "@/models/auth.interface";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserLogin } from "@/hooks/useUserLogin";
import jwt_decode from "jwt-decode";
import { setCookie } from "cookies-next";

function Login() {
  const { register, handleSubmit } = useForm<LoginData>();
  const { data, mutate: login, isSuccess, isError } = useUserLogin();

  const onSubmit: SubmitHandler<LoginData> = (data) => login(data);
  useEffect(() => {
    if (isSuccess) {
      let userData = JSON.stringify(jwt_decode(data.data.accessToken));
      setCookie("user-info", userData);
      setCookie("access-token", data.data.accessToken);
      setCookie("refresh-token", data.data.refreshToken);
      window.location.href = window.location.origin;
    } else if (isError) {
      alert("Login failed");
    } else return;
  }, [isSuccess, isError]);
  return (
    <main className="flex items-center h-screen overflow-hidden bg-[#0D1117]">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="-mx-4 z-[2] mt-10 flex-auto bg-[#161B22] px-4 py-10 shadow-2xl shadow-gray-500/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24 rounded-xl"
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-base font-semibold text-[#e6edf3]"
              >
                Login
              </label>
              <input
                type="text"
                id="login"
                {...register("login", { required: true })}
                className="border appearance-none text-sm rounded-lg block w-full p-2.5  bg-[#0D1117] border-[#30363D] placeholder-gray-400 text-white focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your emial"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-semibold text-[#e6edf3]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: true })}
                className="border appearance-none text-sm rounded-lg block w-full p-2.5  bg-[#0D1117] border-[#30363D] placeholder-gray-400 text-white focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            className="inline-flex justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-600 text-white hover:bg-blue-800 mt-8 w-full cursor-pointer"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
export default Login;
