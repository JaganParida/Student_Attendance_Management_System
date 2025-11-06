import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

// Standalone imports
import { CommonModule, DatePipe } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts'; 

@Component({
  selector: 'app-teacher-report',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    NgxChartsModule 
  ],
  templateUrl: './teacher-report.html',
  styleUrl: './teacher-report.css'
})
export class TeacherReportComponent implements OnInit {

  courseId!: number;
  // --- 1. SET THE DEFAULT TITLE HERE ---
  courseName: string = "Course Report"; 
  
  // For the Pie Chart
  chartData: any[] = [];
  view: [number, number] = [700, 300]; 
  colorScheme: any = {
    domain: ['#4caf50', '#f44336', '#ff9800'] // Green, Red, Orange
  };

  // For the Detailed Table
  displayedColumns: string[] = ['date', 'studentName', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.loadSummaryReport();
    this.loadDetailedReport();
  }

  // Gets data for the Pie Chart
  loadSummaryReport(): void {
    this.teacherService.getCourseSummary(this.courseId).subscribe({
      next: (summaries) => {
        
        // --- 2. REMOVE THE LINE THAT SET THE WRONG NAME ---
        
        const totalPresent = summaries.reduce((sum: number, s: any) => sum + s.totalPresent, 0);
        const totalAbsent = summaries.reduce((sum: number, s: any) => sum + s.totalAbsent, 0);
        const totalLate = summaries.reduce((sum: number, s: any) => sum + s.totalLate, 0);

        this.chartData = [
          { "name": "Present", "value": totalPresent },
          { "name": "Absent", "value": totalAbsent },
          { "name": "Late", "value": totalLate }
        ];
      },
      error: (err) => this.showError('Failed to load summary report')
    });
  }

  // Gets data for the table
  loadDetailedReport(): void {
    this.teacherService.getCourseReport(this.courseId).subscribe({
      next: (report) => {
        this.dataSource.data = report;

        // --- 3. SET THE CORRECT COURSE NAME FROM THE REPORT ---
        if (report.length > 0) {
          this.courseName = report[0].courseName + " Report";
        }
      },
      error: (err) => this.showError('Failed to load detailed report')
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'PRESENT': return 'status-present';
      case 'ABSENT': return 'status-absent';
      case 'LATE': return 'status-late';
      default: return '';
    }
  }
}