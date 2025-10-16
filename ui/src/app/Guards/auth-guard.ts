// src/app/Guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('loginuser');

  if (user) {
    return true; // ✅ user is logged in
  } else {
    router.navigateByUrl('/login'); // 🚫 redirect if not logged in
    return false;
  }
};
