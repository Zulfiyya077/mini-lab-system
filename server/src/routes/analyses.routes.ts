import { Router } from "express";
import { approveAnalysisController, createAnalysisController, rejectAnalysisContoller } from "../contollers/analysis.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { createAnalysisSchema, rejectAnalysisSchema } from "../schemas/analyses.schema.js";
import { validate } from "../middleware/validate.middleware.js";



const router = Router();

router.post("/",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
    validate(createAnalysisSchema),
    createAnalysisController
)

router.patch(
    "/:id/approve",
    authMiddleware,
    authorize("LAB_DOCTOR"),
    approveAnalysisController
);


router.patch("/:id/reject",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR"),
    validate(rejectAnalysisSchema),
    rejectAnalysisContoller
)
export default router