export interface AuthTokens {
  map(arg0: (teacher: any) => void): import("react").ReactNode;
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  phone: string;
  password: string;
}
