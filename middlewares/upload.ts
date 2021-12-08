import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "assets",
    filename: (req, file, callback) => {
      const oldFilename = file.originalname;
      const oldFilenameExtension = path.extname(oldFilename);
      const newFilename = `${
        req.body.name
      }-${Date.now()}-${oldFilenameExtension}`;
      callback(null, newFilename);
    },
  }),
  limits: { fileSize: 3e6 },
});

export default upload;
