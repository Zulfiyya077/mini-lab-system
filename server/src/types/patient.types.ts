export type PatientQuery = {
    page: number,
    limit: number,
    search?: string | undefined,
    sortBy: "firstName" | "createdAt",
    sortOrder: "asc" | "desc",
    status?: "ACTIVE" | "INACTIVE" | undefined
}