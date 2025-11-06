// File: src/main/java/com/attendance/backend/dto/CourseRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CourseRequest {
    @NotBlank private String name;
    @NotBlank private String courseCode;
}