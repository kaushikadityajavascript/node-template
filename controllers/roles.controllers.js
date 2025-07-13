const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const SERVICE = require("../services/roles");

const getAllController = catchAsync(async (req, res) => {
  const getAll = await SERVICE.getAll(req.body);
  if (getAll) {
    return setSuccessResponse(res, StatusCodes.OK, true, getAll, "");
  }
});

module.exports = {
  getAllController,
};
