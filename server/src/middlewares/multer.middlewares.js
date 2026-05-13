import multer from 'multer';
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId;

    const dir = `uploads/${userId}`;

    // create folder if not exists
     if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
    fs.mkdirSync(dir, { recursive: true });
    

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const userId = req.params.userId;
    const dir = `uploads/${userId}`;
    const fileName = "profile" + path.extname(file.originalname);
    const filePath = path.join(dir, fileName);

    // remove existing profile photo if exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
   
    cb(null, fileName);
  }
});

// only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

export const upload= multer({ storage, fileFilter });
