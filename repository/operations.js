const { StatusCodes } = require("http-status-codes");
const { checkMongooesErrors } = require("../utils/common");
const CustomError = require("../utils/customError");

const create = async (Model, data = {}) => {
  try {
    return await Model.create(data);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || "Unable to create the record"
    );
  }
};

const findAll = async (Model, filter = {}) => {
  try {
    return await Model.find(filter);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || "Unable to find data"
    );
  }
};

const findById = async (Model, id) => {
  try {
    return await Model.findById(id);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Cannot find data with id ${id}`
    );
  }
};

const findOne = async (Model, query = {}, entity = "data") => {
  try {
    return await Model.findOne(query);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Cannot find ${entity}`
    );
  }
};

const update = async (Model, data, filter = {}, entity = "data") => {
  try {
    return await Model.updateMany(filter, data);
  } catch (error) {
    console.error(error);
    throw new CustomError(StatusCodes.NOT_FOUND, `Cannot update ${entity}`);
  }
};
// newly created update method to support multi-update
// const update = async (
//   Model,
//   data,
//   filter = {},
//   entity = "data",
//   options = {}
// ) => {
//   try {
//     if (options.multi) {
//       return await Model.updateMany(filter, data, options);
//     } else {
//       return await Model.updateOne(filter, data, options);
//     }
//   } catch (error) {
//     console.error(error);
//     throw new CustomError(StatusCodes.NOT_FOUND, `Cannot update ${entity}`);
//   }
// };

const updateById = async (
  Model,
  id,
  data,
  pluckFields = "",
  entity = "data"
) => {
  try {
    return await Model.findOneAndUpdate(id, data, { fields: pluckFields });
  } catch (error) {
    console.error(error);
    const err =
      checkMongooesErrors(error) || `Cannot update ${entity} with id ${id}`;
    throw new CustomError(StatusCodes.NOT_FOUND, err, error);
  }
};

const deleteById = async (Model, id, entity = "data") => {
  try {
    return await Model.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Cannot delete ${entity} with id ${id}`
    );
  }
};

const bulkCreate = async (Model, data, entities = "data") => {
  try {
    return await Model.insertMany(data);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Cannot create ${entities}`
    );
  }
};

const bulkUpdate = async (ModelName, data, field, entities = "data") => {
  try {
    return await ModelName.update(data, {
      where: { [field]: { $in: data.map((item) => item[field]) } },
    });
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Unable to update the ${entities}`
    );
  }
};

const bulkDelete = async (Model, field, ids, entities = "data") => {
  try {
    return await Model.deleteMany({
      where: { [field]: { $in: ids } },
    });
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Unable to delete the ${entities}`
    );
  }
};

const countAll = async (ModelName, filter, entities = "data") => {
  try {
    return await ModelName.count(filter);
  } catch (error) {
    console.error(error);
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      checkMongooesErrors(error) || `Unable to count the ${entities}`
    );
  }
};

module.exports = {
  create,
  findAll,
  findById,
  findOne,
  update,
  updateById,
  deleteById,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  countAll,
};
