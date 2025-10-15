import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { GenericRepository } from "../repositories/GenericRepository";

const SECRET_KEY = process.env.SECRET_KEY!;

export class StudentService {
  async signup(username: string, password: string) {
    const client = await pool.connect();
    try {
      const studentRepo = new GenericRepository<any>(client, "students");

      // Check if student already exists
      const existing = await studentRepo.getFiltered([
        { column: "username", operator: "=", value: username },
      ]);

      if (existing.length > 0) {
        throw new Error("Student already exists");
      }

      // Insert new student
      await studentRepo.insert({ username, password });
      return { message: "Student created successfully" };
    } finally {
      client.release();
    }
  }

  async login(username: string, password: string) {
    const client = await pool.connect();
    try {
      const studentRepo = new GenericRepository<any>(client, "students");
      const result = await studentRepo.getFiltered([
        { column: "username", operator: "=", value: username },
      ]);

      const student = result[0];
      if (!student || student.password !== password) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ username, role: "student" }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return { message: "Logged in successfully", token };
    } finally {
      client.release();
    }
  }

  async getPublishedCourses() {
    const client = await pool.connect();
    try {
      const courseRepo = new GenericRepository<any>(client, "courses");
      return await courseRepo.getFiltered([
        { column: "published", operator: "=", value: true },
      ]);
    } finally {
      client.release();
    }
  }

  async enrollCourse(username: string, courseId: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const studentRepo = new GenericRepository<any>(client, "students");
      const enrollmentRepo = new GenericRepository<any>(client, "enrollments");
      const courseRepo = new GenericRepository<any>(client, "courses");

      // Get student
      const student = (
        await studentRepo.getFiltered([
          { column: "username", operator: "=", value: username },
        ])
      )[0];

      if (!student) throw new Error("Student not found");

      //check course published
      const publishedCourses = await courseRepo.getFiltered([
        { column: "id", operator: "=", value: courseId },
      ]);

      if (publishedCourses.length > 0) {
        throw new Error("Already enrolled in this course");
      }

      if (publishedCourses.length == 0) {
        throw new Error("Course not yet published or not found");
      }
      // Check if already enrolled
      const existingEnrollment = await enrollmentRepo.getFiltered([
        { column: "student_id", operator: "=", value: student.id },
        { column: "course_id", operator: "=", value: courseId },
      ]);

      if (existingEnrollment.length > 0) {
        throw new Error("Student already enrolled in this course");
      }

      // Insert new enrollment
      await enrollmentRepo.insert({
        student_id: student.id,
        course_id: courseId,
      });

      await client.query("COMMIT");
      return { message: "Course enrolled successfully" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getEnrolledCourses(username: string) {
    const client = await pool.connect();
    try {
      const studentRepo = new GenericRepository<any>(client, "students");
      const student = (
        await studentRepo.getFiltered([
          { column: "username", operator: "=", value: username },
        ])
      )[0];

      if (!student) throw new Error("Student not found");

      const query = `
        SELECT c.*
        FROM courses c
        JOIN enrollments e ON c.id = e.course_id
        WHERE e.student_id = $1
      `;
      const { rows } = await client.query(query, [student.id]);
      return rows;
    } finally {
      client.release();
    }
  }
}
