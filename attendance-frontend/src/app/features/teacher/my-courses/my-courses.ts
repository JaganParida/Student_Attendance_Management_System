import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../core/services/teacher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table'; 
import { Router, RouterLink } from '@angular/router'; 
import { forkJoin } from 'rxjs'; // <-- Make sure forkJoin is imported

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    // RouterLink,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCoursesComponent implements OnInit {
  
  // For Stat Cards
  totalCourses = 0;
  totalStudents = 0;

  // For the Table
  displayedColumns: string[] = ['courseCode', 'name', 'studentCount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  // This Set will hold the IDs of courses with attendance taken today
  takenCourseIds = new Set<number>();

  constructor(
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllData(); // <-- This loads all data
  }

  loadAllData(): void {
    // We load two sets of data in parallel
    const courses$ = this.teacherService.getAssignedCourses();
    const status$ = this.teacherService.getTodayAttendanceStatus();

    forkJoin({ courses: courses$, status: status$ }).subscribe({
      next: (data) => {
        // --- Process Status Data ---
        // data.status is the array of course IDs [1, 5, 6]
        this.takenCourseIds = new Set(data.status);

        // --- Process Course Data ---
        this.dataSource.data = data.courses;
        this.totalCourses = data.courses.length;
        this.totalStudents = data.courses.reduce((sum, course) => sum + course.students.length, 0);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load course data', 'Close', { duration: 3000 });
      }
    });
  }
  
  /**
   * Checks if attendance has been taken for a course ID
   */
  hasAttendanceToday(courseId: number): boolean {
    return this.takenCourseIds.has(courseId);
  }

  // Navigation methods
  manageAttendance(courseId: number): void {
    this.router.navigate(['/app/teacher-attendance', courseId]);
  }
  
  viewReport(courseId: number): void {
    this.router.navigate(['/app/teacher-report', courseId]);
  }
}