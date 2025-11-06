import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../core/services/admin'; // <-- Import AdminService

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; // <-- Import Select

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule // <-- Add Select
  ],
  templateUrl: './course-dialog.html',
  styleUrl: './course-dialog.css'
})
export class CourseDialogComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode: boolean;
  allTeachers: any[] = [];
  allStudents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService, // <-- Inject AdminService
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;

    // Get current teacher/student IDs
    const teacherId = data?.teacher?.id || null;
    const studentIds = data?.students?.map((s: any) => s.id) || [];

    this.courseForm = this.fb.group({
      // Course Info
      name: [data?.name || '', Validators.required],
      courseCode: [data?.courseCode || '', Validators.required],

      // Relational Info
      teacherId: [teacherId],
      studentIds: [studentIds]
    });
  }

  ngOnInit(): void {
    // Load data for the dropdowns
    this.loadTeachers();
    this.loadStudents();

    // In edit mode, we only handle assignments
    // We disable changing the name/code
    if (this.isEditMode) {
      this.courseForm.get('name')?.disable();
      this.courseForm.get('courseCode')?.disable();
    } else {
      // In create mode, you can't assign yet
      this.courseForm.get('teacherId')?.disable();
      this.courseForm.get('studentIds')?.disable();
    }
  }

  loadTeachers(): void {
    this.adminService.getTeachers().subscribe(data => {
      this.allTeachers = data;
    });
  }

  loadStudents(): void {
    this.adminService.getStudents().subscribe(data => {
      this.allStudents = data;
    });
  }

  onSave(): void {
    if (this.courseForm.valid) {
      this.dialogRef.close(this.courseForm.getRawValue()); // Use getRawValue() to get disabled fields
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}