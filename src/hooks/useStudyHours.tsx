import { LessonHour, StudyHours } from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* APIs */
const getStudyHoursList = async () => {
  return await axios.get<StudyHours[]>("/study-hour");
};

const changeTeacherLessonHour = async (data: LessonHour) => {
  return await axios.patch<any>("/study-hour", data);
};

/* Hooks */
export const useStudyHoursList = () => {
  return useQuery({
    queryKey: ['studyHours'],
    queryFn: () => getStudyHoursList(),
    onError: (err: AxiosError) => err
  })
};

export const useChangeTeacherLessonHour = () => {
  // return useMutation((data: LessonHour) => changeTeacherLessonHour(data), {});
  return useMutation({
    mutationFn: (data: LessonHour) => changeTeacherLessonHour(data),
    onError: (err: AxiosError) => err
  })
};