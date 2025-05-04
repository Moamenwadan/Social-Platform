import multer, { diskStorage } from "multer";

export const fileValidation = {
  images: ["image/png", "image/jpeg"],
  files: ["application/pdf"],
};

export const uploadCloud = () => {
  const storage = diskStorage({});

  const muterUpload = multer({ storage });
  return muterUpload;
};
export default uploadCloud;
