import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ best practice for standalone components
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

  async onSignUp() {
    // simple validation before sending request
    if (!this.userObj.username || !this.userObj.email || !this.userObj.password) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.userObj),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Sign-up failed');
      }

      alert('Registration successful! Please log in.');
      this.router.navigateByUrl('/login'); // ✅ use slash for clarity
    } catch (error: any) {
      console.error('Signup error:', error);
      // alert(error.message || 'Sign-up failed. Please try again.');
    }
  }
}
