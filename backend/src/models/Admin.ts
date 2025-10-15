import { pool } from "../config/db";

export interface Admin {
  id?: number;
  username: string;
  password: string;
}
