const express = require("express");
const {
  loginController,
  registerController,
  verifyController,
  passwordUpdateController,
  changePasswordController,
  forgetPasswordController,
  refreshTokenController,
} = require("../../controllers/auth.controllers");
const {
  loginSchema,
  registerSchema,
  verifySchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} = require("../../validators/auth");
const authMiddleware = require("../../middlewares/auth");

const { AUTH_CONSTANTS } = require("../../utils/constants");

const router = express.Router();

router.route(`/${AUTH_CONSTANTS.LOGIN}`).post(loginSchema, loginController);
router
  .route(`/${AUTH_CONSTANTS.REGISTER}`)
  .post(registerSchema, registerController);
router.route(`/${AUTH_CONSTANTS.VERIFY}`).get(verifySchema, verifyController);
router
  .route(`/${AUTH_CONSTANTS.RESET_PASSWORD}`)
  .put(updatePasswordSchema, passwordUpdateController);
router
  .route(`/${AUTH_CONSTANTS.CHANGE_PASSWORD}`)
  .put(authMiddleware, changePasswordSchema, changePasswordController);
router
  .route(`/${AUTH_CONSTANTS.FORGOT_PASSWORD}`)
  .post(forgetPasswordSchema, forgetPasswordController);
router
  .route(`/${AUTH_CONSTANTS.UPDATE_PROFILE}`)
  .post(forgetPasswordSchema, forgetPasswordController);
router
  .route(`/${AUTH_CONSTANTS.REFRESH_TOKEN}`)
  .post(refreshTokenSchema, refreshTokenController);

module.exports = router;
