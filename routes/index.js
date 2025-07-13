const config = require("../config/config");
const authMiddleware = require("../middlewares/auth");

const authRoutes = require("./v1/auth");
const logoutRoutes = require("./v1/logout");
const rolesRoutes = require("./v1/roles");
const usersRoutes = require("./v1/users");
const catalogRoutes = require("./v1/catalogs");

const { AUTH, LOGOUT, USERS, ROLES, CATALOGS } =
  require("../utils/constants").ROUTE_CONSTANTS;

const apiRoute = `${config.defaultRoute.apiBaseRoot}/${config.defaultRoute.apiVersion}`;

module.exports = function (app) {
  app.use(`/${apiRoute}/${AUTH}`, authRoutes);
  app.use(`/${apiRoute}/${LOGOUT}`, logoutRoutes);

  app.use(`/${apiRoute}/${ROLES}`, authMiddleware, rolesRoutes);

  app.use(`/${apiRoute}/${USERS}`, authMiddleware, usersRoutes);

  app.use(`/${apiRoute}/${CATALOGS}`, authMiddleware, catalogRoutes);

  app.get(`/${apiRoute}/test`, function (req, res) {
    res.send("Hello Testing....");
  });
};
