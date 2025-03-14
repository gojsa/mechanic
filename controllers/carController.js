const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const { Op } = require("sequelize");
const account = require("../models/account");


const createCar = asyncHandler(async (req, res) => {
    const user_id = req.body.user_id;
    const name = req.body.name;
    const chassis_number = req.body.chassis_number;
    const fuel = req.body.fuel;
    const year = req.body.year;
    const note = req.body.note;
    const motor_number = req.body.motor_number;
    const mileage = req.body.mileage;
    const plate_number = req.body.plate_number;
    const account_id = req.session.user;
    if (!name || !chassis_number) {
        res.status(400).json({ message: "Ime i broj sasije su obavezni podaci!" });
    }
    try {
        const car = await Car.create({
            user_id,
            name,
            chassis_number,
            fuel,
            year,
            note,
            motor_number,
            mileage,
            plate_number,
            account_id
        });
        res.status(201).json({
            car
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const renderCar = asyncHandler(async (req, res) => {
    const user_id = req.query.user_id;
    const account_id = req.session.user;
    const car = await Car.findAll({
        where: {
            user_id: user_id,
            account_id
        }
    });
    if (!car) {
        res.status(404).json({ message: "Automobili nisu pronadjeni!" });
    }
    res.render("car/userCars", {
        car
    });
});

const updateCar = asyncHandler(async (req, res) => {
    const car_id = req.params.car_id;
    const name = req.body.name;
    const chassis_number = req.body.chassis_number;
    const fuel = req.body.fuel;
    const year = req.body.year;
    const note = req.body.note;
    const motor_number = req.body.motor_number;
    const mileage = req.body.mileage;
    const plate_number = req.body.plate_number;
    if (!name || !chassis_number) {
        res.status(400).json({ message: "Ime i broj sasije su obavezni podaci!" });
    }
    try {
        const car = await Car.update({
            name,
            chassis_number,
            fuel,
            year,
            note,
            motor_number,
            mileage,
            plate_number
        }, {
            where: {
                car_id
            }
        });
        res.status(200).json({
            car
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const deleteCar = asyncHandler(async (req, res) => {
    const car_id = req.params.car_id;
    try {
        const car = await Car.destroy({
            where: {
                car_id
            }
        });
        res.status(200).json({
            car
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = { createCar, renderCar, updateCar, deleteCar };