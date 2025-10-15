import { pool } from "../config/db";

export interface Course {
  id?: number;
  title: string;
  description: string;
  price: number;
  published: boolean;
}
