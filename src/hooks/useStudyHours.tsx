import { StudyHours } from "@/app/dashboard/studyhours/page";
import { LessonHour } from "@/components/client/studyhours/ChangeLessonHour";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* APIs */
const getStudyHoursList = async () => {
  return await axios.get<StudyHours[]>("/study-hour");
};

const changeTeacherLessonHour = async (data: LessonHour) => {
  return await axios.patch<any>("/study-hour", data);
};

/* Hooks */
export const useStudyHoursList = () => {
  return useQuery(['studyHours'], () => getStudyHoursList());
};

export const useChangeTeacherLessonHour = () => {
  return useMutation((data: LessonHour) => changeTeacherLessonHour(data), {});
};