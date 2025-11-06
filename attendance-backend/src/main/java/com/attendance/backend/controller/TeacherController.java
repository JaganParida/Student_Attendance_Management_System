package com.attendance.backend.controller;

import com.attendance.backend.dto.ApiResponse;
import com.attendance.backend.dto.AttendanceReportDTO;
import com.attendance.backend.dto.AttendanceSummaryDTO;
import com.attendance.backend.dto.TakeAttendanceRequest;
import com.attendance.backend.exception.ResourceNotFoundException;
import com.attendance.backend.model.*;
import com.attendance.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate; // <-- Make sure this is imported
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    @Autowired private CourseRepository courseRepository;
    @Autowired private TeacherRepository teacherRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private UserRepository userRepository;

    // ... (getLoggedInTeacher method is correct)
    private Teacher getLoggedInTeacher(Principal principal) {
        String email = principal.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "user_id", user.getId()));
    }

    // ... (getAssignedCourses method is correct)
    @GetMapping("/courses")
    public ResponseEntity<Set<Course>> getAssignedCourses(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        Teacher teacherWithCourses = teacherRepository.findById(teacher.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacher.getId()));
        return ResponseEntity.ok(teacherWithCourses.getCourses());
    }

    // ... (getAttendanceByDate method is correct)
    @GetMapping("/attendance/{courseId}")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Principal principal) {

        if (!isTeacherOfCourse(principal, courseId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        List<Attendance> records = attendanceRepository.findByCourseIdAndDate(courseId, date);
        return ResponseEntity.ok(records);
    }

    // --- THIS METHOD IS UPDATED ---
    @PostMapping("/attendance")
    public ResponseEntity<?> takeAttendance(@RequestBody TakeAttendanceRequest request, Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));

        // --- 1. ADDED SECURITY LOGIC ---
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate requestDate = request.getDate();

        // Rule 1: Cannot take attendance for the future
        if (requestDate.isAfter(today)) {
            return new ResponseEntity<>(new ApiResponse(false, "Cannot take or update attendance for a future date."),
                    HttpStatus.FORBIDDEN);
        }

        // Rule 2: Cannot update attendance older than yesterday
        if (requestDate.isBefore(yesterday)) {
            return new ResponseEntity<>(new ApiResponse(false, "Attendance records are locked and cannot be updated after 24 hours."),
                    HttpStatus.FORBIDDEN);
        }
        // --- END OF SECURITY LOGIC ---


        // Security Check: Ensure the teacher is assigned to this course
        if (course.getTeacher() == null || !course.getTeacher().getId().equals(teacher.getId())) {
            return new ResponseEntity<>(new ApiResponse(false, "You are not authorized to take attendance for this course."),
                    HttpStatus.FORBIDDEN);
        }

        // This logic (Create/Update) is already correct
        List<Attendance> attendanceList = new ArrayList<>();
        for (var record : request.getRecords()) {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", record.getStudentId()));

            Optional<Attendance> existingRecord = attendanceRepository.findByStudentIdAndCourseIdAndDate(
                    student.getId(), course.getId(), request.getDate());

            if (existingRecord.isPresent()) {
                // UPDATE logic
                Attendance attendance = existingRecord.get();
                attendance.setStatus(record.getStatus());
                attendanceList.add(attendance);
            } else {
                // CREATE logic
                Attendance attendance = new Attendance(student, course, request.getDate(), record.getStatus());
                attendanceList.add(attendance);
            }
        }
        attendanceRepository.saveAll(attendanceList);
        return ResponseEntity.ok(new ApiResponse(true, "Attendance recorded successfully."));
    }

    // ... (All your reporting methods are correct)
    // ... (isTeacherOfCourse helper method is correct)
    @GetMapping("/reports/course-detail/{courseId}")
    public ResponseEntity<?> getDetailedReportForCourse(@PathVariable Long courseId, Principal principal) {
        if (!isTeacherOfCourse(principal, courseId)) {
            return new ResponseEntity<>(new ApiResponse(false, "You are not authorized for this course."), HttpStatus.FORBIDDEN);
        }
        List<AttendanceReportDTO> report = attendanceRepository.getFullAttendanceReportForCourse(courseId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/reports/course-summary/{courseId}")
    public ResponseEntity<?> getSummaryReportForCourse(@PathVariable Long courseId, Principal principal) {
        if (!isTeacherOfCourse(principal, courseId)) {
            return new ResponseEntity<>(new ApiResponse(false, "You are not authorized for this course."), HttpStatus.FORBIDDEN);
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        Set<Student> students = course.getStudents();
        List<AttendanceSummaryDTO> summaries = new ArrayList<>();
        for (Student student : students) {
            long present = attendanceRepository.countPresent(student.getId(), courseId);
            long absent = attendanceRepository.countAbsent(student.getId(), courseId);
            long late = attendanceRepository.countLate(student.getId(), courseId);
            long total = present + absent + late;
            double percentage = (total == 0) ? 0 : ((double) (present + late) / total) * 100;
            summaries.add(new AttendanceSummaryDTO(
                    student.getId(),
                    student.getUser().getName(),
                    present,
                    absent,
                    late,
                    total,
                    percentage
            ));
        }
        return ResponseEntity.ok(summaries);
    }

    private boolean isTeacherOfCourse(Principal principal, Long courseId) {
        Teacher teacher = getLoggedInTeacher(principal);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        return course.getTeacher() != null && course.getTeacher().getId().equals(teacher.getId());
    }

    @GetMapping("/attendance/status-today")
    public ResponseEntity<List<Long>> getTodayAttendanceStatus(Principal principal) {
        Teacher teacher = getLoggedInTeacher(principal);
        LocalDate today = LocalDate.now();

        List<Long> courseIds = attendanceRepository.findCourseIdsWithAttendanceByTeacherAndDate(teacher.getId(), today);

        return ResponseEntity.ok(courseIds);
    }
}