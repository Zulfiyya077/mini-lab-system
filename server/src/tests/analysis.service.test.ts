import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  approveAnalysis,
  createAnalysis,
  rejectAnalysis,
  uploadAnalysisFile,
} from "../services/analysis.service.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    patient: {
      findUnique: vi.fn(),
    },
    analysis: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    patient: {
      findUnique: vi.fn(),
    },

    analysis: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },

    analysisFile: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("uploadAnalysisFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when analysis does not exist", async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(null);

    const file = {
      filename: "test.pdf",
      originalname: "test.pdf",
      mimetype: "application/pdf",
      size: 1000,
      path: "uploads/test.pdf",
    } as Express.Multer.File;

    const result = await uploadAnalysisFile(999, file);

    expect(result).toBeNull();

    expect(prisma.analysisFile.create).not.toHaveBeenCalled();
  });
});

describe("createAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
it("should throw 400 when analysis is not pending", async () => {
  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "REJECTED",
    reviewedBy: 1,
    reviewedAt: new Date(),
    rejectionReason: "Sample quality is insufficient",
    createdAt: new Date(),
  });

  await expect(
    approveAnalysis(2, 1)
  ).rejects.toMatchObject({
    message: "Only pending analyses can be approved",
    statusCode: 400,
  });

  expect(prisma.analysis.update).not.toHaveBeenCalled();
});

it("should approve a pending analysis", async () => {
  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "PENDING",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: new Date(),
  });

  vi.mocked(prisma.analysis.update).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "APPROVED",
    reviewedBy: 5,
    reviewedAt: new Date(),
    rejectionReason: null,
    createdAt: new Date(),
  });

  const result = await approveAnalysis(2, 5);

  expect(result).toMatchObject({
    id: 2,
    status: "APPROVED",
    reviewedBy: 5,
  });

  expect(prisma.analysis.update).toHaveBeenCalledWith({
    where: {
      id: 2,
    },
    data: {
      status: "APPROVED",
      reviewedBy: 5,
      reviewedAt: expect.any(Date),
    },
  });
});

it("should propagate Prisma update error", async () => {
  const prismaError = new Error("Database update error");

  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "PENDING",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: new Date(),
  });

  vi.mocked(prisma.analysis.update).mockRejectedValue(prismaError);

  await expect(
    approveAnalysis(2, 5)
  ).rejects.toThrow("Database update error");
});


  it("should create an analysis when patient exists", async () => {
    vi.mocked(prisma.patient.findUnique).mockResolvedValue({
      id: 2,
      firstName: "Nuran",
      lastName: "Mammadli",
      phone: "7777777777",
      createdAt: new Date(),
      status: "ACTIVE",
    });

    vi.mocked(prisma.analysis.create).mockResolvedValue({
      id: 10,
      patientId: 2,
      createdBy: 1,
      result: "Blood test result",
      status: "PENDING",
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      createdAt: new Date(),
    });

    const result = await createAnalysis(
      2,
      1,
      "Blood test result"
    );

    expect(result).toMatchObject({
      patientId: 2,
      createdBy: 1,
      result: "Blood test result",
    });
  });

  it("should throw 404 when patient does not exist", async () => {
    vi.mocked(prisma.patient.findUnique).mockResolvedValue(null);

    await expect(
      createAnalysis(999, 1, "Blood test result")
    ).rejects.toMatchObject({
      message: "Patient not found",
      statusCode: 404,
    });

    expect(prisma.analysis.create).not.toHaveBeenCalled();
  });

  it("should create an analysis with null result when result is not provided", async () => {
    vi.mocked(prisma.patient.findUnique).mockResolvedValue({
      id: 2,
      firstName: "Nuran",
      lastName: "Mammadli",
      phone: "7777777777",
      createdAt: new Date(),
      status: "ACTIVE",
    });

    vi.mocked(prisma.analysis.create).mockResolvedValue({
      id: 11,
      patientId: 2,
      createdBy: 1,
      result: null,
      status: "PENDING",
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      createdAt: new Date(),
    });

    await createAnalysis(2, 1);

    expect(prisma.analysis.create).toHaveBeenCalledWith({
      data: {
        patientId: 2,
        createdBy: 1,
        result: null,
      },
    });
  });

  it("should propagate Prisma error", async () => {
    const prismaError = new Error("Database error");

    vi.mocked(prisma.patient.findUnique).mockResolvedValue({
      id: 2,
      firstName: "Nuran",
      lastName: "Mammadli",
      phone: "7777777777",
      createdAt: new Date(),
      status: "ACTIVE",
    });

    vi.mocked(prisma.analysis.create).mockRejectedValue(
      prismaError
    );

    await expect(
      createAnalysis(2, 1, "Blood test result")
    ).rejects.toThrow("Database error");
  });
});

describe("approveAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw 404 when analysis does not exist", async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(null);

    await expect(
      approveAnalysis(999, 1)
    ).rejects.toMatchObject({
      message: "Analysis not found",
      statusCode: 404,
    });

    expect(prisma.analysis.update).not.toHaveBeenCalled();
  });


  describe("rejectAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw 404 when analysis does not exist", async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(null);

    await expect(
      rejectAnalysis(999, 1, "Sample quality is insufficient")
    ).rejects.toMatchObject({
      message: "Analysis is not found",
      statusCode: 404,
    });

    expect(prisma.analysis.update).not.toHaveBeenCalled();
  });
});

it("should throw 400 when analysis is not pending", async () => {
  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "APPROVED",
    reviewedBy: 1,
    reviewedAt: new Date(),
    rejectionReason: null,
    createdAt: new Date(),
  });

  await expect(
    rejectAnalysis(2, 5, "Sample quality is insufficient")
  ).rejects.toMatchObject({
    message: "Only pending analyses can be rejected",
    statusCode: 400,
  });

  expect(prisma.analysis.update).not.toHaveBeenCalled();
});

it("should reject a pending analysis", async () => {
  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "PENDING",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: new Date(),
  });

  vi.mocked(prisma.analysis.update).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "REJECTED",
    reviewedBy: 5,
    reviewedAt: new Date(),
    rejectionReason: "Sample quality is insufficient",
    createdAt: new Date(),
  });

  const result = await rejectAnalysis(
    2,
    5,
    "Sample quality is insufficient"
  );

  expect(result).toMatchObject({
    id: 2,
    status: "REJECTED",
    reviewedBy: 5,
    rejectionReason: "Sample quality is insufficient",
  });

  expect(prisma.analysis.update).toHaveBeenCalledWith({
    where: {
      id: 2,
    },
    data: {
      status: "REJECTED",
      rejectionReason: "Sample quality is insufficient",
      reviewedBy: 5,
      reviewedAt: expect.any(Date),
    },
  });
});

it("should propagate Prisma update error", async () => {
  const prismaError = new Error("Database update error");

  vi.mocked(prisma.analysis.findUnique).mockResolvedValue({
    id: 2,
    patientId: 2,
    createdBy: 1,
    result: "Blood test result",
    status: "PENDING",
    reviewedBy: null,
    reviewedAt: null,
    rejectionReason: null,
    createdAt: new Date(),
  });

  vi.mocked(prisma.analysis.update).mockRejectedValue(
    prismaError
  );

  await expect(
    rejectAnalysis(
      2,
      5,
      "Sample quality is insufficient"
    )
  ).rejects.toThrow("Database update error");
});

describe("uploadAnalysisFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when analysis does not exist", async () => {
    vi.mocked(prisma.analysis.findUnique).mockResolvedValue(null);

    const file = {
      filename: "test.pdf",
      originalname: "test.pdf",
      mimetype: "application/pdf",
      size: 1000,
      path: "uploads/test.pdf",
    } as Express.Multer.File;

    const result = await uploadAnalysisFile(999, file);

    expect(result).toBeNull();

    expect(prisma.analysisFile.create).not.toHaveBeenCalled();
  });
});
});