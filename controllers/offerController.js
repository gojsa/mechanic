const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const Offer = db.offer;
const OfferArticle = db.offerArticle;
const { Op, QueryTypes, where } = require("sequelize");

const findAllOffers = asyncHandler(async (req, res) => {
    const search = req.query.search;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const query = `
    select * from offer
    where
    first_name like '%${search}%' or
    last_name like '%${search}%' or 
    car_name like '%${search}%' or
    car_plate like '%${search}%' or
    jib like '%${search}%'
    limit ${limit} offset ${offset}
    order by created_at desc

    `;
    const offers = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
    });

    if (!offers) {
        res.status(404);
        throw new Error("No offers found");
    }
    res.status(200).json(offers);
})

module.exports = { findAllOffers };