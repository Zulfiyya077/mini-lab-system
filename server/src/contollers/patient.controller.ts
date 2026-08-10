import type { Request, Response } from "express";
import * as patientService from "../services/patient.service.js";
import { AppError } from "../errors/AppError.js";
import { patientPaginationSchema } from "../schemas/patient.schema.js";
export const getPatients = async (
    req: Request,
    res: Response
) => {
    const search = req.query.search as string | undefined;

const query = patientPaginationSchema.parse(req.query);
 
const result = await patientService.getPatientsService(query);

    res.status(200).json({
        data: result.patients,
        success: true,
        meta: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        },
    });
};
export const createPatientController = async (
    req: Request,
    res: Response
) => {
    const { firstName, lastName, phone } = req.body;

    const newPatient = await patientService.createPatient({
        firstName,
        lastName,
        phone,
    });

    res.status(201).json({
        data: newPatient,
        success: true,
        statusCode: 201,
    });
};

export const getPatientByIdController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        throw new AppError("Invalid patient ID", 400);
    }

    const patient = await patientService.getPatientById(id);

    if (!patient) {
        throw new AppError("Patient not found", 404);
    }

    res.status(200).json({
        data: patient,
        success: true,
        statusCode: 200,
    });
};

export const updatePatientController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        throw new AppError("Invalid patient ID", 400);
    }

    const updatedPatient = await patientService.updatePatient(
        id,
        req.body
    );

    if (!updatedPatient) {
        throw new AppError("Patient not found", 404);
    }

    res.status(200).json({
        data: updatedPatient,
        success: true,
        statusCode: 200,
    });
};

export const deletePatientController = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        throw new AppError("Invalid patient ID", 400);
    }

    const deleted = await patientService.deletePatient(id);

    if (!deleted) {
        throw new AppError("Patient not found", 404);
    }

    res.status(204).send();
};