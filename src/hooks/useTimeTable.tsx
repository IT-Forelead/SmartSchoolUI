import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getTimeTable = async () => {
  return await axios.get<any>("/timetable/fetch");
};
export const rebuildTimetable = async () => {
  return await axios.get<any>("/timetable");
};

export const useTimeTable = () => {
  return useQuery(['timetable'], () => getTimeTable());
};


export const useRebuildTimetable = () => {
  return useQuery(['rebuildTimeTable'], () => rebuildTimeTable());
};

