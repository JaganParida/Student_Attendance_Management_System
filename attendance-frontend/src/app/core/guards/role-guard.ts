import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// This is a "factory function" that creates a guard
export function roleGuard(expectedRole: string): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasRole(expectedRole)) {
      return true; // User has the required role, allow access
    } else {
      // User does not have the role, redirect to dashboard
      console.warn(`Access denied. User does not have role: ${expectedRole}`);
      router.navigate(['/dashboard']); 
      return false;
    }
  };
}