import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

const adminService = new AdminService();

export class AdminController {
  static async signup(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const admin = await adminService.signup(username, password);
      res.status(201).json({ message: "Admin created successfully", admin });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await adminService.login(username, password);
      res.json({ message: "Logged in successfully", token });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }

  static async createCourse(req: Request, res: Response) {
    try {
      const course = await adminService.createCourse(req.body);
      res.status(201).json({ message: "Course created", course });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      const course = await adminService.updateCourse(
        parseInt(req.params.courseId!),
        req.body
      );
      res.json({ message: "Course updated", course });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      await adminService.deleteCourse(parseInt(req.params.courseId!));
      res.json({ message: "Course deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getCourses(req: Request, res: Response) {
    try {
      const courses = await adminService.getCourses();
      res.json(courses);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
