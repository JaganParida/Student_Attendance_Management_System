import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) { }

  /**
   * Gets the profile of the currently logged-in user
   */
  getMyProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  /**
   * Changes the password for the currently logged-in user
   */
  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }
}