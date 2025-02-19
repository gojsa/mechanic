const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const User = db.user;
const Car = db.car;
const ProductionOrder = db.productionOrder;
const Invoice = db.invoice;
const InvoiceArticle = db.invoiceArticle;
const { Op, QueryTypes, where } = require("sequelize");
let invoiceArticle

const renderInvoice = asyncHandler(async (req, res) => {
    const production_order_id = req.query.production_order_id;

    const invoice = await Invoice.findAll({
        include:[{
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
    if(invoice.length > 0){
         invoiceArticle = await InvoiceArticle.findAll({
            where: {
                invoice_id: invoice[0].invoice_id
            }
        });
        if(!invoiceArticle){
            res.status(500).json({ message: "Nalozi nisu pronadjeni!" });
        }
    }else{
        invoiceArticle = []
    }

    res.render("invoice/addinvoice", {
        invoice,
        invoiceArticle
    });
});

const createInovice = asyncHandler(async (req, res) => {
    const production_order_id = req.body.production_order_id;
    const payment_date = req.body.payment_date;
    const activated_date = req.body.activated_date;
    const note = req.body.note;
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
            note
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

    const invoice = await Invoice.update({
        status: "CLOSED"
    }, {
        where: {
            invoice_id
        }
    })

    if(!invoice){
        res.status(500).json({ message: "Faktura nije pronadjena!" });
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
    const query = `
    
    `
});
module.exports = { renderInvoice, createInovice,updateInvoiceStatus,createInvoiceArticle };