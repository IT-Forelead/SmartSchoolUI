import { UpdateVisit, Visit } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

/* APIs */
const getVisitsList = async () => {
  return await axios.get<Visit[]>("/visit/history");
};

export const updateVisit = async (data: UpdateVisit) => {
  return await axios.post<any>(`/qr-code/visit/update/${data.id}`, data.filename?.data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/* Hooks */
export const useVisitsList = () => {
  return useQuery({
    queryKey: ['visits'],
    queryFn: () => getVisitsList(),
    onError: (err: AxiosError) => err
  })
};
