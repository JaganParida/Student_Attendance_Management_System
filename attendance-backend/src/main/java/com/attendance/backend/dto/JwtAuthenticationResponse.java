// File: src/main/java/com/attendance/backend/dto/JwtAuthenticationResponse.java
package com.attendance.backend.dto;
import lombok.Data;
import java.util.List;
@Data
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private List<String> roles;
    public JwtAuthenticationResponse(String accessToken, Long id, String email, List<String> roles) {
        this.accessToken = accessToken; this.id = id; this.email = email; this.roles = roles;
    }
}