import { MessageFilter } from "@/models/common.interface";

import { MessageResponse, SmsStats } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getMessagesList = async (filter: MessageFilter) => {
  return await axios.post<MessageResponse>("/sms/messages", filter);
};

export const useMessagesList = (filter: MessageFilter) => {
  return useQuery({
    queryKey: ["messages", filter],
    queryFn: () => getMessagesList(filter),
    onError: (err: AxiosError) => err,
  });
};

export const getMessagesStats = async () => {
  return await axios.get<SmsStats>("/sms/messages/stats");
};

export const useMessagesStats = () => {
  return useQuery({
    queryKey: ["messagesStats"],
    queryFn: () => getMessagesStats(),
    onError: (err: AxiosError) => err,
  });
};
