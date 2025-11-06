package com.attendance.backend.controller;

import com.attendance.backend.dto.AttendanceSummaryDTO;
import com.attendance.backend.exception.ResourceNotFoundException;
import com.attendance.backend.model.Attendance;
import com.attendance.backend.model.Course;
import com.attendance.backend.model.Student;
import com.attendance.backend.model.User;
import com.attendance.backend.repository.AttendanceRepository;
import com.attendance.backend.repository.StudentRepository;
import com.attendance.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;

    private Student getLoggedInStudent(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "user_id", user.getId()));
    }

    @GetMapping("/courses")
    public ResponseEntity<Set<Course>> getEnrolledCourses(Principal principal) {
        Student student = getLoggedInStudent(principal);
        Student studentWithCourses = studentRepository.findById(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", student.getId()));
        return ResponseEntity.ok(studentWithCourses.getCourses());
    }

    @GetMapping("/attendance/{courseId}")
    public ResponseEntity<List<Attendance>> getAttendanceForCourse(
            @PathVariable Long courseId,
            Principal principal) {
        Student student = getLoggedInStudent(principal);
        List<Attendance> attendanceRecords = attendanceRepository
                .findByStudentIdAndCourseId(student.getId(), courseId);
        return ResponseEntity.ok(attendanceRecords);
    }

    @GetMapping("/attendance-summary/{courseId}")
    public ResponseEntity<AttendanceSummaryDTO> getAttendanceSummaryForCourse(
            @PathVariable Long courseId,
            Principal principal) {

        Student student = getLoggedInStudent(principal);

        long present = attendanceRepository.countPresent(student.getId(), courseId);
        long absent = attendanceRepository.countAbsent(student.getId(), courseId);
        long late = attendanceRepository.countLate(student.getId(), courseId);
        long total = present + absent + late;

        double percentage = (total == 0) ? 0 : ((double) (present + late) / total) * 100; // Present+Late / Total

        AttendanceSummaryDTO summary = new AttendanceSummaryDTO(
                student.getId(),
                student.getUser().getName(),
                present,
                absent,
                late,
                total,
                percentage
        );

        return ResponseEntity.ok(summary);
    }

    // --- 1. ADD THIS NEW METHOD ---
    @GetMapping("/overall-summary")
    public ResponseEntity<AttendanceSummaryDTO> getOverallSummary(Principal principal) {
        Student student = getLoggedInStudent(principal);

        long totalPresent = 0;
        long totalAbsent = 0;
        long totalLate = 0;

        // Get all courses for the student
        Set<Course> courses = studentRepository.findById(student.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", student.getId()))
                .getCourses();

        // Loop through each course and sum up the attendance
        for (Course course : courses) {
            totalPresent += attendanceRepository.countPresent(student.getId(), course.getId());
            totalAbsent += attendanceRepository.countAbsent(student.getId(), course.getId());
            totalLate += attendanceRepository.countLate(student.getId(), course.getId());
        }

        long totalDays = totalPresent + totalAbsent + totalLate;
        double percentage = (totalDays == 0) ? 0 : ((double) (totalPresent + totalLate) / totalDays) * 100;

        AttendanceSummaryDTO overallSummary = new AttendanceSummaryDTO(
                student.getId(),
                student.getUser().getName(),
                totalPresent,
                totalAbsent,
                totalLate,
                totalDays,
                percentage
        );

        return ResponseEntity.ok(overallSummary);
    }
}