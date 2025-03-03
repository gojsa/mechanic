const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const { Op } = require("sequelize");
const Appointment = db.appointment;

const allAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.findAll();
    if (!appointments) {
        res.status(404).json({ message: "Nema zakazanih termina!" });
    }
    res.status(200).json({
        appointments
    });
});

module.exports = {allAppointments};


