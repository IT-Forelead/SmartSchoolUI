import { Subject } from "@/app/dashboard/subjects/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getSubjectsList = async () => {
  return await axios.get<Subject[]>("/subject");
};

export const useSubjectsList = () => {
  return useQuery(['subjects'], () => getSubjectsList());
};

