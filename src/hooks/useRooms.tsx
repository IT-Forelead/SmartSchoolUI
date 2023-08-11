import { Room } from "@/app/dashboard/rooms/page";
import axios from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const getRoomsList = async () => {
  return await axios.get<Room[]>("/room");
};

export const useRoomsList = () => {
  return useQuery(['rooms'], () => getRoomsList());
};

