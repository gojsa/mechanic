const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const User = db.account;
const Account = db.account;
const jwt = require("jsonwebtoken");
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

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    const SECRET_KEY = process.env.JWT_SECRET;
    const accountFind = await Account.findOne({
        where: {
            company_user_name: username
        }
    });
    if (!accountFind) {
        res.status(401).json({ message: "Invalid username or password",success:false });
    }
    const matchPassword = await bcrypt.compare(password, accountFind.password);
    if(!matchPassword){
        res.status(401).json({ message: "Invalid username or password",success:false });

    }
    const user = { id: accountFind.account_id, username: username }; // Ovo zameni pravim podacima
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '12h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false,  // Postavi na true ako koristiš HTTPS
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 // 1 sat
    });

    res.json({ message: 'Prijava uspešna',success:true });
})

const createAccount = asyncHandler(async (req, res) => {
    const { company_name, company_user_name, password
        , phone_number, jib, address, card_number
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const account = await Account.create({
        company_name, company_user_name, password: hashedPassword
        , phone_number, jib, address, card_number
    });
    res.status(201).json({
        account
    });
});
module.exports = {
    getOneAccount,
    renderLogin,
    login,
    createAccount,
    login
}