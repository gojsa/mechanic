const express = require("express");
const router = express.Router();

const {
    getOneAccount,
    renderLogin
} = require("../controllers/accountController");

router.get("/", renderLogin);
router.get("/:account_id", getOneAccount);


module.exports = router;