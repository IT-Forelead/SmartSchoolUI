import { Message } from "@/app/dashboard/messages/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getMessagesList = async () => {
  return await axios.get<Message[]>("/teacher/sms/messages");
};

export const useMessagesList = () => {
  return useQuery(['messages'], () => getMessagesList());
};

