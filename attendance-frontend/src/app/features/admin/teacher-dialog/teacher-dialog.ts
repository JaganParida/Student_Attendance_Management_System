import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Import standalone modules
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-teacher-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './teacher-dialog.html',
  styleUrl: './teacher-dialog.css'
})
export class TeacherDialogComponent implements OnInit {
  teacherForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeacherDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;

    this.teacherForm = this.fb.group({
      name: [data?.user.name || '', Validators.required],
      email: [data?.user.email || '', [Validators.required, Validators.email]],
      // Use 'facultyIdNumber' from your backend model
      idNumber: [data?.facultyIdNumber || '', Validators.required], 
      password: ['', this.isEditMode ? Validators.nullValidator : Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.teacherForm.get('email')?.disable();
      this.teacherForm.get('password')?.disable();
    }
  }

  onSave(): void {
    if (this.teacherForm.valid) {
      this.dialogRef.close(this.teacherForm.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}