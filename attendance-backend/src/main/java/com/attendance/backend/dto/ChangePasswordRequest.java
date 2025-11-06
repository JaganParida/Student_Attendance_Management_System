// File: src/main/java/com/attendance/backend/dto/ChangePasswordRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class ChangePasswordRequest {
    @NotBlank private String oldPassword;
    @NotBlank private String newPassword;
}