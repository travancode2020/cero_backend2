const multer = require("multer");

// upload file path
const FILE_PATH = "uploads";

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${FILE_PATH}/`);
  },
  filename: (req, file, cb) => {
    var filename = file.originalname;
    cb(null, Date.now() + "_" + filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { upload, storage };
