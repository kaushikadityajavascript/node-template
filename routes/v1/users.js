const express = require("express");
const {
  addController,
  getAllController,
  updateByIdController,
  deleteByIdController,
  getByIdController,
} = require("../../controllers/users.controllers");
const {
  addSchema,
  getAllSchema,
  updateSchema,
  deleteSchema,
  getByIdSchema,
} = require("../../validators/users");
const uploadImage = require("../../middlewares/uploadImage");

const router = express.Router();

router
  .route("/")
  .get(getAllSchema, getAllController)
  .post(
    uploadImage("uploads/users/profile").single("profilePhoto"),
    addSchema,
    addController
  );
router
  .route("/:id")
  .get(getByIdSchema, getByIdController)
  .put(
    uploadImage("uploads/users/profile").single("profilePhoto"),
    updateSchema,
    updateByIdController
  )
  .delete(deleteSchema, deleteByIdController);

module.exports = router;
