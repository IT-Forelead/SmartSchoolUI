import { PaginationFilter } from "@/models/common.interface";

import { Message, MessageResponse, SmsStats } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getMessagesList = async (filter: PaginationFilter) => {
  return await axios.post<MessageResponse>("/sms/messages", filter);
};

export const useMessagesList = (filter: PaginationFilter) => {
  return useQuery({
    queryKey: ["messages"],
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
