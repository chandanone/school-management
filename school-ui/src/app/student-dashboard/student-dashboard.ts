import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard {
  courses: any[] = [];

  async ngOnInit() {
    await this.loadCourses();
  }

  async loadCourses() {
    try {
      const token = localStorage.getItem('token'); // saved at login
      console.log(token);
      const response = await fetch('http://localhost:5000/api/student/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ include JWT
        },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');

      this.courses = await response.json();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Unable to load courses');
    }
  }
}
