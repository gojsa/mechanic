const express = require("express");
const router = express.Router();
const {protect,clearCookies} = require("../middleware/auth");
const {
    getOneAccount,
    renderLogin,
    createAccount,
    login,
} = require("../controllers/accountController");
router.get("/protect", protect);
router.get("/logout", clearCookies);
router.get("/login", renderLogin);
router.get("/:account_id", getOneAccount);
router.post("/", createAccount);
router.post("/login", login);


module.exports = router;