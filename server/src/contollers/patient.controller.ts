import type { Request, Response } from "express";

import { getAllPatients, createPatient, getPatientById, updatePatient, deletePatient} from "../services/patient.service.js";    

export const getPatients = (req: Request, res: Response) => {
   console.log("Fetching all patients...");
    const patients = getAllPatients();
    res.json(patients);
}   

export const createPatientController = (req: Request, res: Response) => {
    const { firstName, lastName, phone } = req.body;        
    if (!firstName || !lastName || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }   

    const newPatient = createPatient({ firstName, lastName, phone });
    res.status(201).json(newPatient);
}


export const getPatientByIdController = (req: Request, res: Response) => {
    const id = Number(req.params.id); 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }   
    const patient = getPatientById(id);
    if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
}


export const updatePatientController = (req: Request, res: Response) => {
    const id = Number(req.params.id);   
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }   
    const updatedPatient = updatePatient(id, req.body);

    if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
    }
    res.json(updatedPatient);
};  

export const deletePatientController = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }
    const success = deletePatient(id);
    if (!success) {
        return res.status(404).json({ error: "Patient not found" });
    }
    res.status(204).send();
}