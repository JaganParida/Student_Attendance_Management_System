// File: src/main/java/com/attendance/backend/dto/SignUpRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;
@Data
public class SignUpRequest {
    @NotBlank @Size(min = 3, max = 50) private String name;
    @NotBlank @Size(max = 50) @Email private String email;
    @NotBlank @Size(min = 6, max = 40) private String password;
    private Set<String> roles;
}