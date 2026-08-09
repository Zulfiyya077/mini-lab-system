import type { Request, Response, NextFunction } from "express";

import { AppError } from "../errors/AppError.js";


export const errorMidddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message, success: false, statusCode: err.statusCode });
    }


    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error", success: false, statusCode: 500 });
};