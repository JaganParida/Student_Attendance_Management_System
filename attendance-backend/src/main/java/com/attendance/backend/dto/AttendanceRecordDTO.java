// File: src/main/java/com/attendance/backend/dto/AttendanceRecordDTO.java
package com.attendance.backend.dto;
import com.attendance.backend.model.AttendanceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class AttendanceRecordDTO {
    @NotNull private Long studentId;
    @NotNull private AttendanceStatus status;
}