import {
  AbsentLessonBody,
  Approve,
  ApproveAsAdmin,
  Subject,
  Substitution,
  Teacher,
  TeacherDegree,
  TeacherPositionUpdate,
  TeacherUpdate,
  TeacherWorkloadChange,
  WorkloadFormula,
  WorkloadHistory,
  AddQrCode,
  Stats,
  TeacherCreate,
} from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type AddSubjects = {
  teacherId: string;
  subjectIds: string[];
};

/* APIs */
const getTeachersList = async () => {
  return await axios.post<Teacher[]>("/teacher/fetch", {});
};

const createTeacher = async (data: TeacherCreate) => {
  return await axios.post<Teacher[]>(`/teacher`, data);
};

const getTeacherStats = async () => {
  return await axios.get<Stats>("/teacher/stats");
};

const getTeachersSubstitutionList = async () => {
  return await axios.get<Substitution[]>("/teacher/substitution/lesson");
};

const getTeachersNotCheckedList = async () => {
  return await axios.post<Teacher[]>("/teacher/fetch", {
    notCheckedDocument: true,
  });
};

const getTeacherDegreesList = async () => {
  return await axios.get<TeacherDegree[]>("/teacher/degrees");
};

const getWorkloadHistoryList = async () => {
  return await axios.get<WorkloadHistory[]>("/teacher/change/workload/history");
};

export const approveTeacherDoc = async (data: Approve) => {
  return await axios.get<any>(
    `/teacher/approve/degree/${data.link}?approved=${data.approved}`,
  );
};

export const approveAbsentTeacherLesson = async (data: Approve) => {
  return await axios.get<any>(
    `/teacher/confirm/lesson/${data.link}?approved=${data.approved}`,
  );
};

export const addSubjectToTeacherFunc = async (data: AddSubjects) => {
  return await axios.post<any>(`/teacher/add/subject`, data);
};

export const addQrCodeToTeacher = async (data: AddQrCode) => {
  return await axios.post<any>("/student/add-qrcode", data);
};

export const approveTeacherDocAsAdmin = async (data: ApproveAsAdmin) => {
  return await axios.post<any>(`/teacher/approve/degree`, data);
};

const getTeacherProfile = async (teacherId: string) => {
  return await axios.post<Teacher[]>("/teacher/fetch", {
    id: teacherId,
  });
};

const editTeacher = async (data: TeacherUpdate) => {
  return await axios.post<any>("/teacher/update", data);
};

const addTeacherPosition = async (data: TeacherPositionUpdate) => {
  return await axios.post<any>("/teacher/document", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const changeTeacherWorkload = async (data: TeacherWorkloadChange) => {
  return await axios.post<any>("/teacher/change/workload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const changeTeacherLesson = async (data: AbsentLessonBody) => {
  return await axios.post<any>("/teacher/substitution/lesson", data);
};

const updateTeacherPosition = async (data: TeacherPositionUpdate) => {
  return await axios.post<any>("/teacher/update/document", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getTeacherDocumentInfo = async (link: string) => {
  return await axios.get<Teacher>(`/teacher/document/${link}`);
};

const getTeacherWorkloadInfo = async () => {
  return await axios.get<WorkloadFormula[]>("/teacher/workload-info");
};

/* Hooks */
export const useDegreesList = () => {
  return useQuery({
    queryKey: ["degrees"],
    queryFn: () => getTeacherDegreesList(),
    onError: (err: AxiosError) => err,
  });
};

export const useSubstitutionList = () => {
  return useQuery({
    queryKey: ["substitution"],
    queryFn: () => getTeachersSubstitutionList(),
    onError: (err: AxiosError) => err,
  });
};

export const useTeachersList = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => getTeachersList(),
    onError: (err: AxiosError) => err,
  });
};

export const useTeacherStats = () => {
  return useQuery({
    queryKey: ["teacherStats"],
    queryFn: () => getTeacherStats(),
    onError: (err: AxiosError) => err,
  });
};

export const useTeachersNotCheckedDocList = () => {
  return useQuery({
    queryKey: ["teachersDoc"],
    queryFn: () => getTeachersNotCheckedList(),
    onError: (err: AxiosError) => err,
  });
};

export const useTeacherProfile = (tId: string) => {
  return useQuery({
    queryKey: ["teacher"],
    queryFn: () => getTeacherProfile(tId),
    onError: (err: AxiosError) => err,
  });
};

export const useTeacherLinkInfo = (link: string) => {
  return useQuery({
    queryKey: ["teacherLinkInfo"],
    queryFn: () => getTeacherDocumentInfo(link),
    onError: (err: AxiosError) => err,
  });
};

export const useTeacherWorkloadInfo = (teacherSubjects: Subject[]) => {
  return useQuery({
    queryKey: ["teacherWorkloadInfo"],
    queryFn: () =>
      teacherSubjects?.length > 0 ? getTeacherWorkloadInfo() : null,
    onError: (err: AxiosError) => err,
  });
};

export const useWorkloadHistoryList = () => {
  return useQuery({
    queryKey: ["teacherWorkloadHistory"],
    queryFn: () => getWorkloadHistoryList(),
    onError: (err: AxiosError) => err,
  });
};

/* Mutations */
export const useEditTeacher = () => {
  return useMutation({
    mutationFn: (data: TeacherUpdate) => editTeacher(data),
    onError: (err: AxiosError) => err,
  });
};

export const useAddQrcodeToTeacher = () => {
  return useMutation({
    mutationFn: (data: AddQrCode) => addQrCodeToTeacher(data),
    onError: (err: AxiosError) => err,
  });
};

export const useAddTeacherPosition = () => {
  return useMutation({
    mutationFn: (data: TeacherPositionUpdate) => addTeacherPosition(data),
    onError: (err: AxiosError) => err,
  });
};

export const useChangeTeacherWorkload = () => {
  return useMutation({
    mutationFn: (data: TeacherWorkloadChange) => changeTeacherWorkload(data),
    onError: (err: AxiosError) => err,
  });
};

export const useChangeTeacherLesson = () => {
  return useMutation({
    mutationFn: (data: AbsentLessonBody) => changeTeacherLesson(data),
    onError: (err: AxiosError) => err,
  });
};

export const useUpdateTeacherPosition = () => {
  return useMutation({
    mutationFn: (data: TeacherPositionUpdate) => updateTeacherPosition(data),
    onError: (err: AxiosError) => err,
  });
};

export const useCreateTeacher = () => {
  return useMutation({
    mutationFn: (data: TeacherCreate) => createTeacher(data),
    onError: (err: AxiosError) => err,
  });
};
