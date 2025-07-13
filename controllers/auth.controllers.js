const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const authService = require("../services/auth");
const { setSuccessResponse } = require("../utils/sendResponse");

const loginController = catchAsync(async (req, res) => {
  const login = await authService.login(req.body, req.fingerprin);
  if (login) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      login,
      "logged in successfully"
    );
  }
});

const registerController = catchAsync(async (req, res) => {
  const register = await authService.register(
    req.body,
    req.fingerprint,
    req.get("origin"),
    req.userId,
    req
  );
  if (register) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      register,
      "New User Registered"
    );
  }
});

const verifyController = catchAsync(async (req, res) => {
  const verify = await authService.verify(req.query);
  if (verify) {
    return setSuccessResponse(res, StatusCodes.OK, true, null, "");
  }
});

const changePasswordController = catchAsync(async (req, res) => {
  const changePassword = await authService.changePassword(req.body, req);
  if (changePassword) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      changePassword,
      "Password changed"
    );
  }
});
const passwordUpdateController = catchAsync(async (req, res) => {
  const passwordUpdate = await authService.passwordUpdate(
    req.body,
    req.params.token
  );
  if (passwordUpdate) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      passwordUpdate,
      "Password Updated"
    );
  }
});
const forgetPasswordController = catchAsync(async (req, res) => {
  const forgetPassword = await authService.forgetPassword(req.body, req);
  if (forgetPassword) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      null,
      "Please check email address for reset password"
    );
  }
});

const refreshTokenController = catchAsync(async (req, res) => {
  const refreshToken = await authService.refreshToken(req.body);
  if (refreshToken) {
    // console.log("refreshToken ===> ", refreshToken);
    return setSuccessResponse(res, StatusCodes.OK, true, refreshToken, "");
  }
});

module.exports = {
  loginController,
  registerController,
  verifyController,
  passwordUpdateController,
  forgetPasswordController,
  changePasswordController,
  refreshTokenController,
};
