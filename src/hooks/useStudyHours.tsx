import { StudyHours } from "@/app/dashboard/studyhours/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getStudyHoursList = async () => {
  return await axios.get<StudyHours[]>("/study-hour");
};

export const useStudyHoursList = () => {
  return useQuery(['studyHours'], () => getStudyHoursList());
};

