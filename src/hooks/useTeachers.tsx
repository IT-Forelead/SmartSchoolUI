import { Teacher } from "@/app/dashboard/teachers/page";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* APIs */
const getTeachersList = async () => {
  return await axios.post<Teacher[]>("/teacher/fetch", {});
};

const getTeacherProfile = async (teacherId: string) => {
  return await axios.post<Teacher[]>("/teacher/fetch", {
    "id": teacherId
  });
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

export const useTeacherProfile = (tId: string) => {
  return useQuery(['teacher'], () => getTeacherProfile(tId));
}
