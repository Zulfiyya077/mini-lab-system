import type { Request, Response, NextFunction } from "express";
import jwt, { type Jwt } from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}   

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;  

    if (!token) {
        return res.status(401).json({ error: "Access token is missing", success: false, statusCode: 401 });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;

        next();
    } catch (err) {
        console.error("Token verification failed:", err);
       throw new AppError("Invalid access token", 401);
    }
};
