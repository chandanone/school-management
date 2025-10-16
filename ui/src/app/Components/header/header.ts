import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  router = inject(Router);
  onSignout() {
    localStorage.removeItem('loginuser');
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
