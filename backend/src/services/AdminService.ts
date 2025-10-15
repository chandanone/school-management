import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { GenericRepository } from "../repositories/GenericRepository";
import { Course } from "../models/Course";

const SECRET_KEY = process.env.SECRET_KEY!;
if (!SECRET_KEY) throw new Error("❌ SECRET_KEY is not defined in .env");

export class AdminService {
  async signup(username: string, password: string) {
    const client = await pool.connect();
    try {
      const adminRepo = new GenericRepository<any>(client, "admins");

      const existing = await adminRepo.getFiltered([
        { column: "username", operator: "=", value: username },
      ]);

      if (existing.length > 0) throw new Error("Admin already exists");

      await adminRepo.insert({ username, password });

      return { message: "Admin created successfully" };
    } finally {
      client.release();
    }
  }

  async login(username: string, password: string) {
    const client = await pool.connect();
    try {
      const adminRepo = new GenericRepository<any>(client, "admins");
      const admins = await adminRepo.getFiltered([
        { column: "username", operator: "=", value: username },
      ]);

      const admin = admins[0];
      if (!admin || admin.password !== password)
        throw new Error("Invalid credentials");

      const token = jwt.sign({ username, role: "admin" }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return { message: "Logged in successfully", token };
    } finally {
      client.release();
    }
  }

  async getCourses() {
    const client = await pool.connect();
    try {
      const courseRepo = new GenericRepository<Course>(client, "courses");
      return await courseRepo.getAll();
    } finally {
      client.release();
    }
  }

  async createCourse(course: Course) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const courseRepo = new GenericRepository<Course>(client, "courses");

      await courseRepo.insert(course);
      await client.query("COMMIT");

      return { message: "Course created successfully" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updateCourse(id: number, course: Partial<Course>) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const courseRepo = new GenericRepository<Course>(client, "courses");

      await courseRepo.update("id", { id, ...course });
      await client.query("COMMIT");

      return { message: "Course updated successfully" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteCourse(id: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const courseRepo = new GenericRepository<Course>(client, "courses");

      await courseRepo.delete("id", id);
      await client.query("COMMIT");

      return { message: "Course deleted successfully" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
