import { AppError } from "../errors/AppError.js";
import { prisma } from "../lib/prisma.js";

export const createAnalysis = async (
    patientId: number,
    createdBy: number,
    result?: string
) => {
    return prisma.analysis.create({
        data: {
            patientId,
            createdBy,
            ...(result !== undefined && { result })
        }
    })
}

export const approveAnalysis = async (
    analysisId: number,
    reviewedBy: number) => {
    const analysis = await prisma.analysis.findUnique({
        where: {
            id: analysisId
        }
    });

    if (!analysis) {
        throw new AppError("Analysis not found", 404)
    }

    if (analysis.status !== "PENDING") {
        throw new AppError(
            "Only pending analyses can be approved", 400
        );
    }

    return prisma.analysis.update({
        where: {
            id: analysisId,
        },
        data: {
            status: "APPROVED",
            reviewedBy,
            reviewedAt: new Date()
        }
    });

}

export const rejectAnalysis = async (
    analysisId: number,
    rejectedBy: number,
    rejectionReason: string
) => {

    const analysis = await prisma.analysis.findUnique({
        where: {
            id: analysisId
        }
    });


    if (!analysis) {
        throw new AppError("Analysis is not found", 404)
    }

    if (analysis.status !== "PENDING") {
        throw new AppError("Only pending analyses can be rejected", 400)
    }

    return prisma.analysis.update({
        where: {
            id: analysisId
        },
        data: {
            status: "REJECTED",
            rejectionReason,
            reviewedBy: rejectedBy,
            reviewedAt: new Date()

        }
    })

}