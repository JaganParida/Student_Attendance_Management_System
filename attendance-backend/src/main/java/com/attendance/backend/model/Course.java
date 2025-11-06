package com.attendance.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"teacher", "students"}) // Prevent recursion
@ToString(exclude = {"teacher", "students"}) // Prevent recursion
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String courseCode;

    @ManyToOne(fetch = FetchType.EAGER) // Eager fetch for simple display
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToMany(fetch = FetchType.EAGER) // Eager fetch for simple display
    @JoinTable(name = "course_student",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private Set<Student> students = new HashSet<>();

    public Course(String name, String courseCode) {
        this.name = name;
        this.courseCode = courseCode;
    }
}