import {z} from "zod";

export const patientSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phone: z.string().min(10, "Phone number is required")
});

export const updatePatientSchema = z.object({
    firstName: z.string().min(2, "First name is required").optional(),
    lastName: z.string().min(2, "Last name is required").optional(),
    phone: z.string().min(10, "Phone number is required").optional()
});

