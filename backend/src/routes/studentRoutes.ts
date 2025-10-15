import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { authenticateJwt } from "../middlewares/auth";

const router = Router();

// Student signup & login (public)
router.post("/signup", StudentController.signup);
router.post("/login", StudentController.login);

// Protected routes (require student)
router.get(
  "/courses",
  authenticateJwt("student"),
  StudentController.getCourses
);
router.post(
  "/courses/:courseId/purchase",
  authenticateJwt("student"),
  StudentController.purchaseCourse
);

export default router;
