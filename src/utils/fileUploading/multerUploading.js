import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
export const fileValidation = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf"],
};

export const upload = (fileType, folder) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      const folderPath = path.resolve(".", `${folder}/${req.user._id}`);
      console.log(folderPath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const folderName = `${folder}/${req.user._id}`;
      cb(null, folderName);
    },
    filename: (req, file, cb) => {
      //   console.log(file);
      //   cb(null, file.originalname);
      cb(null, nanoid() + "__" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    // console.log(file.mimetype);
    // if (file.mimetype !== "image/jpeg")
    if (!fileType.includes(file.mimetype))
      return cb(new Error(`invalid  format`), false);
    return cb(null, true);
  };

  const muterUpload = multer({ storage, fileFilter });
  //   console.log(muterUpload);
  return muterUpload;
};
