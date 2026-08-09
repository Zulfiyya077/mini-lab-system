import { Router } from "express";
import { register } from "../contollers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema } from "../schemas/auth.schema.js";   

const router = Router();

router.post("/register", validate(registerSchema), register);

export default router;