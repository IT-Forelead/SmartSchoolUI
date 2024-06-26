export type Group = {
  id: string;
  createdAt: string;
  level: number;
  name: string;
  updatedAt: object;
  studentCount: number;
};

export type WorkloadHistory = {
  id: string;
  createdAt: string;
  from: string;
  to: string;
  userId: string;
  workload: number;
  reasonDocId: string;
};

export type Message = {
  id: string;
  createdAt: string;
  to: string;
  text: string;
  status: string;
};

export type MessageResponse = {
  messages: Message[];
  page: number;
  perPage: number;
  totalPages: number;
};

export type MessageFilter = {
  page?: number;
  perPage?: number;
  phone?: string;
  from?: string;
  to?: string;
};

export type Room = {
  number: number;
  name: string;
  type: string;
};

export type Subject = {
  id: string;
  name: string;
  category: string;
  hourForBeginner: number;
  hourForHigher: number;
  needDivideStudents: boolean;
};

export type Visit = {
  id: string;
  createdAt: string;
  personId: string;
  visitType: string;
  assetId?: string;
  fullName: string;
  group?: string;
  groupLevel?: number;
  groupName?: string;
  teacherWorkload?: number;
};

export type UpdateVisit = {
  id: string;
  filename: null;
};

export type VisitFilter = {
  fullName?: string;
  personId?: string;
  groupLevel?: number;
  groupName?: string;
  type?: "teachers" | "students";
  from?: string;
  to?: string;
  perPage?: number;
  page?: number;
};

export type VisitResponse = {
  visits: Visit[];
  page: number;
  perPage: number;
  totalPages: number;
};

export type VisitInfo = {
  id: string;
  createdAt: string;
  personId: string;
  visitType: "come_in" | "go_out";
  assetId: string;
  fullName: string;
  label: "student" | "teacher";
};

export type Teacher = {
  id: string;
  createdAt: string;
  dateOfBirth: string;
  gender: "female" | "male";
  fullName: string;
  nationality: string;
  citizenship: string;
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  pinfl: string;
  phone?: string;
  photo?: string;
  subjects: [
    {
      id: string;
      name: string;
      category: string;
      needDivideStudents: boolean;
      hourForBeginner: number;
      hourForHigher: number;
    },
  ];
  degree: string;
  workload: number;
  documents: [
    {
      id: string;
      teacherId: string;
      certificateId: string;
      approved: string;
      rejected: string;
    },
  ];
  barcode?: string;
  smsOptOut: boolean;
};

export type TeacherCreate = {
  fullName: string;
  subjects: string[];
  gender: "male" | "female";
  dateOfBirth?: string;
  nationality: "uzbek" | "russian" | "turkmen";
  citizenship: "uzbekistan" | "russia";
  documentType?: "passport" | "birth_certificate";
  documentSeries?: string;
  documentNumber?: string;
  pinfl?: string;
  phone?: string;
};

export type Student = {
  id: string;
  dateOfBirth: string;
  gender: "female" | "male";
  fullName: string;
  nationality: string;
  citizenship: string;
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  pinfl: string;
  parentPhone: string;
  photo?: string;
  group: {
    id: string;
    level: string;
    name: string;
  };
  barcode: string;
  createdAt: string;
  smsOptOut: boolean;
};

export type StudentCreate = {
  fullName: string;
  groupId: string;
  gender: "male" | "female";
  parentPhone?: string;
  dateOfBirth?: string;
  nationality: "uzbek" | "russian" | "turkmen";
  citizenship: "uzbekistan" | "russia";
  documentType?: "passport" | "birth_certificate";
  documentSeries?: string;
  documentNumber?: string;
  pinfl?: string;
};

export type StudentUpdate = {
  id: string;
  dateOfBirth: string;
  gender: "female" | "male";
  fullName: string;
  nationality: string;
  citizenship: string;
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  pinfl: string;
  parentPhone: string;
  photo?: string;
  group: {
    id: string;
    level: string;
    name: string;
  };
  barcode: string;
};

export type TeacherDegree = {
  id: string;
  description: string;
  point: number;
};

export type ApproveAsAdmin = {
  approved: boolean;
  degreeId: string;
  teacherId: string;
};

export type TeacherUpdate = {
  id: string;
  dateOfBirth: string;
  gender: "female" | "male";
  fullName: string;
  nationality: string;
  citizenship: string;
  documentType: string;
  documentSeries: string;
  documentNumber: string;
  pinfl: string;
  degree: string;
  subjectId: string;
  phone: string;
};

export type AddQrCode = {
  personId: string;
  qrcodeId: string;
};

export type Approve = {
  link: string;
  approved: boolean;
};

export type TeacherPositionUpdate = {
  teacherId: string;
  degreeId: string;
  filename: null;
};

export type LessonHour = {
  subjectId: string;
  hour: number;
  level: number;
};

export type TeacherWorkloadChange = {
  from: string;
  to: string;
  userId: string;
  workload: number;
  filename: object;
};

export type AbsentLessonBody = {
  subjectId: string;
  groupId: string;
  weekday: string;
  moment: number;
};

export type LessonBody = {
  teacherId: string;
  subjectId: string;
  groupId: string;
  weekday: string;
  moment: number;
};

export type LessonTime = {
  weekday: string;
  moment: number;
};

export type LessonCreate = {
  teacherId: string;
  subjectId: string;
  groupId: string;
  times: LessonTime[];
};

export type LessonFilter = {
  teacherId?: string;
  groupId?: string;
};

export type WorkloadFormula = {
  x: number;
  total: number;
  teachers: [
    {
      teacher: Teacher;
      hour: number;
    },
  ];
  mode: number;
};

export type StudyHours = {
  level: number;
  hour: number;
  subjectId: string;
};

export type Substitution = {
  id: string;
  createdAt: string;
  from: string;
  to: string;
  subjectId: string;
  groupId: string;
  weekday: string;
  moment: number;
};

export type Stats = {
  total: number;
  qrCodeAssigned: number;
  inSchool: number;
  didNotCome: number;
};

export type SmsStats = {
  total: number;
  sent: number;
  delivered: number;
  notDelivered: number;
  failed: number;
  transmitted: number;
  undefined: number;
};

export type StatsDaily = {
  date: string;
  count: number;
};

export type SmsOptOut = {
  personId: string;
  optOut: boolean;
};

export interface TelegramMessage {
  id: string;
  createdAt: string;
  message: string;
  personId: string;
}

export interface TelegramMessagesResponse {
  messages: TelegramMessage[];
  page: number;
  perPage: number;
  totalPages: number;
}

export interface TelegramMessagesFilter {
  from: string;
  to: string;
  page: string;
  perPage: string;
}
