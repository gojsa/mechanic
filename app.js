const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config({
  path: ".env"
});
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
  origin: process.env.DOMAIN,
  credentials: true
}));

app.use(
  express.json({
    limit: "500mb"
  })
);
app.use(
  express.urlencoded({
    extended: false,
    limit: "500mb"
  })
);

const connectDB = require("./config/db");
// konektovanje na bazu


// const {trigger} = require("./config/trigger")
// TRIGGER
// trigger()
// Prvo pokretanje aplikacije
(async () => {
//   await connectDB.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
//   await connectDB.sequelize.query("SET GLOBAL sql_mode = ''");
//   await connectDB.sequelize.query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));`);
  await connectDB.sequelize
    .sync({
    //   force: true,
      alter: true
    })
    .then(async () => {
      //  await connectDB.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("DB started");
    })
    .catch((err) => {
      console.log(err);
    });
})();

module.exports = app;
