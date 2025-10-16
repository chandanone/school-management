import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);

  userObj = {
    username: '',
    password: '',
  };

  // onLogin() {
  //   if (this.userObj.username == 'super_admin' && this.userObj.password == '12345') {
  //     localStorage.setItem('loginuser', this.userObj.username);
  //     this.router.navigateByUrl('dashboard1');
  //   } else {
  //     alert('Username and Password incorrect.');
  //   }
  async onLogin() {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.userObj),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Save user or token in localStorage
      localStorage.setItem('loginuser', result.username || this.userObj.username);
      localStorage.setItem('token', result.token);

      // Redirect after login
      this.router.navigateByUrl('dashboard1');
    } catch (error: any) {
      alert(error.message || 'Unable to login. Please try again.');
    }
  }
}
