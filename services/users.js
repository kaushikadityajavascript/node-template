const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const CustomError = require("../utils/customError");
const OPERATIONS = require("../repository/operations");

const { getPaginatedData, getModelName } = require("../utils/common");
const db = require("../models");
const { ObjectId } = require("mongodb");

const add = async (body, req) => {
  const { email, password } = body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  body.password = hashedPassword;
  const query = {
    email: email,
    isDeleted: false,
  };
  const checkUser = await OPERATIONS.findOne(db.UsersModel, query);
  if (checkUser) {
    throw new CustomError(StatusCodes.CONFLICT, "User already exists!");
  }
  const userData = {
    ...body,
    ...(req.file && {
      profilePhoto: `uploads/users/profile/${req.file.filename}`,
    }),
    createdBy: req.userId,
  };

  const createUser = await OPERATIONS.create(db.UsersModel, userData);

  if (!createUser) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Failed to create new User");
  }
  const user = createUser.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.artistInfo;
  return user;
};

const getAll = async (body) => {
  const {
    _page: offset,
    _limit: limit,
    _sort,
    _order,
    status,
    q: searchTerm = "",
  } = body;

  const query = [
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "_id",
        as: "role",
        pipeline: [{ $match: { isDeleted: { $eq: false } } }],
      },
    },
    { $unwind: "$role" },
    {
      $match: {
        $and: [
          { isDeleted: { $eq: false } },
          status !== "All"
            ? { status: { $eq: status } }
            : { status: { $ne: null } },
        ],
        ...(searchTerm !== "" && {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { phone: { $regex: searchTerm, $options: "i" } },
            { "role.name": { $regex: searchTerm, $options: "i" } },
          ],
        }),
      },
    },
    { $sort: { [_sort]: _order.toLowerCase() == "asc" ? 1 : -1 } },
  ];
  fields = {
    name: 1,
    email: 1,
    phone: 1,
    status: 1,
    role: { _id: 1, name: 1 },
  };

  const getPanigated = await getPaginatedData(
    db.UsersModel,
    offset,
    limit,
    query,
    fields
  );
  // console.log("=============get user", getPanigated);

  if (!getPanigated) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem occured!"
    );
  }

  return getPanigated;
};

const getById = async (id) => {
  const query = { _id: new ObjectId(id), isDeleted: false };

  const findUser = await OPERATIONS.findOne(db.UsersModel, query);
  console.log("🚀 ~ file: users.js:118 ~ getById ~ findUser:", findUser);
  if (!findUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, "Cannot get this User");
  }
  const user = findUser.toObject();
  if (user.role.toString() != "6585157dd421ccdc62c26dba") {
    delete user.artistInfo;
  }
  delete user.password;
  return user;
};
const update = async (body, id, req) => {
  const { email } = body;
  if (!id) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "'id' is required");
  }

  const checkUser = await OPERATIONS.findById(db.UsersModel, id);
  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, `No user found wit id ${id}`);
  }

  const q = {
    id: { $ne: id },
    email: { $eq: email },
    isDeleted: { $eq: false },
  };

  const checkDuplicate = await OPERATIONS.findOne(db.UsersModel, q);
  if (checkDuplicate) {
    throw new CustomError(StatusCodes.CONFLICT, "User already exists");
  }
  const paramsToUpdate = {
    ...body,
    updated_by: req.userId,
    ...(req.file && {
      avatar_url: `uploads/users/profile/${req.file.filename}`,
    }),
    ...(body?.avatar_remove == "Y" && !req?.file && { avatar_url: "" }),
  };
  const updateUser = await OPERATIONS.updateById(
    db.UsersModel,
    new ObjectId(id),
    paramsToUpdate
  );
  if (!updateUser) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Problem occured while updating User"
    );
  } else {
    return await getById(id);
    return updateUser;
  }
};
const deleteOne = async (id, req) => {
  const checkUser = await OPERATIONS.findById(db.UsersModel, id);
  if (!checkUser) {
    throw new CustomError(StatusCodes.NOT_FOUND, `No User found wit id ${id}`);
  }
  if (checkUser.is_deleted) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "User is already deleted");
  }
  const paramsToUpdate = {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.userId,
  };
  if (id == 1) {
    throw new CustomError(
      StatusCodes.NOT_ACCEPTABLE,
      "Cannot delete this user"
    );
  }

  const updateDelete = await OPERATIONS.updateById(
    db.UsersModel,
    new ObjectId(id),
    paramsToUpdate
  );

  if (!updateDelete) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Problem occured while deleting User"
    );
  }
  return updateDelete;
};

module.exports = { add, getAll, update, deleteOne, getById };
