import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'http://localhost:8080/api/student'; // Your backend Student API

  constructor(private http: HttpClient) { }

  /**
   * Gets the courses for the currently logged-in student
   */
  getEnrolledCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }

  /**
   * Gets the student's own attendance record for a specific course
   */
  getAttendanceForCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance/${courseId}`);
  }

  getAttendanceSummary(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/attendance-summary/${courseId}`);
  }

  getOverallSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/overall-summary`);
  }
}