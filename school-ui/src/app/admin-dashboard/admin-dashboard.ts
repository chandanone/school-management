import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  courses: any[] = [];
  selectedCourse: any = {};

  constructor(private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadCourses();
  }

  async loadCourses() {
    try {
      const token = localStorage.getItem('token'); // saved at login

      const response = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ include JWT
        },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');

      this.courses = await response.json();

      this.cd.detectChanges(); // ✅ Force UI refresh
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Unable to load courses');
    }
  }

  openEditModal(course: any) {
    console.log('Edit button clicked for course:', course); // ✅ debug
    this.selectedCourse = { ...course }; // clone course to avoid live editing
  }

  async saveCourse() {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/admin/courses/${this.selectedCourse.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.selectedCourse),
        }
      );

      if (!response.ok) throw new Error('Failed to update course');
      alert('✅ Course updated successfully');
      await this.loadCourses(); // reload list
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error updating course');
    }
  }

  async onDelete(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete course');

      alert('Course deleted successfully');
      await this.loadCourses(); // ✅ refresh the list
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error deleting course');
    }
  }
}
