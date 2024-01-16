"use client";
import { LoginData } from "@/models/auth.interface";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserLogin } from "@/hooks/useUserLogin";
import jwt_decode from "jwt-decode";
import { setCookie } from "cookies-next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { PhEyeThin } from "@/icons/EyeIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PhEyeSlash } from "@/icons/EyeSlashIcon";
import { notifyError } from "@/lib/notify";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { register, handleSubmit } = useForm<LoginData>();
  const { data, mutate: login, isSuccess, isError, isLoading } = useUserLogin();
  const [isPasswordShow, setPasswordShow] = useState<boolean>(false);

  const onSubmit: SubmitHandler<LoginData> = (data) => login(data);
  useEffect(() => {
    if (isSuccess) {
      let userData = JSON.stringify(jwt_decode(data.data.accessToken));
      setCookie("user-info", userData);
      setCookie("access-token", data.data.accessToken);
      setCookie("refresh-token", data.data.refreshToken);
      window.location.href = window.location.origin;
    } else if (isError) {
      notifyError("Login yoki parol noto`g`ri");
    } else return;
  }, [isSuccess, isError, data?.data.accessToken, data?.data.refreshToken]);

  const quotes: string[] = [
    "Avtomatlashgan ta'lim tizimi",
    "Bizning tizim orqali dars jadvalini yarating",
    "FaceID orqali davomat qilishni ta'minlash",
  ];
  return (
    <main className="dark:bg-slate-900 dark:text-white">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex h-screen items-center justify-center p-5 md:h-auto md:p-20">
          <div className="flex h-96 w-full flex-col items-center justify-center space-y-5 md:w-3/4">
            <h1 className="text-center text-4xl font-bold">Tizimga kirish</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 w-full space-y-5 p-5 md:p-10"
            >
              <Input
                type="text"
                placeholder="Login"
                {...register("phone", { required: true })}
              />
              <div className="relative">
                <Input
                  type={isPasswordShow ? "text" : "password"}
                  placeholder="Parol"
                  {...register("password", { required: true })}
                />
                <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer">
                  {isPasswordShow ? (
                    <PhEyeSlash
                      onClick={() => setPasswordShow(false)}
                      className="h-6 w-6 text-gray-700"
                    />
                  ) : (
                    <PhEyeThin
                      onClick={() => setPasswordShow(true)}
                      className="h-6 w-6 text-gray-700"
                    />
                  )}
                </div>
              </div>
              {isLoading ? (
                <Button disabled className="w-full select-none">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tekshirilmoqda...
                </Button>
              ) : (
                <Button size={"lg"} className="w-full select-none">
                  Kirish
                </Button>
              )}
            </form>
          </div>
        </div>
        <div className="hidden h-screen w-full items-center justify-center p-5 md:flex">
          <div
            className={`relative flex h-[95vh] min-w-full items-end justify-center rounded-3xl bg-[url('../public/slide.jpg')] bg-cover bg-center p-10 pb-40`}
          >
            <div className="absolute left-0 top-0 h-[95vh] w-full rounded-3xl bg-gray-900/50"></div>
            <Swiper
              pagination={true}
              modules={[Pagination, Autoplay]}
              className="h-52 text-white"
              autoplay={true}
              loop={true}
              speed={1500}
              spaceBetween={30}
            >
              {quotes.map((item, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <div className="flex h-full items-center justify-center">
                      <p className="text-2xl font-bold">{item}</p>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </main>
  );
}
