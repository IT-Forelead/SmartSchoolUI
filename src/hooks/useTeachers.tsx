import { Teacher } from "@/app/teachers/page";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* APIs */
const getTeachersList = async () => {
  return await axios.get<Teacher[]>("/teacher");
};

const editTeacher = async (data: Teacher) => {
  return await axios.post<any>("/teacher/update", data);
};

/* Hooks */
export const useTeachersList = () => {
  return useQuery(['teachers'], () => getTeachersList());
};

export const useEditTeacher = () => {
  return useMutation((data: Teacher) => editTeacher(data), {});
};
