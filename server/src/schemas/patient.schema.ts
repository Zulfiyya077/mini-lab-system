import { z } from "zod";

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

export const patientPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),
   search: z.string().trim().optional(),

  sortBy: z
    .enum(["firstName", "createdAt"])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
     
     status:  z.enum(["ACTIVE", "INACTIVE"]).optional()

});

export const patientQuerySchema = z.object({
    page: z.coerce.number().int().positive().max(100).default(10),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().optional(),
    sortBy: z.enum(["firstName", "createdAt"]).default("createdAt"),
     sortOrder: z.enum(["asc", "desc"]).default("desc"),

     status:  z.enum(["ACTIVE", "INACTIVE"]).optional()
   

})


