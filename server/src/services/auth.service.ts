import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";  
import { AppError } from "../errors/AppError.js";



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
    