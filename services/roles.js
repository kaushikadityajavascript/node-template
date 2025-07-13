const { StatusCodes } = require("http-status-codes");

const CustomError = require("../utils/customError");
const OPERATIONS = require("../repository/operations");

const { getPaginatedData } = require("../utils/common");
const { RolesModel } = require("../models");

const getAll = async (body, db) => {
  const { _page: offset, _limit: limit } = body;

  const query = {
    isDeleted: false,
  };

  const getPanigated = await getPaginatedData(
    RolesModel,
    offset,
    limit,
    query,
    (fields = "name status")
  );

  if (!getPanigated) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem occured!"
    );
  }

  return getPanigated;
};

module.exports = { getAll };
