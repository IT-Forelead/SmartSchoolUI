import { LessonBody, LessonCreate } from "@/models/common.interface";
import { LessonBodyData } from "@/models/user.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
/* APIs */
const getTimeTable = async () => {
  return await axios.get<any>("/timetable/fetch");
};

export const rebuildTimetable = async () => {
  return await axios.get<any>("/timetable");
};

export const targetLesson = async (data: LessonCreate) => {
  return await axios.post<any>("/timetable", data);
};

export const lessonForSwap = async (data: LessonBody) => {
  return await axios.post<any>("/timetable/available/lesson", data);
};

export const switchTwoLessonOrder = async (data: LessonBodyData) => {
  return await axios.patch<any>("/timetable", data);
};

export const getTimetableHistory = async () => {
  return await axios.get<LessonBody[]>("/timetable/available/lesson");
};

export const deleteTimetableHistory = async (data: LessonBody) => {
  return await axios.patch<any>("/timetable/available/lesson", data);
};

/* Hooks */
export const useTimeTable = () => {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: () => getTimeTable(),
    onError: (err: AxiosError) => err,
  });
};

export const useTimeTableHistory = () => {
  return useQuery({
    queryKey: ["timetableHistory"],
    queryFn: () => getTimetableHistory(),
    onError: (err: AxiosError) => err,
  });
};

/* Mutations */
export const useTargetLesson = () => {
  return useMutation({
    mutationFn: (body: LessonCreate) => targetLesson(body),
    onError: (err: AxiosError) => err,
  });
};

export const useSwitchTwoLessonOrder = () => {
  return useMutation({
    mutationFn: (body: LessonBodyData) => switchTwoLessonOrder(body),
    onError: (err: AxiosError) => err,
  });
};

export const useDeleteTimeTableHistory = () => {
  return useMutation({
    mutationFn: (body: LessonBody) => deleteTimetableHistory(body),
    onError: (err: AxiosError) => err,
  });
};
