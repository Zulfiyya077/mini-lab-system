import { Router } from "express";
import { login, register, getMe, logout } from "../contollers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";   
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { approveAnalysisController } from "../contollers/analysis.controller.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me",authMiddleware, getMe);
router.post("/logout", logout);
router.patch("/:id/approve", authMiddleware, authorize("ADMIN","LAB_DOCTOR"), approveAnalysisController)

router.get("/doctor-only",authMiddleware, authorize("LAB_DOCTOR"), (req, res) => {  
    res.json({ message: "Access granted to LAB_DOCTOR", success: true, statusCode: 200 });
}
);


export default router;
