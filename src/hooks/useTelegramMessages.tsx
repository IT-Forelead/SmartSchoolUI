import axios from "@/services/axios";
import {
  StatsDaily,
  TelegramMessagesFilter,
  TelegramMessagesResponse,
} from "@/models/common.interface";
import { useQuery } from "@tanstack/react-query";

interface Range {
  from: string;
  to: string;
}

// APIs
const getTelegramMessages = async (filter: TelegramMessagesFilter) => {
  return await axios.post<TelegramMessagesResponse>(
    "telegram-messages",
    filter,
  );
};

const getTelegramMessagesCount = async () => {
  return await axios.get<number>("telegram-messages/stats");
};

const getTelegramMessagesByRange = async (range: Range) => {
  return await axios.get<StatsDaily[]>(
    `telegram-messages/stats/${range.from}/${range.to}`,
  );
};

// Hooks
export const useTelegramMessages = (filter: TelegramMessagesFilter) => {
  return useQuery({
    queryKey: ["telegram-messages", filter],
    queryFn: () => getTelegramMessages(filter),
  });
};

export const useTelegramMessagesCount = () => {
  return useQuery({
    queryKey: ["telegram-messages-count"],
    queryFn: getTelegramMessagesCount,
  });
};

export const useTelegramMessagesStatsByRange = (range: Range) => {
  return useQuery({
    queryKey: ["telegram-messages-stats", range],
    queryFn: () => getTelegramMessagesByRange(range),
  });
};
