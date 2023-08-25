import { Teacher, TeacherDegree, TeacherUpdate } from "@/app/dashboard/teachers/page";
import { Approve, TeacherLinkInfo } from "@/app/link/[link]/page";
import { TeacherPositionUpdate } from "@/components/client/profile/TakeLesson";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

/* APIs */
const getTeachersList = async () => {
  return await axios.post<Teacher[]>("/teacher/fetch", {});
};

const getTeacherDegreesList = async () => {
  return await axios.get<TeacherDegree[]>("/teacher/degrees");
};

const approveTeacherDoc = async (data: Approve) => {
  return await axios.get<any>(`/teacher/approve/degree/${data.link}?approved=${data.approved}`);
};

const getTeacherProfile = async (teacherId: string) => {
  return await axios.post<Teacher[]>("/teacher/fetch", {
    "id": teacherId
  });
};

const editTeacher = async (data: TeacherUpdate) => {
  return await axios.post<any>("/teacher/update", data);
};

const addTeacherPosition = async (data: TeacherPositionUpdate) => {
  return await axios.post<any>("/teacher/document", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getTeacherDocumentInfo = async (link: string) => {
  return await axios.get<TeacherLinkInfo>(`/teacher/document/${link}`);
};

/* Hooks */
export const useDegreesList = () => {
  return useQuery(['degrees'], () => getTeacherDegreesList());
};

export const useTeachersList = () => {
  return useQuery(['teachers'], () => getTeachersList());
};

export const useEditTeacher = () => {
  return useMutation((data: TeacherUpdate) => editTeacher(data), {});
};

export const useAddTeacherPosition = () => {
  return useMutation((data: TeacherPositionUpdate) => addTeacherPosition(data), {});
};

export const useTeacherProfile = (tId: string) => {
  return useQuery(['teacher'], () => getTeacherProfile(tId));
}

export const useTeacherLinkInfo = (link: string) => {
  return useQuery(['teacherLinkInfo'], () => getTeacherDocumentInfo(link));
}

export const useTeacherLinkApprove = () => {
  return useMutation((data: Approve) => approveTeacherDoc(data));
}
