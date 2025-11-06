import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  // --- Student Management ---
  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/students`);
  }
  createStudent(studentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student`, studentData);
  }
  updateStudent(id: number, studentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/student/${id}`, studentData);
  }
  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/student/${id}`);
  }

  // --- Teacher Management ---
  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teachers`);
  }
  createTeacher(teacherData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/teacher`, teacherData);
  }
  updateTeacher(id: number, teacherData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/teacher/${id}`, teacherData);
  }
  deleteTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/teacher/${id}`);
  }

  // --- Course Management (ADD THIS SECTION) ---
  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }
  createCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/course`, courseData);
  }
  updateCourse(id: number, courseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/course/${id}`, courseData);
  }
  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/course/${id}`);
  }

  // --- Relationship Management (ADD THIS SECTION) ---
  assignTeacher(data: { teacherId: number, courseId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/course/assign-teacher`, data);
  }
  enrollStudent(data: { studentId: number, courseId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/course/enroll-student`, data);
  }
}