const ROUTE_CONSTANTS = {
  AUTH: "auth",
  ROLES: "roles",
  USERS: "users",
  CATALOGS: "catalogs",
  LOGOUT: "logout",
};

const AUTH_CONSTANTS = {
  LOGIN: "login",
  REGISTER: "register",
  VERIFY: "verify",
  RESET_PASSWORD: "reset-password/:token",
  FORGOT_PASSWORD: "forgot-password",
  CHANGE_PASSWORD: "change-password",
  SET_PASSWORD: "set-password",
  DELETE_PROFILE: "delete-profile",
  UPDATE_PROFILE: "update-profile",
  REFRESH_TOKEN: "refresh-token",
};

const CRUD_CONSTANTS = {
  CREATE: "create",
  ADD: "add",
  GET_ALL: "get-all",
  GET: "get",
  GET_STATICSTICS: "get-staticstics",
  GET_BY_ID: "get/:id",
  UPDATE: "update",
  UPDATE_BY_ID: "update/:id",
  DELTE_BY_ID: "delete/:id",
  UPLOAD_BY_ID: "upload/:id",
  MULTI_UPDATE: "multi-update",
  MULTI_DELETE: "multi-delete",
};

module.exports = { ROUTE_CONSTANTS, AUTH_CONSTANTS, CRUD_CONSTANTS };
