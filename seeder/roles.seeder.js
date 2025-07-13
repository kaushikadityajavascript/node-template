const OPERATIONS = require("../repository/operations");
const { RolesModel } = require("../models");
const { connectDB } = require("../middlewares/dbConnect");

const userRoles = async () => {
  connectDB();
  const roles = [
    {
      name: "Admin",
      status: "Active",
      isDeleted: false,
    },
    {
      name: "Operation Manager",
      status: "Active",
      isDeleted: false,
    },
    {
      name: "Inverntory and Equipment Manager",
      status: "Active",
      isDeleted: false,
    },
    {
      name: "Artist",
      status: "Active",
      isDeleted: false,
    },
  ];

  await OPERATIONS.bulkCreate(RolesModel, roles);
};

userRoles();
