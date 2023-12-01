import {
    AddQrCode,
    Student, StudentUpdate
} from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* APIs */
const getStudentsList = async () => {
    return await axios.get<Student[]>("/student", {});
};

export const addQrCodeToStudent = async (data: AddQrCode) => {
    return await axios.get<any>(`/student/add-qrcode/${data.personId}`);
};

const editStudent = async (data: StudentUpdate) => {
    return await axios.post<any>("/student/update", data);
};

export const useStudentsList = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: () => getStudentsList(),
        onError: (err: AxiosError) => err
    })
};
/* Mutations */
export const useEditStudent = () => {
    return useMutation({
        mutationFn: (data: StudentUpdate) => editStudent(data),
        onError: (err: AxiosError) => err
    })
};
export const useAddQrcodeToStudent = () => {
    return useMutation({
        mutationFn: (data: AddQrCode) => addQrCodeToStudent(data),
        onError: (err: AxiosError) => err
    })
};
