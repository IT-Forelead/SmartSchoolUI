import { UserInfo } from "@/models/user.interface";
import { useCookies } from "react-cookie";

export default function useUserInfo() {
  const [cookies, setCookies] = useCookies()
  return cookies['user-info'] as UserInfo
}