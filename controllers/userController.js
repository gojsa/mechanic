const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const { Op, QueryTypes } = require("sequelize");

const getOneUser = asyncHandler(async (req, res) => {
    const user_id = req.params.user_id;
    const user = await User.findByPk(user_id);
    if (!user) {
        res.status(404).json({ message: "Korisnik nije pronadjen!" });
    }
    res.status(200).json({
        user
    });
});

// get user data

const getUsers = asyncHandler(async (req, res) => {
    try {
        console.log(req.session.user)
        const search = req.query.search || "";
        const limit = parseInt(req.params.limit, 10) || 10;
        const offset = (parseInt(req.params.offset, 10) - 1) * limit || 0;

        // Upit za broj rezultata
        const countResult = await db.sequelize.query(
            `SELECT COUNT(*) AS count
             FROM "user"
             LEFT JOIN "car" ON "user"."user_id" = "car"."user_id"
             WHERE 
             "user".account_id = ${req.session.user} AND
             "user"."first_name" ILIKE :search 
             OR "user"."last_name" ILIKE :search
             OR "user"."jmbg" ILIKE :search
             OR "car"."chassis_number" ILIKE :search`,
            {
                replacements: { search: `%${search}%` },
                type: QueryTypes.SELECT
            }
        );

        // Upit za paginirane podatke
        const query = 
        `
SELECT subquery.*, 
       row_number() OVER (ORDER BY subquery."user_id") as count
FROM (
    SELECT "user".*, "car"."chassis_number","car"."plate_number",
           row_number() OVER (PARTITION BY "user"."user_id" ORDER BY "car"."chassis_number") as row_num
    FROM "user"
    LEFT JOIN "car" ON "user"."user_id" = "car"."user_id"
    where
    "user".account_id = ${req.session.user} AND
    (
            "first_name" ILIKE '%${search}%' 
             OR "last_name" ILIKE '%${search}%'
             OR "jmbg" ILIKE '%${search}%'
             OR "chassis_number" ILIKE '%${search}%'
             OR "plate_number" ILIKE '%${search}%'
             )
) subquery
WHERE row_num = 1
`;
        const users = await db.sequelize.query(
            query,
            {
             //   replacements: { search: `%${search}%`, limit, offset },
                type: QueryTypes.SELECT
            }
        );

        const count = countResult[0]?.count || 0; // Ukupan broj rezultata

        if (!users.length) {
            return res.status(404).json({ message: "Korisnik nije pronađen!" });
        }

        res.status(200).json({
            user: users, // Lista korisnika sa podacima
            count, // Ukupan broj rezultata (za paginaciju)
            limit,
            offset
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Greška na serveru!" });
    }
});

// create user
const createUser = asyncHandler(async (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const jmbg = req.body.jmbg;
    const birth_date = req.body.birth_date;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const jib = req.body.jib;
    const account_id = req.session.user;
    if (!first_name || !last_name) {
        res.status(400).json({ message: "Ime i prezime su obavezni podaci!" });
    }
    try {
        const user = await User.create({
            first_name,
            last_name,
            jmbg,
            birth_date,
            email,
            phone_number,
            jib,
            account_id
        });

        if (!user) {
            res.status(500).json({ message: "Greska prilikom kreiranja korisnika!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

// update user
const updateUser = asyncHandler(async (req, res) => {
    const user_id = req.params.user_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const jmbg = req.body.jmbg;
    const birth_date = req.body.birth_date;
    const email = req.body.email;
    const phone_number = req.body.phone_number;

    try {
        const user = await User.update({
            first_name,
            last_name,
            jmbg,
            birth_date,
            email,
            phone_number
        }, {
            where: {
                user_id
            }
        });

        if (!user) {
            res.status(500).json({ message: "Greska prilikom izmjene korisnika!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const user = await User.destroy( { 
            where: {
                user_id
            }
        }
        );

        if (!user) {
            res.status(500).json({ message: "Greska prilikom brisanja korisnika!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


const renderCalendar = asyncHandler(async (req, res) => {
   

    res.render("calendar/calendar");
});

module.exports = { getUsers, createUser, getOneUser, updateUser, deleteUser,renderCalendar };