import {
  AddQrCode,
  Stats,
  Student,
  StudentCreate,
  StudentUpdate,
} from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* APIs */
const getStudentsList = async () => {
  return await axios.get<Student[]>("/student", {});
};

const getStudentStats = async () => {
  return await axios.get<Stats>("/student/stats", {});
};

export const addQrCodeToStudent = async (data: AddQrCode) => {
  return await axios.post<any>("/student/add-qrcode", data);
};

const editStudent = async (data: StudentUpdate) => {
  return await axios.post<any>("/student/update", data);
};

const deleteStudentBarcode = async (data: Student) => {
  return await axios.delete<any>(`/qrcode/delete/${data}`);
};

const createStudent = async (data: StudentCreate) => {
  return await axios.post<Student>("/student", data);
};

/* Hooks */
export const useStudentsList = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudentsList(),
    onError: (err: AxiosError) => err,
  });
};

export const useStudentStats = () => {
  return useQuery({
    queryKey: ["studentStats"],
    queryFn: () => getStudentStats(),
    onError: (err: AxiosError) => err,
  });
};

/* Mutations */
export const useEditStudent = () => {
  return useMutation({
    mutationFn: (data: StudentUpdate) => editStudent(data),
    onError: (err: AxiosError) => err,
  });
};

export const useAddQrcodeToStudent = () => {
  return useMutation({
    mutationFn: (data: AddQrCode) => addQrCodeToStudent(data),
    onError: (err: AxiosError) => err,
  });
};

export const useDeleteBarCodeStudent = () => {
  return useMutation({
    mutationFn: (data: Student) => deleteStudentBarcode(data),
    onError: (err: AxiosError) => err,
  });
};

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: (data: StudentCreate) => createStudent(data),
    onError: (err: AxiosError) => err,
  });
};
