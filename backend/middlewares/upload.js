import multer from "multer";

export const upload = multer({ dest: "uploads/" }); // temp folder