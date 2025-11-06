import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from '../student-dialog/student-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import standalone modules
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; // For hover tooltips

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    // StudentDialogComponent // <-- IMPORTANT: Import the dialog component
  ],
  templateUrl: './manage-students.html',
  styleUrl: './manage-students.css'
})
export class ManageStudentsComponent implements OnInit {

  // Define the columns for the table
  displayedColumns: string[] = ['name', 'email', 'studentId', 'actions'];
  // This dataSource will be linked to our table
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog, // Service for opening dialogs
    private snackBar: MatSnackBar // For "Success" pop-ups
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.adminService.getStudents().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  openStudentDialog(student: any = null): void {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '450px',
      data: student // Pass student data to dialog (null if creating)
    });

    // This runs after the dialog is closed
    dialogRef.afterClosed().subscribe(result => {
      // 'result' is the form value from the dialog
      if (result) {
        if (student) {
          // Edit Mode
          this.adminService.updateStudent(student.id, result).subscribe(() => {
            this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
            this.loadStudents(); // Refresh the table
          });
        } else {
          // Create Mode
          this.adminService.createStudent(result).subscribe(() => {
            this.snackBar.open('Student created successfully', 'Close', { duration: 3000 });
            this.loadStudents(); // Refresh the table
          });
        }
      }
    });
  }

  deleteStudent(id: number): void {
    // Show a simple confirmation dialog
    if (confirm('Are you sure you want to delete this student?')) {
      this.adminService.deleteStudent(id).subscribe({
        next: () => {
          this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
          this.loadStudents(); // Refresh the table
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to delete student', 'Close', { duration: 3000 });
        }
      });
    }
  }
}