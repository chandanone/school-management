import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  routerLinkDashboard = '/student-dashboard'; // default
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
