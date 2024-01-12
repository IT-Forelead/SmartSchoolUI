import { useQuery } from "@tanstack/react-query";
import { Group } from "@/models/common.interface";
import axios from "@/services/axios";
import { AxiosError } from "axios";

const getGroupsList = async () => {
  return await axios.get<Group[]>("/group");
};

export const useGroupsList = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroupsList(),
    onError: (err: AxiosError) => err,
  });
};
