const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");


router.get("/:user_id", getOneUser);
router.get("/:limit/:offset", getUsers);
router.post("/", createUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

module.exports = router;