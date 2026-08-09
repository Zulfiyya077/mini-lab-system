import { prisma } from "../lib/prisma.js";


export const getPatients = async () => {
    return prisma.patient.findMany();
    orderBy: { id: "asc" }
}
export const createPatient = async (patient: { firstName: string; lastName: string; phone: string }) => {
    return prisma.patient.create({
        data: patient
    });
}


export const getPatientById = async (id: number) => {
    return prisma.patient.findUnique({
        where: { id }
    });
};

export const updatePatient = async (    
    id: number,
    updatedPatient: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }
) => {
    const patient = await prisma.patient.findUnique({
        where: { id }
    });

    if (!patient) return null;

    if (updatedPatient.firstName !== undefined) {
        patient.firstName = updatedPatient.firstName;
    }

    if (updatedPatient.lastName !== undefined) {
        patient.lastName = updatedPatient.lastName;
    }

    if (updatedPatient.phone !== undefined) {
        patient.phone = updatedPatient.phone;
    }

    return patient;
};

export const deletePatient = async (id: number) => {
    const patient = await prisma.patient.findUnique({
        where: { id }
    });

    if (!patient) return null;

    return prisma.patient.delete({
        where: { id }
    });
};