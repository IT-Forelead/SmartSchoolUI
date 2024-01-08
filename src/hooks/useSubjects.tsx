import { Subject } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getSubjectsList = async () => {
  return await axios.get<Subject[]>("/subject");
};

export const useSubjectsList = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjectsList(),
    onError: (err: AxiosError) => err,
  });
};
