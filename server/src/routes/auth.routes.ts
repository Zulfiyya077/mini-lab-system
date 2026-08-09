import { Router } from "express";
import { login, register, getMe, logout } from "../contollers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";   
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me",authMiddleware, getMe);
router.post("/logout", logout);


export default router;
