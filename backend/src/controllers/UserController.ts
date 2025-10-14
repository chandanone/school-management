import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
  static async getAll(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    res.json(users);
  }

  static async create(req: Request, res: Response) {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }
}
