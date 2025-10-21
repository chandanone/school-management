import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any; // Needed for modal programmatic control

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  courses: any[] = [];
  selectedCourse: any = {}; // for edit
  newCourse: any = { title: '', description: '', price: 0 }; // for add

  constructor(private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadCourses();
  }

  // ✅ Load all courses
  async loadCourses() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      this.courses = await response.json();
      this.cd.detectChanges();
    } catch (error: any) {
      alert(error.message || 'Unable to load courses');
    }
  }

  // ✅ Open Edit Modal
  openEditModal(course: any) {
    this.selectedCourse = { ...course };
    const modalEl = document.getElementById('editCourseModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // ✅ Open Add Modal
  openAddModal() {
    this.newCourse = { title: '', description: '', price: 0 };
    const modalEl = document.getElementById('addCourseModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // ✅ Save edited course
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
      alert('Course updated successfully');
      await this.loadCourses();

      // Close modal
      const modalEl = document.getElementById('editCourseModal');
      bootstrap.Modal.getInstance(modalEl)?.hide();
    } catch (error: any) {
      alert(error.message || 'Error updating course');
    }
  }

  // ✅ Add new course
  async addCourse() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.newCourse),
      });
      if (!response.ok) throw new Error('Failed to add course');
      alert('Course added successfully');
      await this.loadCourses();

      const modalEl = document.getElementById('addCourseModal');
      bootstrap.Modal.getInstance(modalEl)?.hide();
    } catch (error: any) {
      alert(error.message || 'Error adding course');
    }
  }

  // ✅ Delete course
  async onDelete(id: number) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete course');
      alert('Course deleted successfully');
      await this.loadCourses();
    } catch (error: any) {
      alert(error.message || 'Error deleting course');
    }
  }
}
