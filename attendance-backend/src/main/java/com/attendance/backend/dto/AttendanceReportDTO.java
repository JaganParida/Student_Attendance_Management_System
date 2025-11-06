// File: src/main/java/com/attendance/backend/dto/AttendanceReportDTO.java
package com.attendance.backend.dto;
import com.attendance.backend.model.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class AttendanceReportDTO {
    private Long attendanceId;
    private LocalDate date;
    private AttendanceStatus status;
    private Long studentId;
    private String studentName;
    private String studentIdNumber;
    private Long courseId;
    private String courseName;
}