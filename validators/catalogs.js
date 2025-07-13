const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");

const addSchema = (req, res, next) => {
  const schema = Joi.object({
    tier: Joi.string().required(),
    partyFavor: Joi.string().required(),
    supplier: Joi.string().required(),
    style: Joi.object({
      title: Joi.string().required(),
      url: Joi.string().required(),
    }).required(),
    size: Joi.string().required(),
    altSupplier: Joi.string().required(),
    costPerPc: Joi.number().required(),
    piecePerHr: Joi.number().required(),
    costPerHr: Joi.number().required(),
    merchRatePerHr: Joi.number().required(),
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
    q: [Joi.string().optional(), Joi.allow(null)],
    size: [Joi.string().optional(), Joi.allow(null)],
    partyFavor: [Joi.string().optional(), Joi.allow(null)],
    supplier: [Joi.string().optional(), Joi.allow(null)],
    status: Joi.string().valid("All", "Active", "Inactive").default("All"),
  });
  validateRequest(req, res, next, schema, true);
};

const getByIdSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, false, true);
};

const updateSchema = (req, res, next) => {
  const schema = Joi.object({
    tier: Joi.string().required(),
    partyFavor: Joi.string().required(),
    supplier: Joi.string().required(),
    style: Joi.object({
      title: Joi.string().required(),
      url: Joi.string().required(),
    }).required(),
    size: Joi.string().required(),
    altSupplier: Joi.string().required(),
    costPerPc: Joi.number().required(),
    piecePerHr: Joi.number().required(),
    costPerHr: Joi.number().required(),
    merchRatePerHr: Joi.number().required(),
    status: Joi.string()
      .valid("Active", "Inactive")
      .required()
      .default("Active"),
  });

  validateRequest(req, res, next, schema);
};

const deleteSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  validateRequest(req, res, next, schema, false, true);
};

const bulkDeleteSchema = (req, res, next) => {
  const schema = Joi.object({
    ids: Joi.array().items(Joi.string().required()).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(406).json({
      code: 406,
      success: false,
      message: "Validation error",
      data: error.details,
    });
  }

  next();
};

module.exports = {
  addSchema,
  getAllSchema,
  getByIdSchema,
  updateSchema,
  deleteSchema,
  bulkDeleteSchema,
};
