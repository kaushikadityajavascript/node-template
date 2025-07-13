const crypto = require("crypto");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
// const { default: slugify } = require("slugify");

const catchAsync = require("./catchAsync");
const CustomError = require("./customError");
const { default: mongoose } = require("mongoose");

const generateRandomString = (length = 40) => {
  return crypto.randomBytes(length).toString("hex");
};

const getModelName = (model) => {
  return model.prototype.collection.modelName;
};

const getPaginatedData = async (
  model,
  page = 1,
  pageSize = 10,
  filter = {},
  fields = {}
) => {
  if (page === 0) {
    const count = 0;
    const totalPages = 0;
    const currentPage = page;
    const data = [];
    return { count, totalPages, currentPage, data };
  }

  const countDocs = await model.aggregate(filter).count("no_of_docs").exec();

  const count = countDocs[0]?.no_of_docs;

  if (count === 0) {
    const totalPages = 0;
    const currentPage = page;
    const data = [];
    return { count, totalPages, currentPage, data };
  }
  const totalPages = Math.ceil(count / pageSize);
  const currentPage = Number(page);
  const offset = (currentPage - 1) * pageSize;
  const limit = pageSize;
  const data = await model
    .aggregate(filter)
    .append({ $skip: offset })
    .append({ $limit: limit })
    .project(fields)
    .exec();

  return { count, totalPages, currentPage, data };
};

const checkMongooesErrors = (error) => {
  let message = "";
  if (error instanceof mongoose.Error.ValidationError) {
    message = `${error._message} : ${error.errors.status}`;
  } else if (error instanceof mongoose.Error.ValidatorError) {
    message = `${error._message}`;
  }

  return message;
};

const isNumber = (value) => {
  if (typeof value === "string") {
    // eslint-disable-next-line no-restricted-globals
    return !isNaN(value);
  }
};

const unlinkFile = catchAsync((req) => {
  // const imagePath = `public/uploads/catalogs/images/${req.file.filename}`;
  fs.access(
    `public/uploads/catalogs/image/${req.file.filename}`,
    fs.constants.F_OK,
    (err) => {
      if (err) {
        console.error(`File does not exist.`);
      } else {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.unlink(
          `public/uploads/catalogs/image/${req.file.filename}`,
          (error) => {
            if (error) {
              throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
            // console.log(`Image unlinked successfully from path: ${imagePath}`);
            req.file.filename = null;
          }
        );
      }
    }
  );
  // fs.access(
  //   `public/uploads/${req.file.filename}`,
  //   fs.constants.F_OK,
  //   (errr) => {
  //     if (errr) {
  //       console.error(`File does not exist.`);
  //     } else {
  //       // eslint-disable-next-line security/detect-non-literal-fs-filename
  //       fs.unlink(`public/thumbnails/${req.file.filename}`, (err) => {
  //         if (err) {
  //           throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  //         }
  //         req.file.filename = null;
  //       });
  //     }
  //   }
  // );
});

const getRequestUrl = (req) => {
  let url = "";
  if (req.headers.origin) {
    return `${req.headers.origin}`;
  } else {
    const host = req.headers.host;
    return `${req.protocol === "https" ? "https" : "http"}://${host}`;
  }
};

module.exports = {
  generateRandomString,
  getModelName,
  getPaginatedData,
  checkMongooesErrors,
  isNumber,
  unlinkFile,
  getRequestUrl,
};
