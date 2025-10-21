import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ Role-based route protection
    const expectedRole = route.data['expectedRole'];

    if (expectedRole && role !== expectedRole) {
      alert('Access denied: insufficient permissions.');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
