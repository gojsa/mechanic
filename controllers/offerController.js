const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const Offer = db.offer;
const OfferArticle = db.offerArticle;
const { Op, QueryTypes, where } = require("sequelize");
const account = require("../models/account");

const redirectToOffer = asyncHandler(async (req, res) => {

    res.render("offer/allOffer");
})
const findAllOffers = asyncHandler(async (req, res) => {
    const search = req.query.search;
    const limit = req.params.limit;
    const offset = req.params.offset;
    const account_id = req.session.user;
    const queryCount = `
    select count(*) as count from offer
       where
    account_id = ${account_id} and
    first_name ilike '%${search}%' or
    last_name ilike '%${search}%' or 
    car_name ilike '%${search}%' or
    car_plate ilike '%${search}%' or
    jib like '%${search}%'
    `;
    const offersCount = await db.sequelize.query(queryCount, {
        type: QueryTypes.SELECT,
    });
    const query = `
    select * from offer
    where
    account_id = ${account_id} and
    first_name ilike '%${search}%' or
    last_name ilike '%${search}%' or 
    car_name ilike '%${search}%' or
    car_plate ilike '%${search}%' or
    jib like '%${search}%'
    order by created_at desc
      limit ${limit} offset ${offset - 1}

    `;
    const offers = await db.sequelize.query(query, {
        type: QueryTypes.SELECT,
    });

    if (!offers) {
        res.status(404);
        throw new Error("No offers found");
    }
    res.status(200).json({ offers, totalCount: offersCount[0].count });
})

const createOffer = asyncHandler(async (req, res) => {
    const {  first_name, last_name, car_name, car_plate, jib, note } = req.body;
    const account_id = req.session.user;
    let number;
    const findOffer = await Offer.findOne({
        order: [['created_at', 'DESC']],
    });
    const year = new Date().getFullYear().toString().slice(-2); // Get the last two digits of the year
    if (!findOffer) {
        number = `0001/${year}`;
    } else {
        const lastNumber = findOffer.number.split("/");
        if (lastNumber[1] == year) {
            number = `${(parseInt(lastNumber[0]) + 1).toString().padStart(4, '0')}/${year}`;
        } else {
            number = `0001/${year}`;
        }
    }
    
    const offer = await Offer.create({
        number,
        first_name,
        last_name,
        car_name,
        car_plate,
        jib,
        note,
        account_id
    });
    if (!offer) {
        res.status(400);
        throw new Error("Offer not created");
    }
    res.status(201).json({ offer });
})
const updateOffer = asyncHandler(async (req, res) => {
    const offer_id = req.params.offer_id;
    const { number, first_name, last_name, car_name, car_plate, jib, note } = req.body;
    const offer = await Offer.update({
        number,
        first_name,
        last_name,
        car_name,
        car_plate,
        jib,
        note,
    }, {
        where: {
            offer_id
        },
    });
    if (!offer) {
        res.status(400);
        throw new Error("Offer not updated");
    }
    res.status(201).json({ offer });
})
const deleteOffer = asyncHandler(async (req, res) => {
    const offer_id = req.params.offer_id;
    const offer = await Offer.destroy({
        where: {
            offer_id
        },
    });
    if (!offer) {
        res.status(400);
        throw new Error("Offer not deleted");
    }
    res.status(201).json({ offer });
})

const findAllOfferArticles = asyncHandler(async (req, res) => {
    const offer_id = req.params.offer_id;
    const offerArticles = await OfferArticle.findAll({
        where: {
            offer_id
        },
    });
    if (!offerArticles) {
        res.status(404);
        throw new Error("No offer articles found");
    }
    res.render("offer/offerArticle", { offerArticles });
});
const createOfferArticle = asyncHandler(async (req, res) => {
    const { offer_id, article_name, amount, price_with_vat, note } = req.body;
    const offerArticle = await OfferArticle.create({
        offer_id, article_name, amount, price_with_vat, note
    });
    if (!offerArticle) {
        res.status(400);
        throw new Error("Offer article not created");
    }
    res.status(201).json({ offerArticle });
})
const updateOfferArticle = asyncHandler(async (req, res) => {
    const offer_article_id = req.params.offer_article_id;
    const { article_name, amount, price_with_vat, note } = req.body;
    const offerArticle = await OfferArticle.update({
        article_name, amount, price_with_vat, note
    }, {
        where: {
            offer_article_id
        },
    });
    if (!offerArticle) {
        res.status(400);
        throw new Error("Offer article not updated");
    }
    res.status(201).json({ offerArticle });
})

const deleteOfferArticle = asyncHandler(async (req, res) => {
    const offer_article_id = req.params.offer_article_id;
    const offerArticle = await OfferArticle.destroy({
        where: {
            offer_article_id
        },
    });
    if (!offerArticle) {
        res.status(400);
        throw new Error("Offer article not deleted");
    }
    res.status(201).json({ offerArticle });
})

const renderPrintOffer = asyncHandler(async (req, res) => {
    const offer_id = req.params.offer_id;
    const offer = await Offer.findOne({
        where: {
            offer_id
        },
    });
    const offerArticles = await OfferArticle.findAll({
        where: {
            offer_id
        },
    });
    if (!offer || !offerArticles) {
        res.status(404);
        throw new Error("No offer or offer articles found");
    }
    res.render("offer/printOffer", { offer, offerArticles });
});
module.exports = {renderPrintOffer,deleteOfferArticle, updateOfferArticle, createOfferArticle, findAllOfferArticles, deleteOffer, updateOffer, redirectToOffer, createOffer, findAllOffers };