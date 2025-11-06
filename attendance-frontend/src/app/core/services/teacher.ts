import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // <-- ADD HttpParams
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiUrl = 'http://localhost:8080/api/teacher';

  constructor(private http: HttpClient) { }

  getAssignedCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`);
  }

  getTodayAttendanceStatus(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/attendance/status-today`);
  }
  
  // --- NEW METHOD TO ADD ---
  /**
   * Gets attendance records for a course on a specific date
   * @param courseId The ID of the course
   * @param date The date in YYYY-MM-DD format
   */
  getAttendanceForDate(courseId: number, date: string): Observable<any[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<any[]>(`${this.apiUrl}/attendance/${courseId}`, { params });
  }
  // --- END OF NEW METHOD ---

  takeAttendance(attendanceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance`, attendanceData);
  }

  getCourseReport(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/course-detail/${courseId}`);
  }

  getCourseSummary(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/course-summary/${courseId}`);
  }
}