import { Result } from "pg";
import z from "zod";


export const createAnalysisSchema = z.object({
    patientId: z.coerce.number().int().positive(),
    result: z.string().min(1, "Result is required")
});


export const rejectAnalysisSchema = z.object({
    rejectionReason: z.string().min(3, "Rejection reason must be at 3 character")
})