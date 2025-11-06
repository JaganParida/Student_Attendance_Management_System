// File: src/main/java/com/attendance/backend/dto/UpdateCourseRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UpdateCourseRequest {
    @NotBlank private String name;
    @NotBlank private String courseCode;
}