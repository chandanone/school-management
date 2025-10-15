import { Request, Response } from "express";
import { StudentService } from "../services/StudentService";
import { JwtPayload } from "jsonwebtoken";

const studentService = new StudentService();

export class StudentController {
  static async signup(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const student = await studentService.signup(username, password);
      res
        .status(201)
        .json({ message: "Student created successfully", student });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await studentService.login(username, password);
      res.json({ message: "Logged in successfully", token });
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  }

  static async getCourses(req: Request, res: Response) {
    try {
      const courses = await studentService.getPublishedCourses();
      res.json(courses);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async purchaseCourse(req: Request, res: Response) {
    try {
      const username = (req.user as JwtPayload)?.username; // from JWT middleware
      const courseId = req.params.courseId
        ? parseInt(req.params.courseId, 10)
        : NaN;

      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      await studentService.enrollCourse(username, courseId);
      res.json({ message: "Course purchased successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  // static async getPurchasedCourses(req: Request, res: Response) {
  //   try {
  //     const username = (req.user as JwtPayload)?.username;
  //     const courses = await studentService.getPurchasedCourses(username);
  //     res.json(courses);
  //   } catch (err: any) {
  //     res.status(400).json({ error: err.message });
  //   }
  // }
}
