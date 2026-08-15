import { Router } from "express";
import { login, register, getMe, logout } from "../contollers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";   
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { approveAnalysisController } from "../contollers/analysis.controller.js";


const router = Router();

router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and sets an access token cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aysel@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Test12345
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Validation error
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);


router.post("/login", validate(loginSchema), login);
router.get("/me",authMiddleware, getMe);
router.post("/logout", logout);
router.patch("/:id/approve", authMiddleware, authorize("ADMIN","LAB_DOCTOR"), approveAnalysisController)

router.get("/doctor-only",authMiddleware, authorize("LAB_DOCTOR"), (req, res) => {  
    res.json({ message: "Access granted to LAB_DOCTOR", success: true, statusCode: 200 });
}
);


export default router;
