package com.attendance.backend.controller;

import com.attendance.backend.dto.ApiResponse;
import com.attendance.backend.dto.ChangePasswordRequest;
import com.attendance.backend.exception.ResourceNotFoundException;
import com.attendance.backend.model.User;
import com.attendance.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private User getLoggedInUser(Principal principal) {
        String email = principal.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        User user = getLoggedInUser(principal);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        User user = getLoggedInUser(principal);

        // Plain text comparison
        if (!request.getOldPassword().equals(user.getPassword())) { // <-- CHANGED
            return new ResponseEntity<>(new ApiResponse(false, "Incorrect old password"), HttpStatus.BAD_REQUEST);
        }

        // Set new password as plain text
        user.setPassword(request.getNewPassword()); // <-- CHANGED
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
    }
}