import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  router = inject(Router);

  userObj = {
    username: '',
    email: '',
    password: '',
  };

  // onLogin() {
  //   if (this.userObj.username == 'super_admin' && this.userObj.password == '12345') {
  //     localStorage.setItem('loginuser', this.userObj.username);
  //     this.router.navigateByUrl('dashboard1');
  //   } else {
  //     alert('Username and Password incorrect.');
  //   }
  async onSignUp() {
    try {
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.userObj),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Redirect after login
      this.router.navigateByUrl('login');
    } catch (error: any) {
      alert(error.message || 'Sign-Up failed. Please try again.');
    }
  }
}
