const express = require("express");
const router = express.Router();

const {
  getOneUser,
  createUser
  } = require("../controllers/userController");

  router.get("/:limit/:offset",  getOneUser);
  router.post("/",  createUser);

  module.exports = router;