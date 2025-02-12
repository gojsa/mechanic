const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const { Op } = require("sequelize");

// get user data
const getOneUser = asyncHandler(async (req, res) => {
    const search = req.query.search;
    const limit = req.params.limit;
    const offset = req.params.offset;
    const user = await User.findAndCountAll({
        where: {
            [Op.or]: [
                { first_name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } },
                { jmbg: { [Op.iLike]: `%${search}%` } }
            ]
        },
        limit: Number(limit),
        offset: Number(offset - 1) * limit,
    });
    if (!user) {
        res.status(404).json({ message: "Korisnik nije pronadjen!" });
    }
    res.json({
        user: user.rows,
        count: user.count
    });
});

// create user
const createUser = asyncHandler(async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const jmbg = req.body.jmbg;
    const birth_date = req.body.birth_date;
    const email = req.body.email;
    if (!first_name || !last_name) {
        res.status(400).json({ message: "Ime i prezime su obavezni podaci!" });
    }
    try {
        const user = await User.create({
            first_name,
            last_name,
            jmbg,
            birth_date,
            email
        });

        if (!user) {
            res.status(500).json({ message: "Greska prilikom kreiranja korisnika!" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
    }

});

module.exports = { getOneUser, createUser };