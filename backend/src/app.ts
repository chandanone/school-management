import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes";
import studentRoutes from "./routes/studentRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

// app.use("/favicon.ico");

export default app;
