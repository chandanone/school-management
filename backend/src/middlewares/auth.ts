import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;
export interface AuthRequest extends Request {
  user?: JwtPayload & { role?: string; username?: string };
}

export const authenticateJwt = (role?: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Authorization header missing
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
        role?: string;
        username?: string;
      };

      // ✅ Optional role check
      if (role && decoded.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
