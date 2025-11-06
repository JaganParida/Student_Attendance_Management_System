import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../core/services/student';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

// Standalone imports
import { CommonModule, DatePipe } from '@angular/common'; // <-- Import DatePipe
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    DatePipe,
    MatCardModule
  ],
  templateUrl: './my-attendance.html',
  styleUrl: './my-attendance.css'
})
export class MyAttendanceComponent implements OnInit {

  courseId!: number;
  courseName: string = '';
  summary: any = null;
  
  displayedColumns: string[] = ['date', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // 1. Get the courseId from the URL
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    // 2. Load the attendance data
    this.loadAttendance();

    // 3. (Optional) Load course details to get the name
    this.loadCourseName();

    this.loadSummary();
  }

  loadAttendance(): void {
    this.studentService.getAttendanceForCourse(this.courseId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load attendance records', 'Close', { duration: 3000 });
      }
    });
  }

  // This is an extra helper to make the UI nice
  loadCourseName(): void {
    this.studentService.getEnrolledCourses().subscribe({
      next: (courses) => {
        const course = courses.find(c => c.id === this.courseId);
        if (course) {
          this.courseName = course.name;
        }
      }
      // No error handling needed for this, it's just a title
    });
  }

  loadSummary(): void {
    this.studentService.getAttendanceSummary(this.courseId).subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => this.showError('Failed to load summary')
    });
  }

  // Helper function to add color to the status
  getStatusClass(status: string): string {
    switch (status) {
      case 'PRESENT':
        return 'status-present';
      case 'ABSENT':
        return 'status-absent';
      case 'LATE':
        return 'status-late';
      default:
        return '';
    }
  }
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}