const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

router.get("/:user_id", getOneUser);
router.get("/:limit/:offset",protect, getUsers);
router.post("/", createUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

module.exports = router;