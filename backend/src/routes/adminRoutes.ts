import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authenticateJwt } from "../middlewares/auth";

const router = Router();

// Admin signup & login (public)
router.post("/signup", AdminController.signup);
router.post("/login", AdminController.login);

// Protected routes (require admin)
router.post("/courses", authenticateJwt("admin"), AdminController.createCourse);
router.put(
  "/courses/:courseId",
  authenticateJwt("admin"),
  AdminController.updateCourse
);
router.delete(
  "/courses/:courseId",
  authenticateJwt("admin"),
  AdminController.deleteCourse
);
router.get("/courses", authenticateJwt("admin"), AdminController.getCourses);

export default router;
