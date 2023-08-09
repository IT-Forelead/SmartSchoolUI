import { Teacher } from "@/app/teachers/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getTeachersList = async () => {
  return await axios.get<Teacher[]>("/teacher");
};

export const useTeachersList = () => {
  return useQuery(['teachers'], () => getTeachersList());
};

