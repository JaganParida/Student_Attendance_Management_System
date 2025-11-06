import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { AdminService } from '../../core/services/admin';
import { StudentService } from '../../core/services/student';
import { TeacherService } from '../../core/services/teacher'; // <-- 1. IMPORT TEACHER SERVICE

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  // Admin Stats
  isAdmin = false;
  adminStudentCount = 0;
  adminTeacherCount = 0;
  adminCourseCount = 0;

  // Student Stats
  isStudent = false;
  studentCourseCount = 0;
  studentSummary: any = null;

  // --- 2. ADD TEACHER STATS VARIABLES ---
  isTeacher = false;
  teacherCourseCount = 0;
  teacherStudentCount = 0;
  // -------------------------------------

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private studentService: StudentService,
    private teacherService: TeacherService // <-- 3. INJECT TEACHER SERVICE
  ) {}

  ngOnInit(): void {
    // Check roles
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
    this.isStudent = this.authService.hasRole('ROLE_STUDENT');
    this.isTeacher = this.authService.hasRole('ROLE_TEACHER'); // <-- 4. CHECK FOR TEACHER ROLE

    if (this.isAdmin) {
      this.loadAdminStats();
    }
    
    if (this.isStudent) {
      this.loadStudentStats();
    }

    // --- 5. ADD LOGIC TO LOAD TEACHER STATS ---
    if (this.isTeacher) {
      this.loadTeacherStats();
    }
    // ----------------------------------------
  }

  loadAdminStats(): void {
    this.adminService.getStudents().subscribe(data => {
      this.adminStudentCount = data.length;
    });
    this.adminService.getTeachers().subscribe(data => {
      this.adminTeacherCount = data.length;
    });
    this.adminService.getCourses().subscribe(data => {
      this.adminCourseCount = data.length;
    });
  }

  loadStudentStats(): void {
    this.studentService.getEnrolledCourses().subscribe(data => {
      this.studentCourseCount = data.length;
    });
    this.studentService.getOverallSummary().subscribe(data => {
      this.studentSummary = data;
    });
  }

  // --- 6. ADD NEW METHOD TO LOAD TEACHER STATS ---
  loadTeacherStats(): void {
    this.teacherService.getAssignedCourses().subscribe(data => {
      this.teacherCourseCount = data.length;
      // Calculate total unique students across all courses
      const allStudents = data.reduce((acc, course) => acc + course.students.length, 0);
      this.teacherStudentCount = allStudents;
    });
  }
}