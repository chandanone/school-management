import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  routerLinkDashboard = '/dashboard'; // default
  username = '';

  constructor(private router: Router) {
    // Get user info from localStorage
    const role = localStorage.getItem('role');
    this.username = localStorage.getItem('loginuser') || '';

    if (role === 'admin') {
      this.routerLinkDashboard = '/admin-dashboard'; // admin dashboard
    } else if (role === 'student') {
      this.routerLinkDashboard = '/student-dashboard'; // student dashboard
    }
  }

  onLogout() {
    // Clear localStorage/session and redirect to login
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
