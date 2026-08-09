import { Router } from "express";
import { getPatients, createPatientController, getPatientByIdController, updatePatientController, deletePatientController} from "../contollers/patient.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import  {patientSchema, updatePatientSchema } from "../schemas/patient.schema.js";


const router = Router();


router.get("/", getPatients);
router.post("/", validate(patientSchema), createPatientController);
router.get("/:id", getPatientByIdController);
router.patch("/:id", validate(updatePatientSchema),updatePatientController);
router.delete("/:id", deletePatientController);


export default router;