import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const UPLOADS_DIR = path.join(__dirname, "uploads");

const directories = [
  "profile",
  "selfie",
  "license-front",
  "license-back",
  "vehicle-registration",
  "insurance",
];

// Create upload folders automatically if they don't exist
directories.forEach((dir) => {
  const dirPath = path.join(UPLOADS_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";
    switch (file.fieldname) {
      case "profilePhoto":
        folder = "profile";
        break;
      case "selfiePhoto":
        folder = "selfie";
        break;
      case "licenseFront":
        folder = "license-front";
        break;
      case "licenseBack":
        folder = "license-back";
        break;
      case "vehicleRegistration":
        folder = "vehicle-registration";
        break;
      case "insuranceDocument":
        folder = "insurance";
        break;
      default:
        folder = ""; // Default folder if any
    }
    const uploadPath = folder ? path.join(UPLOADS_DIR, folder) : UPLOADS_DIR;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const userId = req.body.userId || "new";
    const random = Math.floor(Math.random() * 10000);
    const ext = path.extname(file.originalname).toLowerCase();
    
    // timestamp-userid-random.extension
    const newFilename = `${timestamp}-${userId}-${random}${ext}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only jpg, jpeg, png, and pdf are allowed."));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});
