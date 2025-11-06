// This file is just for TypeScript type-checking, not a component
// It defines the "shape" of our data

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface Student {
  id: number;
  studentIdNumber: string;
  user: User;
}

export interface Teacher {
  id: number;
  facultyIdNumber: string;
  user: User;
}

export interface Course {
  id: number;
  name: string;
  courseCode: string;
  teacher: Teacher;
  students: Student[];
}