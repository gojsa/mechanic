const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Account = db.account;

const protect = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const token = req.cookies.token;

      const decode = jwt.decode(token, process.env.JWT_SECRET);


      //Get user from token
      let attributes = ['account_id', 'company_user_name', 'company_name']
      Account.findByPk(decode.id, {
        attributes
      })
        .then(account => {
          req.account = account;
          next();
          return;
        });

    } catch (error) {
      res.render("login");

    }
  }
  else {
    res.render("login");
  }

});

function clearCookies(res) {
  const token = 'token';
  const session = 'session'

  res.clearCookie(token, { httpOnly: true, expires: new Date(0) });
  res.clearCookie(session, { httpOnly: true, expires: new Date(0) });
}
module.exports = { protect };