import z from "zod";


export const createAnalysisSchema = z.object({
    patientId: z.coerce.number().int().positive(),
    result: z.string().min(1, "Result is required")
});


export const rejectAnalysisSchema = z.object({
    rejectionReason: z.string().min(3, "Rejection reason must be at 3 character")
})

export const analysisQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    search: z.coerce.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    sortBy: z
        .enum([ "createdAt"])
        .default("createdAt"),
    
      sortOrder: z
        .enum(["asc", "desc"])
        .default("desc"),
})