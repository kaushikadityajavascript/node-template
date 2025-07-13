const path = require("path");
const multer = require("multer");
const { mkdirp } = require("mkdirp");

const uploadImage = (folder = "uploads") => {
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      const uploadPath = `public/${folder}/`;

      mkdirp.sync(uploadPath);
      callBack(null, uploadPath);

      // fs.exists(uploadPath, function (exists) {
      //   console.log("sfdsfdsfsdf ===========>>>>>>>>> ", exists);
      //   if (!exists) {
      //     fs.mkdir(uploadPath, function (err) {
      //       if (err) {
      //         console.log("Error in folder creation", err);
      //       }
      //     });
      //   }
      //   callBack(null, `public/${folder}/`);
      // });
    },
    filename: (req, file, cb) => {
      console.log(file);
      const extension = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${extension}`);
    },
  });

  return multer({ storage: storage });
};

module.exports = uploadImage;
