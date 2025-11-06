// File: src/main/java/com/attendance/backend/dto/UpdateUserRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UpdateUserRequest {
    @NotBlank private String name;
    @NotBlank private String idNumber;
}