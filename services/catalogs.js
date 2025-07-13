const { StatusCodes } = require("http-status-codes");

const CustomError = require("../utils/customError");
const OPERATIONS = require("../repository/operations");

const { getPaginatedData } = require("../utils/common");
const db = require("../models");
const { CatalogsModel } = require("../models");
const { ObjectId } = require("mongodb");
// const { populate } = require("../models/Catalogs.model");

const add = async (body, req) => {
  console.log("🚀 ~ file: catalogs.js:12 ~ add ~ body-image:", req.file);
  try {
    const catalogueData = {
      ...body,
      createdBy: req.userId,
    };

    // Create the new Catalogue
    const createdCatalogue = await OPERATIONS.create(
      CatalogsModel,
      catalogueData
    );

    if (!createdCatalogue) {
      await unlinkFile(req.file.path);
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Failed to create new Catalogue"
      );
    }

    const catalogue = createdCatalogue.toObject();
    delete catalogue.createdAt;
    delete catalogue.updatedAt;

    // Upload photo only if the catalog is successfully added to the database
    if (req.file) {
      catalogue.image = `uploads/catalogs/${req.file.filename}`;
      await OPERATIONS.update(
        CatalogsModel,
        { image: catalogue.image },
        { _id: catalogue._id }
      );
    }

    return catalogue;
  } catch (error) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error",
      error
    );
  }
};

const getAll = async (body) => {
  const {
    _page: offset,
    _limit: limit,
    _sort = "_id",
    _order = "desc",
    status,
    q: searchTerm = "",
    size,
    partyFavor,
    supplier,
  } = body;

  const matchConditions = {
    $and: [
      { isDeleted: { $eq: false } },
      status && status !== "All"
        ? { status: { $eq: status } }
        : { status: { $ne: null } },
      size && size != "" ? { size: { $eq: size } } : { size: { $ne: null } },
      partyFavor && partyFavor != ""
        ? { partyFavor: { $eq: partyFavor } }
        : { partyFavor: { $ne: null } },
      supplier && supplier != ""
        ? { supplier: { $eq: supplier } }
        : { supplier: { $ne: null } },
    ],
    $or: [
      { tier: { $regex: searchTerm, $options: "i" } },
      { partyFavor: { $regex: searchTerm, $options: "i" } },
      { supplier: { $regex: searchTerm, $options: "i" } },
      { "style.title": { $regex: searchTerm, $options: "i" } },
      { altSupplier: { $regex: searchTerm, $options: "i" } },
      { size: { $regex: `^${searchTerm}$`, $options: "i" } },
    ],
  };
  console.log(matchConditions.$and);
  const query = [
    {
      $match: matchConditions,
    },
    {
      $sort: {
        [_sort]: _order.toLowerCase() === "asc" ? 1 : -1,
      },
    },
  ];

  const fields = {
    tier: 1,
    partyFavor: 1,
    supplier: 1,
    style: 1,
    size: 1,
    altSupplier: 1,
    status: 1,
    createdBy: 1,
    updatedBy: 1,
    deletedBy: 1,
  };

  const getPaginated = await getPaginatedData(
    db.CatalogsModel,
    offset,
    limit,
    query,
    fields
  );

  if (!getPaginated) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem occurred while fetching catalogs!"
    );
  }

  return getPaginated;
};

const getById = async (id) => {
  const query = { _id: new ObjectId(id), isDeleted: false };

  const findCatalog = await OPERATIONS.findOne(CatalogsModel, query);
  console.log(
    "🚀 ~ file: catalogs.js:128 ~ getById ~ findCatalog:",
    findCatalog
  );
  if (!findCatalog) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Cannot get this Catalog");
  }

  const catalog = findCatalog.toObject();
  // Additional processing specific to the catalog service if needed

  return catalog;
};

const update = async (body, id, req) => {
  console.log("🚀 ~ file: catalogs.js:143 ~ update ~ body:", body);
  if (!id) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "'id' is required");
  }

  const checkCatalog = await OPERATIONS.findById(db.CatalogsModel, id);
  if (!checkCatalog) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `No catalog found wit id ${id}`
    );
  }

  // const q = {
  //   id: { $ne: id },
  //   isDeleted: { $eq: false },
  // };

  // const checkDuplicate = await OPERATIONS.findOne(db.CatalogsModel, q);
  // if (checkDuplicate) {
  //   throw new CustomError(StatusCodes.CONFLICT, "catalog already exists");
  // }
  const paramsToUpdate = {
    ...body,
    updatedBy: req.userId,
  };
  const updateCatalog = await OPERATIONS.updateById(
    db.CatalogsModel,
    new ObjectId(id),
    paramsToUpdate
  );
  console.log("======params to update", paramsToUpdate);
  if (!updateCatalog) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Problem occured while updating catalog"
    );
  } else {
    return await getById(id);
  }
};

const deleteOne = async (id, req) => {
  const checkCatalog = await OPERATIONS.findById(db.CatalogsModel, id);

  if (!checkCatalog) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      `No catalog found with id ${id}`
    );
  }

  if (checkCatalog.isDeleted) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Catalog is already deleted"
    );
  }

  const paramsToUpdate = {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.userId,
  };

  const updateDelete = await OPERATIONS.updateById(
    db.CatalogsModel,
    new ObjectId(id),
    paramsToUpdate
  );
  console.log("=======", updateDelete);

  if (!updateDelete) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Problem occurred while deleting Catalog"
    );
  }

  return updateDelete;
};

const bulkDelete = async (ids, req) => {
  console.log("🚀 ~ file: catalogs.js:226 ~ bulkDelete ~ ids:", ids);
  const alreadyDeletedCatalogs = await OPERATIONS.findAll(CatalogsModel, {
    _id: { $in: ids },
    isDeleted: true,
  });
  console.log(
    "🚀 ~ file: catalogs.js:231 ~ bulkDelete ~ alreadyDeletedCatalogs:",
    alreadyDeletedCatalogs
  );

  if (alreadyDeletedCatalogs.length > 0) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      `Some catalogs are already deleted: ${alreadyDeletedCatalogs
        .map((c) => c._id)
        .join(", ")}`
    );
  }

  // Update catalogs to mark them as deleted
  const paramsToUpdate = {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.userId,
  };

  const updateResult = await OPERATIONS.update(
    db.CatalogsModel,
    paramsToUpdate,
    { _id: { $in: ids } }
  );
  console.log(
    "🚀 ~ file: catalogs.js:257 ~ bulkDelete ~ updateResult:",
    updateResult
  );

  if (updateResult.nModified !== ids.length) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Problem occurred while updating catalogs"
    );
  }

  return {
    deletedCount: updateResult.nModified,
    message: "Catalogs deleted successfully",
  };
};

module.exports = { add, getAll, getById, update, deleteOne, bulkDelete };
