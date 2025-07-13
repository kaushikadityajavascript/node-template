const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");

const registerSchema = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.number().integer().required(),
    status: Joi.string().valid("Active", "Inactive", "Draft").required(),
  });
  validateRequest(req, res, next, schema);
};

const loginSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
};

const verifySchema = (req, res, next) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, true, false);
};

const updatePasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("newPassword"))
      .label("confirmPassword"),
  });
  validateRequest(req, res, next, schema);
};

const changePasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmNewPassword: Joi.string().required(),
    // confirm_password: Joi.string().required().valid(Joi.ref("password")).label("confirm_password"),
  });
  validateRequest(req, res, next, schema);
};

const forgetPasswordSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  validateRequest(req, res, next, schema);
};

const refreshTokenSchema = (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  validateRequest(req, res, next, schema);
};

module.exports = {
  registerSchema,
  loginSchema,
  verifySchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
};
