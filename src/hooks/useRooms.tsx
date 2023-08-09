import { Room } from "@/app/rooms/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getRoomsList = async () => {
  return await axios.get<Room[]>("/room");
};

export const useRoomsList = () => {
  return useQuery(['rooms'], () => getRoomsList());
};

