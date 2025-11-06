# 🎓 Student Attendance Management System

A **Full Stack, Role-Based Web Application** built using **Spring Boot (Backend)** and **Angular 17 (Frontend)**.  
This system modernizes the traditional attendance process by providing a **secure, centralized, and easy-to-use platform** for administrators, teachers, and students.

---

## 📸 Key Features

### 🔑 1. Public-Facing & Authentication
- **Modern Landing Page:** Clean, professional design with a sticky navbar and hero section.  
- **Role-Based Login:** Single login page that redirects users automatically based on their role.  
- **Secure API:** Backend endpoints protected by **Spring Security + JWT (JSON Web Tokens)**.  
- **Protected Frontend:** Angular routes secured using **auth guards** and **role guards**.  

---

### 🧑‍💼 2. Admin Module (`ROLE_ADMIN`)
- **Dashboard:** Real-time statistics for Total Students, Total Teachers, and Total Courses.  
- **Full CRUD Management:**
  - 👩‍🎓 Students  
  - 👨‍🏫 Teachers  
  - 📘 Courses  
- **Relational Management:**  
  - Assign teachers to courses.  
  - Enroll students in multiple courses.  
- **Intuitive Popups:** Manage relationships with clean, responsive modal dialogs.

---

### 🧑‍🏫 3. Teacher Module (`ROLE_TEACHER`)
- **Dashboard:** View assigned courses and enrolled student counts.  
- **My Courses Page:** Interactive course list with smart action buttons.  
- **Smart Attendance Logic:**
  - "Take Attendance" or "Manage Attendance" appears automatically.  
  - Prevents marking **future dates**.  
  - Locks attendance older than **24 hours**.  
- **Take/Manage Attendance UI:**
  - Mark students as **Present**, **Absent**, or **Late**.  
  - Auto-load existing data for selected date.  
- **Reports:**
  - Detailed attendance logs per course.  
  - **Pie Chart visualization** (via `ngx-charts`) for Present/Absent/Late distribution.

---

### 🎓 4. Student Module (`ROLE_STUDENT`)
- **Dashboard:** Displays Total Enrolled Courses and Overall Attendance %.  
- **My Enrolled Courses:** Card-based layout showing each course and its assigned teacher.  
- **Attendance Record Page:**
  - Summary card with percentage and counts (Present, Absent, Late).  
  - Detailed table listing all attendance records per course.  

---

### 👤 5. Common Profile Page
- **My Profile:** Shared across all roles.  
- **View Profile:** Displays name, email, and assigned roles.  
- **Change Password:** Secure password update with visibility toggle (eye icon).  

---

## 🛠️ Technology Stack

### 🧩 Backend
| Component | Technology |
|------------|-------------|
| Framework | Spring Boot 3 |
| Security | Spring Security (JWT) |
| ORM | Spring Data JPA (Hibernate) |
| Database | MySQL |
| Language | Java 17+ |
| Build Tool | Maven |

### 💻 Frontend
| Component | Technology |
|------------|-------------|
| Framework | Angular 17+ (Standalone Components) |
| Language | TypeScript |
| UI Library | Angular Material |
| Charts | @swimlane/ngx-charts |
| Routing | Angular Router with Guards |
| Styling | CSS (Flexbox & Grid) |

---

## 🚀 How to Run the Project

You must start the **Backend Server** first, then the **Frontend Server**.

---

### ✅ Prerequisites
- **Java 17+ (JDK)**  
- **Node.js 18+** and **npm**  
- **Angular CLI:**  
  ```bash
  npm install -g @angular/cli
