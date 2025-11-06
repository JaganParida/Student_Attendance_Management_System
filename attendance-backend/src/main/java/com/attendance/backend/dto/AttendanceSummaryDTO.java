// File: src/main/java/com/attendance/backend/dto/AttendanceSummaryDTO.java
package com.attendance.backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data @NoArgsConstructor @AllArgsConstructor
public class AttendanceSummaryDTO {
    private Long studentId;
    private String studentName;
    private long totalPresent;
    private long totalAbsent;
    private long totalLate;
    private long totalDays;
    private double percentage;
}