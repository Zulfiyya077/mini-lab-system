import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;


    const user = await authService.registerUser(name, email, password);
    res.status(201).json({ data: user, success: true, statusCode: 201 });
}