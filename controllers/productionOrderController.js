const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const ProductionOrder = db.productionOrder;
const { Op, QueryTypes } = require("sequelize");
const car = require("../models/car");

const createProductionOrder = asyncHandler(async (req, res) => {
    const { user_id, car_id, mileage, note, description, price } = req.body;
    let number;
    const findProduction = await ProductionOrder.findOne({
        order: [['created_at', 'DESC']],
    });
    const year = new Date().getFullYear().toString().slice(-2); // Get the last two digits of the year
    if (!findProduction) {
        number = `0001/${year}`;
    } else {
        const lastNumber = findProduction.number.split("/");
        if (lastNumber[1] == year) {
            number = `${(parseInt(lastNumber[0]) + 1).toString().padStart(4, '0')}/${year}`;
        } else {
            number = `0001/${year}`;
        }
    }
    const productionOrder = await ProductionOrder.create({
        user_id, car_id, number, mileage, note, description, price
    });

    if (!productionOrder) {
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

    if (!productionOrder) {
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

    if (!productionOrder) {
        res.status(400).json({ message: "Nalog nije obrisan!" });
    }
    res.status(200).json({
        productionOrder
    });
});

const getProductionOrders = asyncHandler(async (req, res) => {
    const car_id = req.query.car_id;
    console.log(car_id);
    const productionOrders = await ProductionOrder.findAll({
        include: [
            {
                model: User
            },
            {
                model: Car
            }
        ],
        where: {
            car_id
        }
    });

    if (!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.status(200).json({
        productionOrders
    });
});


const findAllProductionOrdersTable = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const queryCount = `
    select count(*) from production_order as p
    join "user" as u  on u.user_id = p.user_id
    join "car" as c on c.car_id = p.car_id



    `;
    const productionOrdersCount = await db.sequelize.query(queryCount, { type: QueryTypes.SELECT });


    const query = `
    SELECT 
	 p.production_order_id,
	 p.number,
	 c.chassis_number,
	 c.plate_number,
	 u.first_name,
	 u.last_name,
	 c.mileage,
	 p.note,
	 p.description,
	 p.created_at,
     p.price
	 from production_order as p 
	 join "user" as u  on u.user_id = p.user_id
	 join "car" as c on c.car_id = p.car_id
     order by p.created_at desc
    limit ${limit } offset ${offset}
   `
    const productionOrders = await db.sequelize.query(query, { type: QueryTypes.SELECT });

    if (!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.render("productionOrder/allProductions", {
        productionOrders: productionOrders,
        totalItems: productionOrdersCount[0].count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(productionOrdersCount[0].count / limit)
    });
});
const findAllProductionOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const queryCount = `
    select count(*) from production_order as p
    join "user" as u  on u.user_id = p.user_id
    join "car" as c on c.car_id = p.car_id
    where
    (p.number ilike '%${search}%'
    or c.chassis_number ilike '%${search}%'
    or u.first_name ilike '%${search}%'
    or u.last_name ilike '%${search}%'
    or c.plate_number ilike '%${search}%'
)

    `;
    const productionOrdersCount = await db.sequelize.query(queryCount, { type: QueryTypes.SELECT });

    const query = `
 SELECT 
	 p.production_order_id,
	 p.number,
	 c.chassis_number,
	 c.plate_number,
	 u.first_name,
	 u.last_name,
	 c.mileage,
	 p.note,
	 p.description,
	 p.created_at,
     p.price
	 from production_order as p 
	 join "user" as u  on u.user_id = p.user_id
	 join "car" as c on c.car_id = p.car_id
	where 
	(p.number ilike '%${search}%'
	or c.chassis_number ilike '%${search}%'
	or u.first_name ilike '%${search}%'
	or u.last_name ilike '%${search}%' 
	or c.plate_number ilike '%${search}%'
 )
    order by p.created_at desc
    limit ${limit} offset ${offset}

`
    const productionOrders = await db.sequelize.query(query, { type: QueryTypes.SELECT });

    res.json({
        productionOrders: productionOrders,
        totalItems: productionOrdersCount[0].count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(productionOrdersCount[0].count / limit)
    });
});

const carProduction = asyncHandler(async (req, res) => {
    const car_id = req.query.car_id;

    const productionOrders = await ProductionOrder.findAll({
        include: [
            {
                model: User
            },
            {
                model: Car
            }
        ],
        where: {
            car_id
        }
    });

    if (!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.render("productionOrder/carProduction", {
        productionOrders
    });
});


const detailProduction = asyncHandler(async (req, res) => {
    const production_order_id = req.params.production_order_id;


    const query = `
   SELECT 
    p.production_order_id,
    p.number,
    c.chassis_number,
    c.plate_number,
    u.first_name,
    u.last_name,
    c.mileage,
    p.note,
    p.description,
    p.created_at,
    p.price
    from production_order as p 
    join "user" as u  on u.user_id = p.user_id
    join "car" as c on c.car_id = p.car_id
    where p.production_order_id = ${production_order_id}
  `
    const productionOrders = await db.sequelize.query(query, { type: QueryTypes.SELECT });


    if (!productionOrders) {
        res.status(404).json({ message: "Nalozi nisu pronadjeni!" });
    }
    res.render("productionOrder/productionDetail", {
        productionOrders
    });
})
module.exports = { findAllProductionOrdersTable, createProductionOrder, updateProductionOrder, deleteProductionOrder, getProductionOrders, findAllProductionOrders, carProduction, detailProduction };