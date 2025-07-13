const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const ObjectId = require("mongoose").Types.ObjectId;

const { isNull } = require("lodash");
const CustomError = require("../utils/customError");
const OPERATIONS = require("../repository/operations");
const config = require("../config/config");
const sendEmail = require("../utils/sendEmail");
const db = require("../models");
const { getRequestUrl } = require("../utils/common");

const login = async (body) => {
  const { email, password } = body;
  const query = {
    email: email,
    isDeleted: false,
  };

  const checkUser = await OPERATIONS.findOne(db.UsersModel, query);

  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Invalid email or password");
  }

  if (checkUser.status === "Inactive") {
    throw new CustomError(StatusCodes.NOT_FOUND, "Invalid email or password");
  }

  if (isNull(checkUser.password) || checkUser.password === "") {
    throw new CustomError(StatusCodes.NOT_FOUND, "Invalid email or password");
  }
  const passwordIsValid = bcrypt.compareSync(password, checkUser.password);

  if (!passwordIsValid) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      userId: checkUser._id,
      role_id: checkUser.role,
      email: checkUser.email,
    },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.accessExpirationMinutes}m`,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: checkUser._id,
      role_id: checkUser.role,
      email: checkUser.email,
    },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.refreshExpirationDays}d`,
    }
  );

  if (!accessToken) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Token expired");
  }

  const loginJson = {
    id: checkUser._id,
    name: checkUser.name,
    email: checkUser.email,
    token: accessToken,
    refreshToken,
    status: checkUser.status,
    role: checkUser.role,
    profilePhoto: checkUser.profilePhoto,
  };

  const tokenRows = [
    {
      user: checkUser._id,
      tokenType: "Auth",
      token: accessToken,
    },
    {
      user: checkUser._id,
      tokenType: "RefreshAuth",
      token: refreshToken,
    },
  ];

  const createTokenRecords = await OPERATIONS.bulkCreate(
    db.TokensModel,
    tokenRows
  );
  if (!createTokenRecords) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem occured!"
    );
  }

  return loginJson;
};

const register = async (body, fingerprint, origin, userId, req, db) => {};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Token expired");
  }
};

const verify = async (body) => {
  const { token } = body;
  const query = {
    token: {
      $eq: token,
    },

    tokenType: {
      $eq: "Reset",
    },
  };
  console.log(query);
  const checkToken = await OPERATIONS.findOne(db.TokensModel, query);
  if (!checkToken) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Token expired or use valid token"
    );
  }

  const data = await verifyToken(token);
  if (!data) {
    throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Token expired");
  }
  const checkUser = await OPERATIONS.findById(db.UsersModel, data.userId);

  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  return true;
};

// change-password-after-succesfull-logIn
const changePassword = async (body, req) => {
  const { oldPassword, newPassword, confirmNewPassword } = body;

  // finding logged in user
  const checkUser = await OPERATIONS.findById(db.UsersModel, req.userId);
  console.log(
    "🚀 ~ file: auth.js:124 ~ changePassword ~ checkUser:",
    checkUser
  );

  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  const checkOldPassword = bcrypt.compareSync(oldPassword, checkUser.password);
  if (!checkOldPassword) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "please enter correct current password to change password"
    );
  }

  if (newPassword === oldPassword) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "already existing password cannot be set as a new password"
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "confirm new password didn't matched please enter same as new password"
    );
  }

  const paramsToUpdate = {};
  paramsToUpdate.password = hashedNewPassword;

  // updating user with new password in the users table
  const updateUser = await OPERATIONS.updateById(
    db.UsersModel,
    req.userId,
    paramsToUpdate
  );
  if (!updateUser) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Problem occured!");
  }

  return updateUser;
};

// reset-password(for-users-forgot-their-password)
const passwordUpdate = async (body, token) => {
  const { newPassword } = body;

  const tokenValue = await verifyToken(token);

  if (!token) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "token is required");
  }
  const checkUser = await OPERATIONS.findById(db.UsersModel, tokenValue.userId);
  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  if (!isNull(checkUser.password) && checkUser.password !== "") {
    const checkPassword = bcrypt.compareSync(newPassword, checkUser.password);
    if (checkPassword) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "please use different password"
      );
    }
  }
  const paramsToUpdate = {};
  paramsToUpdate.password = hashedPassword;

  // updating user with new password in the users table
  const pluckFields = "name email";
  const updateUser = await OPERATIONS.updateById(
    db.UsersModel,
    new ObjectId(tokenValue.userId),
    paramsToUpdate,
    pluckFields
  );
  if (!updateUser) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Problem occured!");
  }

  await OPERATIONS.bulkDelete(db.TokensModel, "token", [token]);

  return updateUser;
};

const forgetPassword = async (body, req) => {
  const { email } = body;
  const query = {
    email: email,
  };
  const findUser = await OPERATIONS.findOne(db.UsersModel, query);
  if (!findUser) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Email does not exist");
  }

  const generateToken = jwt.sign(
    { userId: findUser._id, email: findUser.email },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.resetPasswordExpirationMinutes}m`,
    }
  );

  const tokenData = {
    user: findUser._id,
    tokenType: "Reset",
    token: generateToken,
  };

  const createToken = await OPERATIONS.create(db.TokensModel, tokenData);
  if (!createToken) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Failed to create new token"
    );
  }

  const baseUrl = getRequestUrl(req);
  const url = `${baseUrl}/reset-password?t=${generateToken}`;

  console.log("🚀 ~ file: auth.js:207 ~ forgetPassword ~ url:", url);

  const filePath = path.join(__dirname, "../helpers/email/reset-password.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    name: findUser.name,
    url,
  };

  const htmlToSend = template(replacements);

  await sendEmail({
    to: findUser.email,
    subject: "password-reset",
    html: htmlToSend,
  });

  return true;
};

const refreshToken = async (body) => {
  const { refreshToken } = body;
  const decoded = jwt.verify(refreshToken, config.jwt.secret);

  if (!decoded) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Token expired");
  }

  const query = {
    token: refreshToken,
    tokenType: "RefreshAuth",
  };

  const tokenexits = await OPERATIONS.findOne(db.TokensModel, query);
  if (tokenexits) {
    const userQuery = {
      _id: tokenexits.user,
    };
    const user = await OPERATIONS.findOne(db.UsersModel, userQuery);
    const newToken = jwt.sign(
      { user: user._id, role_id: user.role, email: user.email },
      config.jwt.secret,
      {
        expiresIn: `${config.jwt.accessExpirationMinutes}m`,
      }
    );

    const tokenRow = {
      user: user._id,
      tokenType: "Auth",
      token: newToken,
    };

    const createTokenRecord = await OPERATIONS.create(db.TokensModel, tokenRow);
    if (!createTokenRecord) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Problem occured!"
      );
    }

    return { refreshToken: newToken };
  } else {
    throw new CustomError(StatusCodes.NOT_FOUND, "Token expired");
  }
};

module.exports = {
  login,
  verify,
  register,
  passwordUpdate,
  forgetPassword,
  changePassword,
  refreshToken,
};
