import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import type { Role } from "../constants/roles.js";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        "User information is missing in the request",
        401
      );
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
};