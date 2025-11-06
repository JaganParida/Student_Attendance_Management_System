import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'accessToken'; 
  private readonly USER_KEY = 'authUser';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        const userData = {
          id: response.id,
          email: response.email,
          roles: response.roles
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY); 
  }
  
  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getRoles(): string[] {
    const user = this.getUser();
    return user ? user.roles : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}