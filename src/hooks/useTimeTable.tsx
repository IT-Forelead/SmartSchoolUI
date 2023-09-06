import { TargetLessonBody } from "@/components/client/timetable/TargetLesson";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
/* APIs */
const getTimeTable = async () => {
  return await axios.get<any>("/timetable/fetch");
};

export const rebuildTimetable = async () => {
  return await axios.get<any>("/timetable");
};

export const targetLesson = async (data: TargetLessonBody) => {
  return await axios.post<any>("/timetable", data);
};

/* Hooks */
export const useTimeTable = () => {
  return useQuery(['timetable'], () => getTimeTable());
};

export const useTargetLesson = () => {
  return useMutation((body: TargetLessonBody) => targetLesson(body), {});
};