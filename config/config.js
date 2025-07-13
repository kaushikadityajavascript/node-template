const path = require("path");
const dotenv = require("dotenv");
const Joi = require("joi");
const setEnv = require("../utils/setEnv");

const env = setEnv(process.env.NODE_ENV);

dotenv.config({ path: path.join(`${process.cwd()}/environments/`, env) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "staging", "test")
      .required(),
    PORT: Joi.number().default(8080),
    API_BASE_ROOT: Joi.string().required().description("base path for route"),
    API_VERSION: Joi.string().required().description("API version"),
    API_DOMAIN_NAME: Joi.string().required().description("Domain name"),
    DB_CONNECTION: Joi.string()
      .required()
      .description("Database connection string"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    EMAIL_FROM: Joi.string().description(
      "the from field in the emails sent by the app"
    ),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    url: envVars.DB_CONNECTION,
  },
  jwt: {
    secret: envVars.JWT_SECRET || "secret",
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  defaultRoute: {
    apiBaseRoot: envVars.API_BASE_ROOT,
    apiVersion: envVars.API_VERSION,
    apiDomain: envVars.API_DOMAIN_NAME,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
