const express = require("express");
const { getAllController } = require("../../controllers/roles.controllers");
const { getAllSchema } = require("../../validators/roles");

const router = express.Router();

router.route("/").get(getAllSchema, getAllController);

module.exports = router;
