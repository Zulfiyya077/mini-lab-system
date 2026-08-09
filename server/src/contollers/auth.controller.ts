import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { Result } from "pg";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;


    const user = await authService.registerUser(name, email, password);
    res.status(201).json({ data: user, success: true, statusCode: 201 });
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.json({ data: result.user, success: true, statusCode: 200 });
}

export const getMe = async (req: Request, res: Response) => {
   
    res.json({ data: req.user, success: true, statusCode: 200 });
}   

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logged out successfully", success: true, statusCode: 200 });
}
