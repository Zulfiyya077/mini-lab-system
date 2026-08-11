export type AnalysesQuery = {
    page: number,
    limit: number,
    search?: string | undefined,
    sortBy: "createdAt",
    sortOrder: "asc" | "desc",
    status?: "PENDING" | "APPROVED" | "REJECTED" | undefined
}