import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  routerLinkDashboard = '/student-dashboard'; // default
  username = '';

  constructor(private router: Router) {
    // Get user info from localStorage
    const role = localStorage.getItem('role');

    if (role === 'admin') {
      this.routerLinkDashboard = '/admin-dashboard'; // admin dashboard
    } else if (role === 'student') {
      this.routerLinkDashboard = '/student-dashboard'; // student dashboard
    }
  }

  openNav() {
    const sidenav = document.getElementById('mySidenav');
    const main = document.getElementById('main');
    if (sidenav && main) {
      sidenav.style.width = '250px';
      main.style.marginLeft = '250px';
    }
  }

  closeNav() {
    const sidenav = document.getElementById('mySidenav');
    const main = document.getElementById('main');
    if (sidenav && main) {
      sidenav.style.width = '0';
      main.style.marginLeft = '0';
    }
  }
}
