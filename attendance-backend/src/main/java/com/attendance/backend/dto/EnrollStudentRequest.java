// File: src/main/java/com/attendance/backend/dto/EnrollStudentRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class EnrollStudentRequest {
    @NotNull private Long studentId;
    @NotNull private Long courseId;
}