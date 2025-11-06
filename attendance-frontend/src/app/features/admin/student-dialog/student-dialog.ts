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
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './student-dialog.html',
  styleUrl: './student-dialog.css'
})
export class StudentDialogComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    // This is a reference to the dialog itself
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    // This injects the data we pass from the main component
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    // Check if we are editing (data will be passed) or creating (data is null)
    this.isEditMode = !!data;

    this.studentForm = this.fb.group({
      // Populate with existing data if in edit mode, otherwise use empty string
      name: [data?.user.name || '', Validators.required],
      email: [data?.user.email || '', [Validators.required, Validators.email]],
      idNumber: [data?.studentIdNumber || '', Validators.required],
      // Only require password when creating (not editing)
      password: ['', this.isEditMode ? Validators.nullValidator : Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      // If editing, disable the email field as it shouldn't be changed
      this.studentForm.get('email')?.disable();
      // Also disable the password field
      this.studentForm.get('password')?.disable();
    }
  }

  onSave(): void {
    if (this.studentForm.valid) {
      // Send the form's value back to the component that opened it
      this.dialogRef.close(this.studentForm.getRawValue()); // Use getRawValue() to get disabled fields
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without sending data
  }
}