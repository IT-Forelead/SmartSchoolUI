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
  assetId: string;
  fullName: string;
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
    }
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
    }
  ];
};

export  type  Student = {
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
  phone: string;
  photo?: string;
  groupId: string;
  barcode: string;
}

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
  phone: string;
  photo?: string;
  groupId: string;
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
  barcodeId: string;
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

export type WorkloadFormula = {
  x: number;
  total: number;
  teachers: [
    {
      teacher: Teacher;
      hour: number;
    }
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
