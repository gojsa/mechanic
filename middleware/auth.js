const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Account = db.account;

const protect = async (req, res) => {
  try {
    if (!req.cookies.token) {
      // return res.status(401).json({ message: "Not authorized to access this route",success:false });
      res.json({ success: false });
    }

    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    let attributes = ['account_id', 'company_user_name', 'company_name'];
    const account = await Account.findByPk(decode.id, { attributes });

    if (!account) {
      res.json({ success: false });
    } else {
      req.account = account;
      res.json({ success: true });
    }


    // res.json({success:true})
  } catch (error) {
    console.log("qaaaaaaaaaaaaa")
  }
};

const protectMiddlwere = async (req, res,next) => {
  try {
    console.log(req.session.user)
    if (!req.session.user) {
      // return res.status(401).json({ message: "Not authorized to access this route",success:false });
      res.json({ success: false });
      // res.render('login', { user: req.session.user });
    }

    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    let attributes = ['account_id', 'company_user_name', 'company_name'];
    const account = await Account.findByPk(decode.id, { attributes });

    if (!account) {
      res.json({ success: false });
    } else {
      // res.json({ success: true });
      next();
    }


    // res.json({success:true})
  } catch (error) {
    console.log(error)
    console.log("qaaaaaaaaaaaaa")
  }
};




const clearCookies = async (req, res) => {
  const token = 'token';
  res.clearCookie(token, { httpOnly: true, expires: new Date(0) });
  res.json({ success: true })
};

module.exports = { protect, clearCookies, protectMiddlwere };