export const ROLES = {
    ADMIN: "ADMIN",
    LAB_TECHNICIAN: "LAB_TECHNICIAN",
    LAB_DOCTOR: "LAB_DOCTOR",
    LAB_MANAGER: "LAB_MANAGER"
}  as const;


export type Role = typeof ROLES[keyof typeof ROLES];


