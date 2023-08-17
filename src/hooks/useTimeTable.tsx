import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getTimeTable = async () => {
  return await axios.get<any>("/timetable");
};

export const useTimeTable = () => {
  return useQuery(['timetable'], () => getTimeTable());
};

