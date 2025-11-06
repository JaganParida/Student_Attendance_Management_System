import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student';
import { MatSnackBar } from '@angular/material/snack-bar';

// Standalone imports
import { CommonModule } from '@angular/common'; // <-- Removed DecimalPipe
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCoursesComponent implements OnInit {

  courses: any[] = [];
  // --- The 'summary' property is now GONE ---

  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEnrolledCourses();
    // --- The call to loadOverallSummary() is GONE ---
  }

  loadEnrolledCourses(): void {
    this.studentService.getEnrolledCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load enrolled courses', 'Close', { duration: 3000 });
      }
    });
  }

  // --- The loadOverallSummary() method is GONE ---
}