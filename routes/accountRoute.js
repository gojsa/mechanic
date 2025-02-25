const express = require("express");
const router = express.Router();

const {
    getOneAccount,
    renderLogin,
    createAccount,
    login
} = require("../controllers/accountController");

router.get("/", renderLogin);
router.get("/:account_id", getOneAccount);
router.post("/", createAccount);
router.post("/login", login);


module.exports = router;