"use client";
import { LoginData } from "@/models/auth.interface";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserLogin } from "@/hooks/useUserLogin";
import jwt_decode from "jwt-decode";
import { setCookie } from "cookies-next";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { PhEyeThin } from "@/icons/EyeIcon";

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
    <main className="">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex items-center justify-center h-screen p-5 md:p-20 md:h-auto">
          <div className="flex flex-col items-center justify-center w-full space-y-5 md:w-3/4 h-96">
            <h1 className="text-5xl font-bold text-center">Tizimga kirish</h1>
            <form className="w-full p-5 mt-5 space-y-5 md:p-10">
              <input type="text" className="block w-full p-3 border border-gray-600 rounded-lg" placeholder="Telefon raqam" />
              <div className="relative">
                <input type="password" className="block w-full p-3 border border-gray-600 rounded-lg pr-14" placeholder="Parol" />
                <div className="absolute z-10 -translate-y-1/2 cursor-pointer top-1/2 right-5">
                  <PhEyeThin className="w-7 h-7" />
                </div>
              </div>
              <input type="submit" className="block w-full p-3 text-white bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800" placeholder="Telefon raqam" />
            </form>
          </div>
        </div>
        <div className="items-center justify-center hidden w-full h-screen p-5 md:flex">
          <div className={`bg-[url('../public/slide.jpg')] flex items-end justify-center p-10 pb-40 bg-center bg-cover rounded-3xl min-w-full h-[95vh] relative`}>
            <div className="absolute left-0 top-0 h-[95vh] rounded-3xl w-full bg-gray-900/50"></div>
            <Swiper pagination={true} modules={[Pagination, Autoplay]} className="text-white h-52"
              autoplay={true} loop={true} speed={1500} spaceBetween={30}>
              <SwiperSlide>
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-bold">Lorem ipsum dolor sit amet.</p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-bold">Lorem ipsum dolor sit amet.</p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex items-center justify-center h-full">
                  <p className="text-2xl font-bold">Lorem ipsum dolor sit amet.</p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Login;
