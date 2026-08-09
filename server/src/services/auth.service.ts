import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";  
import { AppError } from "../errors/AppError.js";
import { generateAccessToken } from "../utils/jwt.js";



export const registerUser = async (name: string,  email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}   
    

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

  const accessToken = generateAccessToken(user.id, user.role);

    return {
       
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken
    };
}
