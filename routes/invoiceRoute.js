const express = require("express");
const router = express.Router();

const {
    renderInvoice,
    createInovice,
    updateInvoiceStatus,
    createInvoiceArticle
} = require("../controllers/invoiceController");

router.get("/render", renderInvoice);
router.post("/", createInovice);
router.post("/create-invoice-article", createInvoiceArticle);
router.put("/update-status", updateInvoiceStatus);


module.exports = router;