import { Group } from "@/app/groups/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getGroupsList = async () => {
  return await axios.get<Group[]>("/group");
};

export const useGroupsList = () => {
  return useQuery(['groups'], () => getGroupsList());
};

