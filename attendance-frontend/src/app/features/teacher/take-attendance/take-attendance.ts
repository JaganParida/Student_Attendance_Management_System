import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher';
import { MatSnackBar } from '@angular/material/snack-bar';

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-take-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTooltipModule
  ],
  templateUrl: './take-attendance.html',
  styleUrl: './take-attendance.css'
})
export class TakeAttendanceComponent implements OnInit {

  course: any; 
  courseId!: number;
  attendanceForm!: FormGroup;
  
  maxDate: Date;
  isEditMode = false;
  isLocked = false;
  hasExistingData = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    this.attendanceForm = this.fb.group({
      date: [new Date(), Validators.required], 
      records: this.fb.array([]) 
    });

    this.loadCourseData();
  }

  get records(): FormArray {
    return this.attendanceForm.get('records') as FormArray;
  }

  loadCourseData(): void {
    this.teacherService.getAssignedCourses().subscribe({
      next: (courses) => {
        this.course = courses.find(c => c.id === this.courseId);
        if (this.course) {
          this.buildStudentFormArray();
          
          // --- THIS IS THE FIX ---
          // Disable the form *immediately* after building it.
          // It will be enabled later if it's a new record.
          this.records.disable();
          // --------------------

          this.loadAttendanceForSelectedDate(); 
        } else {
          this.snackBar.open('Error: Course not found.', 'Close', { duration: 3000 });
        }
      },
      error: (err) => this.snackBar.open('Failed to load course data', 'Close', { duration: 3000 })
    });
  }

  buildStudentFormArray(): void {
    this.records.clear();
    this.course.students.forEach((student: any) => {
      const studentGroup = this.fb.group({
        studentId: [student.id, Validators.required],
        studentName: [student.user.name], 
        status: ['PRESENT', Validators.required]
      });
      this.records.push(studentGroup);
    });
  }

  loadAttendanceForSelectedDate(): void {
    const selectedDate = this.attendanceForm.get('date')?.value;
    
    this.checkIfLocked(selectedDate);
    
    const dateString = this.formatDate(selectedDate);

    this.teacherService.getAttendanceForDate(this.courseId, dateString).subscribe({
      next: (existingRecords) => {
        if (existingRecords.length > 0) {
          // Data exists for this date
          this.hasExistingData = true;
          this.isEditMode = false; // Start in "view" mode
          
          this.records.controls.forEach(control => {
            const studentId = control.get('studentId')?.value;
            const record = existingRecords.find(r => r.student.id === studentId);
            if (record) {
              control.get('status')?.patchValue(record.status);
            }
          });
          this.snackBar.open('Loaded existing records for this date.', 'Close', { duration: 2000 });
        } else {
          // No data exists, this is a new record
          this.hasExistingData = false;
          this.isEditMode = true; // Start in "edit" mode
          this.records.controls.forEach(control => {
            control.get('status')?.patchValue('PRESENT'); 
          });
        }
        // Set the form state (enabled/disabled) based on new rules
        this.toggleFormState();
      },
      error: (err) => {
        this.snackBar.open('Failed to load attendance records', 'Close', { duration: 3000 });
      }
    });
  }

  onEnableUpdates(): void {
    this.isEditMode = true;
    this.toggleFormState();
  }

  checkIfLocked(selectedDate: Date): void {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    this.isLocked = selectedDate < yesterday;
  }

  toggleFormState(): void {
    if (this.isEditMode && !this.isLocked) {
      this.records.enable(); // Enable all radio buttons
    } else {
      this.records.disable(); // Disable all radio buttons
    }
  }
  
  onSubmit(): void {
    if (this.attendanceForm.invalid) {
      return;
    }
    const formData = this.attendanceForm.value;
    const payload = {
      courseId: this.courseId,
      date: this.formatDate(formData.date), 
      records: formData.records.map((rec: any) => ({
        studentId: rec.studentId,
        status: rec.status
      }))
    };

    this.teacherService.takeAttendance(payload).subscribe({
      next: () => {
        this.snackBar.open('Attendance saved successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/app/teacher-courses']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(err.error.message || 'Failed to submit attendance', 'Close', { duration: 3000 });
      }
    });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}