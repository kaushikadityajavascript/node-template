const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const SERVICE = require("../services/users");

const addController = catchAsync(async (req, res) => {
  const addNew = await SERVICE.add(req.body, req);
  if (addNew) {
    return setSuccessResponse(res, StatusCodes.CREATED, true, addNew, "");
  }
});

const getAllController = catchAsync(async (req, res) => {
  const getAll = await SERVICE.getAll(req.body);
  if (getAll) {
    return setSuccessResponse(res, StatusCodes.OK, true, getAll, "");
  }
});

const getByIdController = catchAsync(async (req, res) => {
  const getById = await SERVICE.getById(req.params.id);
  if (getById) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      getById,
      "user-fetched"
    );
  }
});
const updateByIdController = catchAsync(async (req, res) => {
  const update = await SERVICE.update(req.body, req.params.id, req);
  if (update) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      update,
      "User updated"
    );
  }
});

const deleteByIdController = catchAsync(async (req, res) => {
  const deleteOne = await SERVICE.deleteOne(req.params.id, req);
  if (deleteOne) {
    return setSuccessResponse(
      res,
      StatusCodes.CREATED,
      true,
      null,
      "User deleted"
    );
  }
});

module.exports = {
  addController,
  getAllController,
  getByIdController,
  updateByIdController,
  deleteByIdController,
};
