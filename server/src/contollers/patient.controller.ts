import type { Request, Response } from "express";

import * as patientService from "../services/patient.service.js";
import { AppError } from "../errors/AppError.js";
import { th } from "zod/v4/locales";
import { success } from "zod";

export const getPatients = async (req: Request, res: Response) => {
    console.log("Fetching all patients...");
    const patients = await patientService.getPatients();
    res.json({  data: patients, success: true, statusCode: 200 });
}

export const createPatientController = async (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newPatient = await patientService.createPatient({ firstName, lastName, phone });
    res.status(201).json(newPatient);
}


export const getPatientByIdController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        throw new AppError("Invalid patient ID", 400);
    }
    const patient = await patientService.getPatientById(id);
    if (!patient) {
        throw new AppError("Patient not found", 404);
    }
    res.json({ data: patient, success: true, statusCode: 200 });
}


export const updatePatientController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }
    const updatedPatient = await patientService.updatePatient(id, req.body);

    if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
    }
    res.json({  data: updatedPatient, success: true, statusCode: 204 });
};

export const deletePatientController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }
    const success = await patientService.deletePatient(id);
    if (!success) {
        return res.status(404).json({ error: "Patient not found" });
    }
    res.status(204).send();
}