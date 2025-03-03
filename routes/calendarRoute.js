const express = require("express");
const router = express.Router();
const {protect,clearCookies} = require("../middleware/auth");
const {
    allAppointments
} = require("../controllers/calendarController");
router.get("/appointments", allAppointments);


module.exports = router;