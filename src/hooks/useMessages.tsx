import { Message } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getMessagesList = async () => {
  return await axios.get<Message[]>("/teacher/sms/messages");
};

export const useMessagesList = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessagesList(),
    onError: (err: AxiosError) => err
  })
};

