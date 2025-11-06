// File: src/main/java/com/attendance/backend/dto/AssignTeacherRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class AssignTeacherRequest {
    @NotNull private Long teacherId;
    @NotNull private Long courseId;
}