import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  
  // --- 1. PUBLIC ROUTES (loads inside PublicLayoutComponent) ---
  {
    path: '',
    loadComponent: () => import('./features/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadComponent: () => import('./features/home/home-page/home-page').then(m => m.HomePageComponent) 
      },
      { 
        path: 'about', 
        loadComponent: () => import('./features/about/about-page/about-page').then(m => m.AboutPageComponent)
      },
    ]
  },

  // --- 2. STANDALONE LOGIN ROUTE (no layout) ---
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },

  // --- 3. PRIVATE APP ROUTES (loads inside LayoutComponent) ---
  // All these routes are prefixed with 'app/'
  {
    path: 'app', // <-- All private routes are now under '/app'
    loadComponent: () => import('./features/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard], // <-- Protects all child routes
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) 
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./features/profile/profile-page/profile-page').then(m => m.ProfilePageComponent)
      },
      
      // Admin Routes
      { 
        path: 'admin-students', 
        loadComponent: () => import('./features/admin/manage-students/manage-students').then(m => m.ManageStudentsComponent),
        canActivate: [roleGuard('ROLE_ADMIN')]
      },
      { 
        path: 'admin-teachers', 
        loadComponent: () => import('./features/admin/manage-teachers/manage-teachers').then(m => m.ManageTeachersComponent),
        canActivate: [roleGuard('ROLE_ADMIN')]
      },
      { 
        path: 'admin-courses', 
        loadComponent: () => import('./features/admin/manage-courses/manage-courses').then(m => m.ManageCoursesComponent),
        canActivate: [roleGuard('ROLE_ADMIN')]
      },

      // Teacher Routes
      { 
        path: 'teacher-courses', 
        loadComponent: () => import('./features/teacher/my-courses/my-courses').then(m => m.MyCoursesComponent),
        canActivate: [roleGuard('ROLE_TEACHER')]
      },
      { 
        path: 'teacher-attendance/:courseId', 
        loadComponent: () => import('./features/teacher/take-attendance/take-attendance').then(m => m.TakeAttendanceComponent),
        canActivate: [roleGuard('ROLE_TEACHER')]
      },
      { 
        path: 'teacher-report/:courseId',
        loadComponent: () => import('./features/teacher/teacher-report/teacher-report').then(m => m.TeacherReportComponent),
        canActivate: [roleGuard('ROLE_TEACHER')]
      },
      
      // Student Routes
      { 
        path: 'student-attendance', 
        loadComponent: () => import('./features/student/my-courses/my-courses').then(m => m.MyCoursesComponent),
        canActivate: [roleGuard('ROLE_STUDENT')]
      },
      { 
        path: 'student-attendance-record/:courseId', 
        loadComponent: () => import('./features/student/my-attendance/my-attendance').then(m => m.MyAttendanceComponent),
        canActivate: [roleGuard('ROLE_STUDENT')]
      },
    ]
  },

  // --- 4. FALLBACK ROUTE ---
  { path: '**', redirectTo: 'home' }
];