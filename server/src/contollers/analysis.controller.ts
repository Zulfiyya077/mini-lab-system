import type { Request, Response, NextFunction } from "express";
import { approveAnalysis, createAnalysis, rejectAnalysis } from "../services/analysis.service.js"
import { success } from "zod";
import { AppError } from "../errors/AppError.js";


export const createAnalysisController = async (
    req: Request,
    res: Response
) => {
    const { patientId, result } = req.body;

    const analysis = await createAnalysis(
        Number(patientId),
        req.user!.userId,
        result
    );

    res.status(201).json({
        success: true,
        data: analysis

    })
}


export const approveAnalysisController = async (
    req: Request,
    res: Response
) => {
    const analysisId = Number(req.params.id);

    const analysis = await approveAnalysis(
        analysisId,
        req.user!.userId
    );
    res.status(200).json({
        success: true,
        data: analysis

    })
}


export const rejectAnalysisContoller = async (
    req: Request,
    res: Response
) => {
    const analysisId = Number(req.params.id);
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
        return res.status(400).json({
            success: false,
            message: "Rejection reason is required"
        })
    }

    const analysis = await rejectAnalysis(
        analysisId,
        req.user!.userId,
        rejectionReason
    );
    res.status(200).json({
        success: true,
        data: analysis

    })
}