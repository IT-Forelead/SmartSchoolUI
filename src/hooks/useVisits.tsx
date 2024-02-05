import {
  VisitFilter,
  VisitInfo,
  VisitResponse,
} from "@/models/common.interface";
import axios from "@/services/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

/* APIs */
const getVisitsList = async (filters: VisitFilter) => {
  return await axios.post<VisitResponse>("/visit/history", filters);
};

const visitCreate = async (data: FormData) => {
  return await axios.post<VisitInfo>("/visit/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* Hooks */
export const useVisitsList = (filters: VisitFilter) => {
  return useQuery({
    queryKey: ["visits", filters],
    queryFn: () => getVisitsList(filters),
    onError: (err: AxiosError) => err,
  });
};

/* Mutations */
export const useVisitCreate = (
  onSuccess: (data: AxiosResponse<VisitInfo, any>) => void,
) => {
  return useMutation({
    mutationFn: (data: FormData) => visitCreate(data),
    onSuccess: onSuccess,
    onError: (err: AxiosError) => err,
  });
};
