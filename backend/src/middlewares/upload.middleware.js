import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFile = (folderName) => {
  const finalFolder = folderName || "uploads";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "images",
        finalFolder
      );
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
  });

  return upload;
};

export default uploadFile;
