import  jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const generateAccessToken = ( userId: number, role: string) => {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
}   