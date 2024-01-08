import { AuthTokens } from "@/models/auth.interface";
import { publicAxiosClient } from "@/services/axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export async function refreshToken() {
  try {
    const res = await publicAxiosClient.get<AuthTokens>("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${getCookie("refresh-token")!}`,
      },
    });
    const session = res?.data;
    if (!session?.accessToken) {
      deleteCookie("access-token");
      deleteCookie("refresh-token");
    }

    setCookie("access-token", res.data.accessToken);
    setCookie("refresh-token", res.data.refreshToken);

    return session;
  } catch (error: any) {
    if (error?.response?.status === 403) {
      alert("Your session has been expired!");
      // Logging out the user by removing all the tokens from local
      deleteCookie("access-token");
      deleteCookie("refresh-token");
      deleteCookie("user-info");
      // Redirecting the user to the landing page
      window.location.href = "/";
    }
  }
}
