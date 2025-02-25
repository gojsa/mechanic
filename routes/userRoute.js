const express = require("express");
const router = express.Router();
const {protect,protectMiddlwere} = require("../middleware/auth");
const {
  getUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");


router.get("/:user_id",protectMiddlwere, getOneUser);
router.get("/:limit/:offset",protectMiddlwere, getUsers);
router.post("/", protectMiddlwere, createUser);
router.put("/:user_id",protectMiddlwere, updateUser);
router.delete("/:user_id", protectMiddlwere, deleteUser);

module.exports = router;