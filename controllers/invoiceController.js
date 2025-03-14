const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const ProductionOrder = db.productionOrder;
const Invoice = db.invoice;
const InvoiceArticle = db.invoiceArticle;
const Account = db.account;
const { Op, QueryTypes, where } = require("sequelize");
let invoiceArticle

const renderInvoice = asyncHandler(async (req, res) => {
    const production_order_id = req.query.production_order_id;
    const account_id = req.session.user;
    const invoice = await Invoice.findAll({
        include: [{
            model: User,
        },
        {
            model: Car
        }],
        where: {
            production_order_id
        }
    });




    if (!invoice) {
        res.status(500).json({ message: "Nalozi nisu pronadjeni!" });
    }
    if (invoice.length > 0) {
        invoiceArticle = await InvoiceArticle.findAll({
            where: {
                invoice_id: invoice[0].invoice_id
            }
        });
        if (!invoiceArticle) {
            res.status(500).json({ message: "Nalozi nisu pronadjeni!" });
        }
    } else {
        invoiceArticle = []
    }
    const account = await Account.findOne({
        attributes: ["account_id", "company_name", "company_user_name","phone_number", "jib", "address", "card_number"],
        where: {
            account_id
        }
    });

    res.render("invoice/addinvoice", {
        invoice,
        invoiceArticle,
        account
    });
});

const createInovice = asyncHandler(async (req, res) => {
    const production_order_id = req.body.production_order_id;
    const payment_date = req.body.payment_date;
    const activated_date = req.body.activated_date;
    const note = req.body.note;
    const account_id = req.session.user;
    try {
        let number;
        const findInvoice = await Invoice.findOne({
            order: [['created_at', 'DESC']],
        });
        const year = new Date().getFullYear().toString().slice(-2); // Get the last two digits of the year
        if (!findInvoice) {
            number = `0001/${year}`;
        } else {
            const lastNumber = findInvoice.number.split("/");
            if (lastNumber[1] == year) {
                number = `${(parseInt(lastNumber[0]) + 1).toString().padStart(4, '0')}/${year}`;
            } else {
                number = `0001/${year}`;
            }
        }
        const productionOrder = await ProductionOrder.findByPk(+production_order_id);
        const invoice = await Invoice.create({
            production_order_id,
            user_id: productionOrder.user_id,
            car_id: productionOrder.car_id,
            number,
            payment_date,
            activated_date,
            note,
            account_id
        });

        if (!invoice) {
            res.status(400).json({ message: "Faktura nije kreirana!" });
        }
        res.status(201).json({ invoice });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const updateInvoiceStatus = asyncHandler(async (req, res) => {
    const invoice_id = req.body.invoice_id;

    const findInvoice = await Invoice.findByPk(invoice_id);

    const invoice = await Invoice.update({
        status: "CLOSED"
    }, {
        where: {
            invoice_id
        }
    })

    if (!invoice) {
        res.status(500).json({ message: "Faktura nije pronadjena!" });
    }

    const updateProduction = await ProductionOrder.update({
        status: "CLOSED"
    }, {
        where: {
            production_order_id: findInvoice.production_order_id
        }
    });
    if (!updateProduction) {
        res.status(500).json({ message: "Nalog nije pronadjen!" });
    }
    res.status(200).json({ message: "Faktura je zatvorena!" });
});

const createInvoiceArticle = asyncHandler(async (req, res) => {
    const amount = req.body.amount;
    const price_with_vat = req.body.price_with_vat;
    const invoice_id = req.body.invoice_id;
    const article_name = req.body.article_name;
    const note = req.body.note;
    const unit_of_measure = req.body.unit_of_measure;
    const discount = req.body.discount;
    const invoiceArticle = await InvoiceArticle.create({
        amount,
        price_with_vat,
        price_with_out_vat: 0,
        invoice_id,
        article_name,
        note,
        unit_of_measure,
        discount
    });
    if (!invoiceArticle) {
        res.status(500).json({ message: "Artikal nije kreiran!" });
    }
    res.status(201).json({ invoiceArticle });
})

const allInvoices = asyncHandler(async (req, res) => {
    const offset = req.params.offset;
    const limit = req.params.limit;
    const search = req.query.search;
    const account_id = req.session.user;
    
    const quryCount = `select count(*) as count from invoice i
            join "user" u on u.user_id = i.user_id
        join car c on c.car_id = i.car_id
        join production_order p on p.production_order_id = i.production_order_id
    where i.account_id = ${account_id} and
    (i.number ilike '%${search}%' or p.number ilike '%${search}%' or concat(u.first_name,' ',u.last_name) ilike '%${search}%' or c.name ilike '%${search}%')
        
    `;

    const count = await db.sequelize
        .query(quryCount, {
            type: QueryTypes.SELECT
        });
    if (!count) {
        res.status(500).json({ message: "Fakture nisu pronadjene!" });
    }

    const query = `
    select 
    i.*,
        i.number as broj_racuna,
        p.number as broj_naloga,
        concat(u.first_name,' ',u.last_name) as ime_vlasnika_vozila,
        c.name as naziv_vozila,
        i.activated_date as datum_kreiranja_fakture,
        i.status
        from invoice i 
        join "user" u on u.user_id = i.user_id
        join car c on c.car_id = i.car_id
        join production_order p on p.production_order_id = i.production_order_id
        where 
        i.account_id = ${account_id} and
        (i.number ilike '%${search}%' or p.number ilike '%${search}%' or concat(u.first_name,' ',u.last_name) ilike '%${search}%' or c.name ilike '%${search}%')
        order by i.activated_date desc
        offset ${offset - 1} limit ${limit}
    `
    
    const invoices = await db.sequelize
        .query(query, {
            type: QueryTypes.SELECT
        });
    if (!invoices) {
        res.status(500).json({ message: "Fakture nisu pronadjene!" });
    }
    res.status(200).json({ invoices, totalCount: count[0].count });
});

const redirectToAll = asyncHandler(async (req, res) => {
    res.render("invoice/Allinvoices");
})

const updateInvoice = asyncHandler(async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const payment_date = req.body.payment_date;
    const activated_date = req.body.activated_date;
    const note = req.body.note;
    const status = req.body.status;

    const findInvoice = await Invoice.findByPk(invoice_id);
    if (!findInvoice) {
        res.status(500).json({ message: "Faktura nije pronadjena!" });
    }
    const findInvoiceArticle = await InvoiceArticle.findAll({
        where: {
            invoice_id
        }
    });
    if(findInvoiceArticle.length === 0){
        res.status(500).json({ message: "Faktura nema artikala!" });
    }
    if (findInvoice.status != status) {
        const updateProduction = await ProductionOrder.update({
            status
        }, {
            where: {
                production_order_id: findInvoice.production_order_id
            }
        });
        if (!updateProduction) {
            res.status(500).json({ message: "Nalog nije pronadjen!" });
        }
    }

    const invoice = await Invoice.update({
        payment_date,
        activated_date,
        note,
        status
    }, {
        where: {
            invoice_id
        }
    });
    if (!invoice) {
        res.status(500).json({ message: "Faktura nije pronadjena!" });
    }
    res.status(200).json({ message: "Faktura je azurirana!" });
})

const pdfInvoice = asyncHandler(async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const account_id = req.session.user;
    const invoice = await Invoice.findAll({
        include: [{
            model: User,
        },
        {
            model: Car
        }],
        where: {
            invoice_id
        }
    });




    if (!invoice) {
        res.status(500).json({ message: "Nalozi nisu pronadjeni!" });
    }
    if (invoice.length > 0) {
        invoiceArticle = await InvoiceArticle.findAll({
            where: {
                invoice_id: invoice[0].invoice_id
            }
        });
        if (!invoiceArticle) {
            res.status(500).json({ message: "Nalozi nisu pronadjeni!" });
        }
    } else {
        invoiceArticle = []
    }

    const account = await Account.findOne({
        attributes: ["account_id", "company_name", "company_user_name","phone_number", "jib", "address", "card_number"],
        where: {
            account_id
        }
    });
    if (!account) {
        res.status(500).json({ message: "Nalog nije pronadjen!" });
    }

    res.render("invoice/invoicePdf", {
        invoice,
        invoiceArticle,
        account
    });
});

const deleteInvoice = asyncHandler(async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const findInvoice = await Invoice.findByPk(invoice_id);
    if (!findInvoice) {
        res.status(500).json({ message: "Faktura nije pronadjena!" });
    }
    const updateProduction = await ProductionOrder.update({
        status: "OPEN"
    }, {
        where: {
            production_order_id: findInvoice.production_order_id
        }
    });
    if (!updateProduction) {
        res.status(500).json({ message: "Nalog nije pronadjen!" });
    }
    const deleteInvoice = await Invoice.destroy({
        where: {
            invoice_id
        }
    });
    if (!deleteInvoice) {
        res.status(500).json({ message: "Faktura nije obrisana!" });
    }
    res.status(200).json({ message: "Faktura je obrisana!" });
});

const invoiceArticleOneInvoice = asyncHandler(async (req, res) => {
    const invoice_id = req.params.invoice_id;
    const invoiceArticle = await InvoiceArticle.findAll({
        where: {
            invoice_id
        }
    });
    if (!invoiceArticle) {
        res.status(500).json({ message: "Artikli nisu pronadjeni!" });
    }
    res.render("invoice/invoiceArticle.ejs", {
        invoiceArticle
    });
});
const updateinvoiceArticle = asyncHandler(async (req, res) => {
    const invoice_article_id = req.params.invoice_article_id;
    const amount = req.body.amount;
    const price_with_vat = req.body.price_with_vat;
    const price_with_out_vat = req.body.price_with_out_vat;
    const article_name = req.body.article_name;
    const note = req.body.note;
    const unit_of_measure = req.body.unit_of_measure;
    const discount = req.body.discount;
    const invoiceArticle = await InvoiceArticle.update({
        amount,
        price_with_vat,
        price_with_out_vat,
        article_name,
        note,
        unit_of_measure,
        discount
    }, {
        where: {
            invoice_article_id
        }
    });
    if(!invoiceArticle){
        res.status(500).json({ message: "Artikal nije azuriran!" });
    }
    res.status(200).json({ message: "Artikal je azuriran!" });
})

const deleteInvoiceArticle = asyncHandler(async (req, res) => {
    const invoice_article_id = req.params.invoice_article_id;
    const deleteInvoiceArticle = await InvoiceArticle.destroy({
        where: {
            invoice_article_id
        }
    });
    if (!deleteInvoiceArticle) {
        res.status(500).json({ message: "Artikal nije obrisan!" });
    }
    res.status(200).json({ message: "Artikal je obrisan!" });
});
module.exports = {deleteInvoiceArticle,updateinvoiceArticle,deleteInvoice, pdfInvoice, updateInvoice, renderInvoice, createInovice, updateInvoiceStatus, createInvoiceArticle, allInvoices, redirectToAll, invoiceArticleOneInvoice };