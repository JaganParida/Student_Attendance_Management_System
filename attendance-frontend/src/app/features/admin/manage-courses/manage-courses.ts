import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs'; // <-- Import forkJoin for parallel API calls

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    // CourseDialogComponent // <-- Import the dialog
  ],
  templateUrl: './manage-courses.html',
  styleUrl: './manage-courses.css'
})
export class ManageCoursesComponent implements OnInit {

  displayedColumns: string[] = ['courseCode', 'name', 'teacher', 'students', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getCourses().subscribe({
      next: (data) => { this.dataSource.data = data; },
      error: (err) => this.showError('Failed to load courses')
    });
  }

  openCourseDialog(course: any = null): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '500px',
      data: course // null when creating, course object when editing
    });

    dialogRef.afterClosed().subscribe(result => {
      // result is the form data
      if (result) {
        if (course) {
          // EDIT MODE: We are only handling assignments
          this.handleAssignments(course.id, result);
        } else {
          // CREATE MODE: Just create the course
          this.adminService.createCourse(result).subscribe({
            next: () => {
              this.showSuccess('Course created successfully');
              this.loadCourses(); // Refresh table
            },
            error: (err) => this.showError('Failed to create course')
          });
        }
      }
    });
  }

  handleAssignments(courseId: number, formData: any): void {
    const { teacherId, studentIds } = formData;
    const requests: Observable<any>[] = []; // An array to hold all our API calls

    // 1. Create request for Assigning Teacher
    if (teacherId) {
      requests.push(this.adminService.assignTeacher({ teacherId, courseId }));
    }

    // 2. Create requests for Enrolling Students
    // Note: This logic only *adds* students. A full-scale app would also handle *removing* them.
    // For this project, this is sufficient.
    studentIds.forEach((studentId: number) => {
      requests.push(this.adminService.enrollStudent({ studentId, courseId }));
    });
    
    // 3. (Optional) Update course info - our form disables this, but we'll include it
    requests.push(this.adminService.updateCourse(courseId, { name: formData.name, courseCode: formData.courseCode }));

    // Run all API calls in parallel
    forkJoin(requests).subscribe({
      next: () => {
        this.showSuccess('Course assignments updated');
        this.loadCourses(); // Refresh table
      },
      error: (err) => this.showError('Failed to update assignments')
    });
  }

  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.adminService.deleteCourse(id).subscribe({
        next: () => {
          this.showSuccess('Course deleted successfully');
          this.loadCourses(); // Refresh table
        },
        error: (err) => this.showError('Failed to delete course')
      });
    }
  }
  
  // Helper methods for snackbar
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}