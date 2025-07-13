const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");

const getAllSchema = (req, res, next) => {
  const schema = Joi.object({
    _page: Joi.number().integer().default(1),
    _limit: Joi.number().integer().default(10),
    _sort: Joi.string().default("id"),
    _order: Joi.string().default("desc"),
    status: Joi.string().valid("All", "Active", "Inactive").default("All"),
    q: [Joi.string().optional(), Joi.allow(null)],
  });
  validateRequest(req, res, next, schema, true);
};

module.exports = {
  getAllSchema,
};
