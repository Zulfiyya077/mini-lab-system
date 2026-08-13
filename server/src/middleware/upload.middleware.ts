import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF and image files are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});