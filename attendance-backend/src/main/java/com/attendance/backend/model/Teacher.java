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
@Table(name = "teachers")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = "courses") // Prevent recursion
@ToString(exclude = "courses") // Prevent recursion
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String facultyIdNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Important: Prevents infinite loop
    private Set<Course> courses = new HashSet<>();

    public Teacher(String facultyIdNumber, User user) {
        this.facultyIdNumber = facultyIdNumber;
        this.user = user;
    }
}