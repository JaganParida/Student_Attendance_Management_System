package com.attendance.backend.repository;

import com.attendance.backend.model.Attendance;
import com.attendance.backend.dto.AttendanceReportDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByCourseIdAndDate(Long courseId, LocalDate date);
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);

    // --- REPORTING METHODS ---
    @Query("SELECT new com.attendance.backend.dto.AttendanceReportDTO( " +
            "a.id, a.date, a.status, s.id, u.name, s.studentIdNumber, c.id, c.name) " +
            "FROM Attendance a " +
            "JOIN a.student s " +
            "JOIN s.user u " +
            "JOIN a.course c")
    List<AttendanceReportDTO> getFullAttendanceReport();

    @Query("SELECT new com.attendance.backend.dto.AttendanceReportDTO( " +
            "a.id, a.date, a.status, s.id, u.name, s.studentIdNumber, c.id, c.name) " +
            "FROM Attendance a " +
            "JOIN a.student s " +
            "JOIN s.user u " +
            "JOIN a.course c " +
            "WHERE c.id = :courseId")
    List<AttendanceReportDTO> getFullAttendanceReportForCourse(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.course.id = :courseId AND a.status = com.attendance.backend.model.AttendanceStatus.PRESENT")
    long countPresent(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.course.id = :courseId AND a.status = com.attendance.backend.model.AttendanceStatus.ABSENT")
    long countAbsent(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.course.id = :courseId AND a.status = com.attendance.backend.model.AttendanceStatus.LATE")
    long countLate(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT DISTINCT a.course.id FROM Attendance a WHERE a.course.teacher.id = :teacherId AND a.date = :date")
    List<Long> findCourseIdsWithAttendanceByTeacherAndDate(@Param("teacherId") Long teacherId, @Param("date") LocalDate date);
}