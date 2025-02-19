const express = require("express");
const router = express.Router();

const {
    renderInvoice,
    createInovice,
    updateInvoiceStatus,
    createInvoiceArticle,
    allInvoices,
    redirectToAll,
    updateInvoice,
    pdfInvoice
} = require("../controllers/invoiceController");

// invoicePdf
router.get("/pdf-invoice/:invoice_id", pdfInvoice);
router.get("/all-invoices/:limit/:offset", allInvoices);
router.get("/render", renderInvoice);
router.get("/redirect-to-all", redirectToAll);
router.post("/", createInovice);
router.post("/create-invoice-article", createInvoiceArticle);
router.put("/update-status", updateInvoiceStatus);
router.put("/update-invoice/:invoice_id", updateInvoice);


module.exports = router;