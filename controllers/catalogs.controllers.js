const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const { setSuccessResponse } = require("../utils/sendResponse");
const SERVICE = require("../services/catalogs");

const addController = catchAsync(async (req, res) => {
  console.log(
    "🚀 ~ file: catalogs.controllers.js:7 ~ addController ~ req:",
    req.file
  );
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
      "catalog-fetched"
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
      "catalog updated"
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
      "catalog deleted"
    );
  }
});

const bulkDeleteController = catchAsync(async (req, res) => {
  const ids = req.body.ids;
  const bulkDeleteResult = await SERVICE.bulkDelete(ids, req);

  if (bulkDeleteResult) {
    return setSuccessResponse(
      res,
      StatusCodes.OK,
      true,
      bulkDeleteResult,
      "Catalogs deleted successfully"
    );
  }
});

module.exports = {
  addController,
  getAllController,
  getByIdController,
  updateByIdController,
  deleteByIdController,
  bulkDeleteController,
};
