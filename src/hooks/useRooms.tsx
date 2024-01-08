import { Room } from "@/models/common.interface";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

const getRoomsList = async () => {
  return await axios.get<Room[]>("/room");
};

export const useRoomsList = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRoomsList(),
    onError: (err: AxiosError) => err,
  });
};
