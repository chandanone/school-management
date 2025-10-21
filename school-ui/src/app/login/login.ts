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
  userObj = {
    username: '',
    password: '',
    role: '',
  };

  router = inject(Router);
  async onLogin() {
    // if (this.userObj.email == 'admin@gmail.com' && this.userObj.password == '1234') {
    //   //alert('login successful');
    //   localStorage.setItem('loginuser', this.userObj.email);
    //   this.router.navigateByUrl('dashboard');
    // } else {
    //   alert('Incorrect Email and Password');
    // }

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.userObj),
      });

      const result = await response.json();
      const userData = result.token;

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Save user or token in localStorage
      localStorage.setItem('loginuser', userData.username || this.userObj.username);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('token', userData.token);

      // ✅ Display welcome message
      alert(`Welcome, ${userData.username}!`);
      // Redirect after login
      //this.router.navigateByUrl('dashboard');

      // ✅ Redirect based on role
      if (userData.role === 'admin') {
        this.router.navigateByUrl('admin-dashboard');
      } else {
        this.router.navigateByUrl('student-dashboard');
      }
    } catch (error: any) {
      alert(error.message || 'Unable to login. Plz try again');
    }
  }
}
