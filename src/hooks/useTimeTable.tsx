import { LessonBody } from "@/models/common.interface";
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

export const targetLesson = async (data: LessonBody) => {
  return await axios.post<any>("/timetable", data);
};

export const lessonForSwap = async (data: LessonBody) => {
  return await axios.post<any>("/timetable/available/lesson", data);
};

/* Hooks */
export const useTimeTable = () => {
  return useQuery({
    queryKey: ['timetable'],
    queryFn: () => getTimeTable(),
    onError: (err: AxiosError) => err
  })
};

/* Mutations */
export const useTargetLesson = () => {
  // return useMutation((body: TargetLessonBody) => targetLesson(body), {});
  return useMutation({
    mutationFn: (body: LessonBody) => targetLesson(body),
    onError: (err: AxiosError) => err
  })
};