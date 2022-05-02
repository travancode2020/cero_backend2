const multerConfig = require("./multerConfig");
const { wasabi } = require("./s3Upload");

const uploadFile = async (req, res, next) => {
  try {
    throw new Error("error");
    let path = null;
    let field = [{ name: "image" }],
      upload = multerConfig.upload.fields(field);
    upload(req, res, async (err) => {
      try {
        let { files, body } = req;

        if (req.fileValidationError) {
          throw new Error(req.fileValidationError);
        } else if (!req.files) {
          throw new Error("Please select an image to upload");
        } else if (err) {
          throw new Error(err);
        }
        if (files.image === undefined)
          throw new Error("Please Enter Valid Fileds");

        if (files.image && files.image.length) {
          path = files.image[0].path;
          let photoURL = await wasabi(path);
        }

        res.send({ files, body });
      } catch (error) {
        res.status(400).send({
          success: false,
          message: error.message || error,
        });
      }
    });
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { uploadFile };
