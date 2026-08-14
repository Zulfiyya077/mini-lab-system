import type { Request, Response, NextFunction } from "express";
import { approveAnalysis, createAnalysis, getAnalysesService, rejectAnalysis } from "../services/analysis.service.js"
import { success } from "zod";
import { AppError } from "../errors/AppError.js";
import { analysisQuerySchema } from "../schemas/analyses.schema.js";

import * as analysisService from "../services/analysis.service.js";
import path from "node:path";
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

export const getAnalysisFiles = async (
  req: Request,
  res: Response
) => {
  const analysisId = Number(req.params.id);

  if (isNaN(analysisId)) {
    throw new AppError("Invalid analysis ID", 400);
  }

  const files = await analysisService.getAnalysisFiles(
    analysisId
  );

  if (!files) {
    throw new AppError("Analysis not found", 404);
  }

  res.status(200).json({
    success: true,
    data: files,
    statusCode: 200,
  });
};
export const getAnalysisFile = async (
  req: Request,
  res: Response
) => {
  const fileId = Number(req.params.fileId);

  if (isNaN(fileId)) {
    throw new AppError("Invalid file ID", 400);
  }

  const file = await analysisService.getAnalysisFile(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  const filePath = path.resolve(
    process.cwd(),
    file.storageKey
  );

  res.sendFile(filePath);
};

export const deleteAnalysisFile = async (
  req: Request,
  res: Response
) => {
  console.log("🟢 CONTROLLER HIT");
  console.log("🟢 PARAMS:", req.params);

  const fileId = Number(req.params.fileId);

  console.log("🟢 fileId:", fileId);
  console.log("🟢 type:", typeof fileId);

  if (isNaN(fileId)) {
    throw new AppError("Invalid file ID", 400);
  }

  console.log("🟡 CALLING SERVICE");

  const file = await analysisService.deleteAnalysisFile(fileId);

  console.log("🟡 SERVICE RETURNED:", file);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "File deleted successfully",
    data: file,
    statusCode: 200,
  });
};

export const downloadAnalysisFile = async (
  req: Request,
  res: Response
) => {
  const fileId = Number(req.params.fileId);

  console.log("🟢 DOWNLOAD fileId:", fileId);

  if (isNaN(fileId)) {
    throw new AppError("Invalid file ID", 400);
  }

  const file = await analysisService.getAnalysisFile(fileId);

  if (!file) {
    throw new AppError("File not found", 404);
  }

  const filePath = path.resolve(
    process.cwd(),
    file.storageKey
  );

  console.log("📁 FILE PATH:", filePath);

  res.download(
    filePath,
    file.originalName,
    (error) => {
      if (error) {
        console.error("❌ DOWNLOAD ERROR:", error);
      }
    }
  );
};

