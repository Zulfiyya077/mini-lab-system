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


/**
 * @swagger
 * /api/analyses:
 *   get:
 *     summary: Get all analyses
 *     description: Returns all laboratory analyses.
 *     tags:
 *       - Analyses
 *     security:
 *       - accessToken: []
 *     responses:
 *       200:
 *         description: Successfully returned analyses
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 */
router.get(
    "/",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
    getAnalyses
);


/**
 * @swagger
 * /api/analyses:
 *   post:
 *     summary: Create a new analysis
 *     tags:
 *       - Analyses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - result
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 2
 *               result:
 *                 type: string
 *                 example: Blood test result
 *     responses:
 *       201:
 *         description: Analysis created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */


router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  validate(createAnalysisSchema),
  createAnalysisController
);

/**
 * @swagger
 * /api/analyses/{id}/approve:
 *   patch:
 *     summary: Approve an analysis
 *     description: Approves a laboratory analysis.
 *     tags:
 *       - Analyses
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Analysis approved successfully
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Analysis not found
 */

router.patch(
  "/:id/approve",
  authMiddleware,
  authorize("LAB_DOCTOR"),
  approveAnalysisController
);


/**
 * @swagger
 * /api/analyses/{id}/reject:
 *   patch:
 *     summary: Reject an analysis
 *     description: Rejects a pending laboratory analysis with a rejection reason.
 *     tags:
 *       - Analyses
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 example: Sample quality is insufficient
 *     responses:
 *       200:
 *         description: Analysis rejected successfully
 *       400:
 *         description: Analysis cannot be rejected
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Analysis not found
 */


router.patch("/:id/reject",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR"),
    validate(rejectAnalysisSchema),
    rejectAnalysisContoller
)

/**
 * @swagger
 * /api/analyses/{id}/files:
 *   post:
 *     summary: Upload a file to an analysis
 *     description: Uploads a file and attaches it to a laboratory analysis.
 *     tags:
 *       - Analysis Files
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file or analysis ID
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Analysis not found
 */

router.post(
  "/:id/files",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  upload.single("file"),
  uploadFile
);

/**
 * @swagger
 * /api/analyses/{id}/files:
 *   get:
 *     summary: Get all files of an analysis
 *     description: Returns all files attached to a laboratory analysis.
 *     tags:
 *       - Analysis Files
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Files returned successfully
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: Analysis not found
 */
router.get(
    "/:id/files",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
    getAnalysisFiles
);


/**
 * @swagger
 * /api/analyses/files/{fileId}:
 *   get:
 *     summary: Get an analysis file
 *     description: Returns a single analysis file.
 *     tags:
 *       - Analysis Files
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: File returned successfully
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: File not found
 */

router.get(
    "/files/:fileId",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
    getAnalysisFile
);

/**
 * @swagger
 * /api/analyses/files/{fileId}:
 *   delete:
 *     summary: Delete an analysis file
 *     description: Deletes an analysis file from storage and database.
 *     tags:
 *       - Analysis Files
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: File not found
 */

router.delete(
    "/files/:fileId",
    authMiddleware,
    authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
    deleteAnalysisFile
);


/**
 * @swagger
 * /api/analyses/files/{fileId}/download:
 *   get:
 *     summary: Download an analysis file
 *     description: Downloads a laboratory analysis file.
 *     tags:
 *       - Analysis Files
 *     security:
 *       - accessToken: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       401:
 *         description: Access token is missing or invalid
 *       403:
 *         description: User does not have permission
 *       404:
 *         description: File not found
 */
router.get(
  "/files/:fileId/download",
  authMiddleware,
  authorize("ADMIN", "LAB_DOCTOR", "LAB_TECHNICIAN"),
  downloadAnalysisFile
);


export default router