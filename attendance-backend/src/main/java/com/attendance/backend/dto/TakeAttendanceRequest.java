// File: src/main/java/com/attendance/backend/dto/TakeAttendanceRequest.java
package com.attendance.backend.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class TakeAttendanceRequest {
    @NotNull private Long courseId;
    @NotNull private LocalDate date;
    @NotNull private List<AttendanceRecordDTO> records;
}