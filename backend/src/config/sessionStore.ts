import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import dotenv from "dotenv";

dotenv.config();

const PgSession = connectPgSimple(session);

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: "user_sessions",
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
});
