import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TeacherDialogComponent } from '../teacher-dialog/teacher-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import standalone modules
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    // TeacherDialogComponent // <-- IMPORTANT: Import the dialog
  ],
  templateUrl: './manage-teachers.html',
  styleUrl: './manage-teachers.css'
})
export class ManageTeachersComponent implements OnInit {

  // Update column definition to use 'facultyId'
  displayedColumns: string[] = ['name', 'email', 'facultyId', 'actions']; 
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    // Call the correct service method
    this.adminService.getTeachers().subscribe({ 
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load teachers', 'Close', { duration: 3000 });
      }
    });
  }

  openTeacherDialog(teacher: any = null): void {
    const dialogRef = this.dialog.open(TeacherDialogComponent, { 
      width: '450px',
      data: teacher
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (teacher) {
          // Edit Mode
          this.adminService.updateTeacher(teacher.id, result).subscribe(() => { 
            this.snackBar.open('Teacher updated successfully', 'Close', { duration: 3000 });
            this.loadTeachers();
          });
        } else {
          // Create Mode
          this.adminService.createTeacher(result).subscribe(() => { 
            this.snackBar.open('Teacher created successfully', 'Close', { duration: 3000 });
            this.loadTeachers();
          });
        }
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.adminService.deleteTeacher(id).subscribe({ 
        next: () => {
          this.snackBar.open('Teacher deleted successfully', 'Close', { duration: 3000 });
          this.loadTeachers();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to delete teacher', 'Close', { duration: 3000 });
        }
      });
    }
  }
}