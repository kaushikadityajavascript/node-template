const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");

const addSchema = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string(),
    status: Joi.string()
      .valid("Active", "Inactive")
      .required()
      .default("Active"),
  });
  validateRequest(req, res, next, schema);
};

const getAllSchema = (req, res, next) => {
  const schema = Joi.object({
    _page: Joi.number().integer().required().default(1),
    _limit: Joi.number().integer().required().default(10),
    _sort: Joi.string().default("id"),
    _order: Joi.string().default("desc"),
    status: Joi.string().valid("All", "Active", "Inactive").default("All"),
    q: [Joi.string().optional(), Joi.allow(null)],
  });
  validateRequest(req, res, next, schema, true);
};

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    role: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    status: Joi.string().valid("Active", "Inactive"),
    phone: Joi.string(),
    profile_remove: Joi.string(),
  });
  validateRequest(req, res, next, schema);
};

const getByIdSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, false, true);
};

const deleteSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, false, true);
};

module.exports = {
  addSchema,
  getAllSchema,
  getByIdSchema,
  updateSchema,
  deleteSchema,
};
