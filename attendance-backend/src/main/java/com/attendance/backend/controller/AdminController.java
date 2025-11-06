package com.attendance.backend.controller;

import com.attendance.backend.dto.*;
import com.attendance.backend.exception.ResourceNotFoundException;
import com.attendance.backend.model.*;
import com.attendance.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AttendanceRepository attendanceRepository;

    // --- Student Management ---
    @PostMapping("/student")
    public ResponseEntity<?> createStudent(@Valid @RequestBody CreateUserRequest createRequest) {
        if (userRepository.existsByEmail(createRequest.getEmail())) {
            return new ResponseEntity<>(new ApiResponse(false, "Email is already taken!"), HttpStatus.BAD_REQUEST);
        }
        User user = new User(createRequest.getName(), createRequest.getEmail(),
                createRequest.getPassword()); // <-- NO ENCODING
        user.setRoles(Set.of(Role.ROLE_STUDENT));
        Student student = new Student(createRequest.getIdNumber(), user);
        studentRepository.save(student);
        return ResponseEntity.ok(new ApiResponse(true, "Student created successfully!"));
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        User user = student.getUser();
        user.setName(request.getName());
        student.setStudentIdNumber(request.getIdNumber());
        userRepository.save(user);
        studentRepository.save(student);
        return ResponseEntity.ok(new ApiResponse(true, "Student updated successfully!"));
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        User user = student.getUser();
        studentRepository.delete(student);
        userRepository.delete(user);
        return ResponseEntity.ok(new ApiResponse(true, "Student deleted successfully!"));
    }

    // --- Teacher Management ---
    @PostMapping("/teacher")
    public ResponseEntity<?> createTeacher(@Valid @RequestBody CreateUserRequest createRequest) {
        if (userRepository.existsByEmail(createRequest.getEmail())) {
            return new ResponseEntity<>(new ApiResponse(false, "Email is already taken!"), HttpStatus.BAD_REQUEST);
        }
        User user = new User(createRequest.getName(), createRequest.getEmail(),
                createRequest.getPassword()); // <-- NO ENCODING
        user.setRoles(Set.of(Role.ROLE_TEACHER));
        Teacher teacher = new Teacher(createRequest.getIdNumber(), user);
        teacherRepository.save(teacher); // <-- Correct repository
        return ResponseEntity.ok(new ApiResponse(true, "Teacher created successfully!"));
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherRepository.findAll());
    }

    @PutMapping("/teacher/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        User user = teacher.getUser();
        user.setName(request.getName());
        teacher.setFacultyIdNumber(request.getIdNumber());
        userRepository.save(user);
        teacherRepository.save(teacher);
        return ResponseEntity.ok(new ApiResponse(true, "Teacher updated successfully!"));
    }

    @DeleteMapping("/teacher/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", id));
        User user = teacher.getUser();
        teacherRepository.delete(teacher);
        userRepository.delete(user);
        return ResponseEntity.ok(new ApiResponse(true, "Teacher deleted successfully!"));
    }

    // --- Course Management ---
    @PostMapping("/course")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest courseRequest) {
        Course course = new Course(courseRequest.getName(), courseRequest.getCourseCode());
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "Course created successfully!"));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PutMapping("/course/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody UpdateCourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        course.setName(request.getName());
        course.setCourseCode(request.getCourseCode());
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "Course updated successfully!"));
    }

    @DeleteMapping("/course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Course deleted successfully!"));
    }

    // --- Relationship Management ---
    @PostMapping("/course/assign-teacher")
    public ResponseEntity<?> assignTeacherToCourse(@Valid @RequestBody AssignTeacherRequest request) {
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", request.getTeacherId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        course.setTeacher(teacher);
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "Teacher assigned to course successfully!"));
    }

    @PostMapping("/course/enroll-student")
    public ResponseEntity<?> enrollStudentInCourse(@Valid @RequestBody EnrollStudentRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        course.getStudents().add(student);
        courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse(true, "Student enrolled in course successfully!"));
    }

    // --- Reporting ---
    @GetMapping("/reports/attendance-all")
    public ResponseEntity<List<AttendanceReportDTO>> getFullAttendanceReport() {
        List<AttendanceReportDTO> report = attendanceRepository.getFullAttendanceReport();
        return ResponseEntity.ok(report);
    }
}