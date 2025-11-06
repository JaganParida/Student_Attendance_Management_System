// File: src/main/java/com/attendance/backend/dto/LoginRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;
}