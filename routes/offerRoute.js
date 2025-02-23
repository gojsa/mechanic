const express = require("express");
const router = express.Router();

const {
    findAllOffers
} = require("../controllers/offerController");


router.get("/redirect-to-all", findAllOffers);


module.exports = router;