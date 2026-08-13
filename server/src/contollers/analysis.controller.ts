import type { Request, Response, NextFunction } from "express";
import { approveAnalysis, createAnalysis, getAnalysesService, rejectAnalysis } from "../services/analysis.service.js"
import { success } from "zod";
import { AppError } from "../errors/AppError.js";
import { analysisQuerySchema } from "../schemas/analyses.schema.js";

import * as analysisService from "../services/analysis.service.js";
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

export const getAnalyses = async (
    req: Request,
    res: Response
) => {
    
        const query = analysisQuerySchema.parse(req.query);

        const result = getAnalysesService(query, req.user)

        res.status(200).json({
            data: (await result).analyses,
            success: true

        });
    

};
export const uploadFile = async (
  req: Request,
  res: Response
) => {
  const analysisId = Number(req.params.id);

  if (isNaN(analysisId)) {
    throw new AppError("Invalid analysis ID", 400);
  }

  if (!req.file) {
    throw new AppError("File is required", 400);
  }

  const file = await analysisService.uploadAnalysisFile(
    analysisId,
    req.file
  );

  if (!file) {
    throw new AppError("Analysis not found", 404);
  }

  res.status(201).json({
    success: true,
    data: file,
    statusCode: 201,
  });
};