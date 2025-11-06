package com.attendance.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = "courses") // Prevent recursion
@ToString(exclude = "courses") // Prevent recursion
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentIdNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToMany(mappedBy = "students", fetch = FetchType.LAZY)
    @JsonIgnore // Important: Prevents infinite loop in JSON serialization
    private Set<Course> courses = new HashSet<>();

    public Student(String studentIdNumber, User user) {
        this.studentIdNumber = studentIdNumber;
        this.user = user;
    }
}