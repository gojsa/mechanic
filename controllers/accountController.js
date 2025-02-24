const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.account;
const { Op, QueryTypes } = require("sequelize");

const getOneAccount = asyncHandler(async (req, res) => {
    const account_id = req.params.account_id;
    const account = await Account.findByPk(account_id);
    if (!account) {
        res.status(404).json({ message: "Account not found!" });
    }
    res.status(200).json({
        account
    });
});
const renderLogin = (req, res) => {
    res.render("login");
}
module.exports = {
    getOneAccount,
    renderLogin
}