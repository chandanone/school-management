// src/server.ts
import dotenv from "dotenv";
import app from "./app"; // ✅ import your configured app with routes

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
