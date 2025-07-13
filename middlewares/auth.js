const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const OPERATIONS = require("../repository/operations");
const config = require("../config/config");

const db = require("../models");
const CustomError = require("../utils/customError");
const catchAsync = require("../utils/catchAsync");
const { ObjectId } = require("mongodb");
const { checkMongooesErrors } = require("../utils/common");

const authMiddleware = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    // console.log(decoded);
    const { userId, role_id, email } = decoded;
    const query = {
      _id: new ObjectId(userId),
      email: email,
      isDeleted: false,
    };

    const checkUser = await OPERATIONS.findOne(db.UsersModel, query);
    if (!checkUser) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    if (!userId || !role_id || !email) {
      throw new CustomError(StatusCodes.FORBIDDEN, "forbidden");
    }

    const tokenQuery = {
      user: checkUser._id,
      tokenType: "Auth",
      token: token,
    };

    const checkToken = await OPERATIONS.findOne(db.TokensModel, tokenQuery);
    if (!checkToken) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized11");
    }

    req.userId = userId;
    req.roleId = role_id;
    req.email = email;
    // console.log(req);
    next();
  } catch (error) {
    console.log("error", error);
    const find = {
      token: token,
    };

    const findToken = await OPERATIONS.findOne(db.TokensModel, find);
    if (!findToken) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }
    await OPERATIONS.deleteById(db.TokensModel, findToken._id);
    throw new CustomError(
      StatusCodes.UNAUTHORIZED,
      error.message ||
        error.errorMessage ||
        checkMongooesErrors(error) ||
        "Token has expired"
    );
  }
});

module.exports = authMiddleware;
