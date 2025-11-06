import { Component, OnInit } from '@angular/core'; // <-- Add OnInit
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';

// Import standalone modules
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; // <-- Add Menu
import { MatDividerModule } from '@angular/material/divider'; // <-- Add Divider

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule, // <-- Add Menu
    MatDividerModule // <-- Add Divider
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent implements OnInit { // <-- Implement OnInit
  
  userEmail: string = ''; // <-- Variable to hold user's email

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the user's data on load
    const user = this.authService.getUser();
    if (user && user.email) {
      this.userEmail = user.email;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Role check functions
  isAdmin(): boolean {
    return this.authService.hasRole('ROLE_ADMIN');
  }

  isTeacher(): boolean {
    return this.authService.hasRole('ROLE_TEACHER');
  }

  isStudent(): boolean {
    return this.authService.hasRole('ROLE_STUDENT');
  }
}