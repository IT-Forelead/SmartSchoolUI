import { VisitFilter, VisitResponse } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* APIs */
const getVisitsList = async (filters: VisitFilter) => {
  return await axios.post<VisitResponse>("/visit/history", filters);
}

export const updateVisit = async (id: string, data: FormData) => {
  return await axios.post<any>(`/visit/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

/* Hooks */
export const useVisitsList = (filters: VisitFilter) => {
  return useQuery({
    queryKey: ['visits'],
    queryFn: () => getVisitsList(filters),
    onError: (err: AxiosError) => err
  })
}
