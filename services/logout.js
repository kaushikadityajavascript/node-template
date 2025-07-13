const { StatusCodes } = require("http-status-codes");

const OPERATIONS = require("../repository/operations");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/customError");

const { setSuccessResponse } = require("../utils/sendResponse");
const db = require("../models");

const logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  const query = {
    token: {
      $eq: token,
    },
    tokenType: { $eq: "Auth" },
  };
  const checkToken = await OPERATIONS.findOne(db.TokensModel, query);
  if (!checkToken) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  await OPERATIONS.deleteById(db.TokensModel, checkToken._id);

  return setSuccessResponse(res, StatusCodes.OK, true, [], "");
});

module.exports = { logout };
