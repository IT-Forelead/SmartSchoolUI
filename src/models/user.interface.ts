import { LessonBody } from "./common.interface";

export interface UserInfo {
  exp: bigint;
  iat: bigint;
  User: {
    id: string;
    createdAt: string;
    role: string;
    phone: string;
  }
}

export interface LessonBodyData {
  lesson1?: LessonBody;
  lesson2?: LessonBody;
}
