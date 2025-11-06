// File: src/main/java/com/attendance/backend/dto/CreateUserRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateUserRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String idNumber;
}