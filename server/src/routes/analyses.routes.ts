import { Router } from "express";
import {
  approveAnalysisController,
  createAnalysisController,
  getAnalyses,
  getAnalysisFiles,
  getAnalysisFile,
  rejectAnalysisContoller,
  uploadFile,
  deleteAnalysisFile,
  downloadAnalysisFile
} from "../contollers/analysis.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { createAnalysisSchema, rejectAnalysisSchema } from "../schemas/analyses.schema.js";
import { validate } from "../middleware/validate.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  getAnalyses
);

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



router.post(
  "/:id/files",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  upload.single("file"),
  uploadFile
);

router.get(
  "/:id/files",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  getAnalysisFiles
);


router.get(
  "/files/:fileId",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  getAnalysisFile
);


router.delete(
  "/files/:fileId",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  deleteAnalysisFile
);

router.get(
  "/files/:fileId",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  downloadAnalysisFile
);



export default router