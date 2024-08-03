import { mkdirSync, readdirSync } from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const {
      params: { uid },
    } = req;
    const { fieldname } = file;

    let folderPath;
    switch (fieldname) {
      case "document":
        folderPath = `./src/public/uploads/${uid}/documents`;
        break;
      case "profile":
        folderPath = `./src/public/uploads/${uid}/profiles`;
        break;
      case "product":
        folderPath = `./src/public/uploads/${uid}/products`;
        break;
      case "identification":
        folderPath = `./src/public/uploads/${uid}/identification`;
        break;
      case "proofOfResidence":
        folderPath = `./src/public/uploads/${uid}/proofOfResidence`;
        break;
      case "bankStatement":
        folderPath = `./src/public/uploads/${uid}/bankStatement`;
        break;
      default:
        return callback(new Error("Invalid upload"), false);
    }

    try {
      mkdirSync(folderPath, { recursive: true });
      const files = readdirSync(folderPath);
      if (files.length > 0) {
        return callback(
          new Error(`File type ${fieldname} already exists for this user.`),
          false
        );
      }
    } catch (error) {
      return callback(error, false);
    }

    callback(null, folderPath);
  },
  filename: (req, file, callback) => {
    const {
      params: { uid },
    } = req;
    const nameFile = `${Date.now()}-${uid}-${file.originalname}`;
    callback(null, nameFile);
  },
});

export const uploadDocument = multer({
  storage,
});
