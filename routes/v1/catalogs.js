const express = require("express");
const {
  addController,
  getAllController,
  getByIdController,
  updateByIdController,
  deleteByIdController,
  bulkDeleteController,
} = require("../../controllers/catalogs.controllers");
const {
  addSchema,
  getAllSchema,
  getByIdSchema,
  updateSchema,
  deleteSchema,
  bulkDeleteSchema,
} = require("../../validators/catalogs");
const uploadImage = require("../../middlewares/uploadImage");

const router = express.Router();

router
  .route("/")
  .post(
    uploadImage("uploads/catalogs/image").single("image"),
    addSchema,
    addController
  )
  .get(getAllSchema, getAllController);

router
  .route("/:id")
  .get(getByIdSchema, getByIdController)
  .put(updateSchema, updateByIdController)
  .delete(deleteSchema, deleteByIdController);

router.route("/").delete(bulkDeleteSchema, bulkDeleteController);

module.exports = router;
