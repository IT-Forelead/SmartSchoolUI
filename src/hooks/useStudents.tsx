import {
    Approve,
    ApproveAsAdmin,
    AddQrCode,
    Student, StudentUpdate
} from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// export type AddSubjects = {
//     teacherId: string,
//     subjectIds: string[]
// }

/* APIs */
const getStudentsList = async () => {
    return await axios.get<Student[]>("/student", {});
};

export const approveStudentDoc = async (data: Approve) => {
    return await axios.get<any>(`/student/approve/degree/${data.link}?approved=${data.approved}`);
};

export const approveAbsentTeacherLesson = async (data: Approve) => {
    return await axios.get<any>(`/student/confirm/lesson/${data.link}?approved=${data.approved}`);
};

export const addQrCodeToStudent = async (data: AddQrCode) => {
    return await axios.get<any>(`/student/add-qrcode/${data.personId}`);
};

export const approveStudentDocAsAdmin = async (data: ApproveAsAdmin) => {
    return await axios.post<any>(`/student/approve/degree`, data);
};

const getStudentProfile = async (teacherId: string) => {
    return await axios.post<Student[]>("/student/fetch", {
        "id": teacherId
    });
};

const editStudent = async (data: StudentUpdate) => {
    return await axios.post<any>("/student/update", data);
};

const getStudentDocumentInfo = async (link: string) => {
    return await axios.get<Student>(`/student/document/${link}`);
};

export const useStudentsList = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: () => getStudentsList(),
        onError: (err: AxiosError) => err
    })
};

export const useStudentProfile = (sId: string) => {
    return useQuery({
        queryKey: ['student'],
        queryFn: () => getStudentProfile(sId),
        onError: (err: AxiosError) => err
    })
}

export const useStudentLinkInfo = (link: string) => {
    return useQuery({
        queryKey: ['studentLinkInfo'],
        queryFn: () => getStudentDocumentInfo(link),
        onError: (err: AxiosError) => err
    })
}
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
