import { AppError } from "../errors/AppError.js";
import type { Prisma } from "../generated/prisma/browser.js";
import { prisma } from "../lib/prisma.js";
import type { AnalysesQuery } from "../types/analyses.types.js";
import path from "path";
import fs from "fs/promises";
export const createAnalysis = async (
    patientId: number,
    createdBy: number,
    result?: string
) => {
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
    });

    if (!patient) {
        throw new AppError("Patient not found", 404);
    }

    return prisma.analysis.create({
        data: {
            patientId,
            createdBy,
            result: result ?? null,
        },
    });
};

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


export const getAnalysesService = async (
    query: AnalysesQuery,
    user: {
        id: number;
        role: "LAB_DOCTOR" | "ADMIN" | "LAB_TECHNICIAN";
    }
) => {
    const {
        page,
        limit,
        search,
        status,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.AnalysisWhereInput = {
        ...(status ? { status } : {}),

        ...(search
            ? {
                patient: {
                    OR: [
                        {
                            firstName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
            }
            : {}),
    };

    const [analyses, total] = await Promise.all([
        prisma.analysis.findMany({
            where,
            skip,
            take: limit,
            include: {
                patient: true,

                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },

                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),

        prisma.analysis.count({
            where,
        }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        analyses,
        total,
        totalPages,
        page,
        limit,
    };
};
export const uploadAnalysisFile = async (
    analysisId: number,
    file: Express.Multer.File
) => {
    const analysis = await prisma.analysis.findUnique({
        where: {
            id: analysisId,
        },
    });

    if (!analysis) {
        return null;
    }

    const analysisFile = await prisma.analysisFile.create({
        data: {
            analysisId,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            storageKey: file.path,
        },
    });

    return analysisFile;
};



export const getAnalysisFiles = async (analysisId: number) => {
    const analysis = await prisma.analysis.findUnique({
        where: {
            id: analysisId,
        },
    });

    if (!analysis) {
        return null;
    }

    return prisma.analysisFile.findMany({
        where: {
            analysisId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};


export const getAnalysisFile = async (fileId: number) => {
    return prisma.analysisFile.findUnique({
        where: {
            id: fileId,
        },
    });
};


export const deleteAnalysisFile = async (fileId: number) => {


    const file = await prisma.analysisFile.findUnique({
        where: {
            id: fileId,
        },
    });


    if (!file) {
        return null;
    }

    const filePath = path.resolve(
        process.cwd(),
        file.storageKey
    );


    try {
        await fs.unlink(filePath);


    } catch (error: any) {


        if (error.code !== "ENOENT") {
            throw error;
        }
    }



    const deletedFile = await prisma.analysisFile.delete({
        where: {
            id: fileId,
        },
    });


    return deletedFile;
};
