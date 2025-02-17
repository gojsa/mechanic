const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const ProductionOrder = db.productionOrder;
const { Op, QueryTypes } = require("sequelize");
const car = require("../models/car");

const createProductionOrder = asyncHandler(async (req, res) => {
    const { user_id, car_id, number, mileage, note, description, price } = req.body;
    const productionOrder = await ProductionOrder.create({
        user_id, car_id, number, mileage, note, description, price
    });

    if(!productionOrder) {
        res.status(400).json({ message: "Nalog nije kreiran!" });
    }
    res.status(201).json({
        productionOrder
    });
});

const updateProductionOrder = asyncHandler(async (req, res) => {
    const production_order_id = req.params.production_order_id;
    const { user_id, car_id, number, mileage, note, description, price } = req.body;
    const productionOrder = await ProductionOrder.update({
        user_id, car_id, number, mileage, note, description, price
    }, {
        where: {
            production_order_id
        }
    });

    if(!productionOrder) {
        res.status(400).json({ message: "Nalog nije azuriran!" });
    }
    res.status(200).json({
        productionOrder
    });
});

const deleteProductionOrder = asyncHandler(async (req, res) => {
    const production_order_id = req.params.production_order_id;
    const productionOrder = await ProductionOrder.destroy({
        where: {
            production_order_id
        }
    });

    if(!productionOrder) {
        res.status(400).json({ message: "Nalog nije obrisan!" });
    }
    res.status(200).json({
        productionOrder
    });
});

const getProductionOrders = asyncHandler(async (req, res) => {
    const car_id = req.params.car_id;
    const productionOrders = await ProductionOrder.findAll({
        include: [
            {
                model: User
            },
            {
                model: Car
            }
        ],
        where:{
            car_id
        }
    });

    if(!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.status(200).json({
        productionOrders
    });
});

const findAllProductionOrders = asyncHandler(async (req, res) => {
    const productionOrders = await ProductionOrder.findAll({
        include: [
            {
                model: User
            },
            {
                model: Car
            }
        ]
    });

    if(!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.status(200).json({
        productionOrders
    });
});

module.exports = { createProductionOrder, updateProductionOrder, deleteProductionOrder, getProductionOrders, findAllProductionOrders };