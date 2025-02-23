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
    pdfInvoice,
    deleteInvoice,
    invoiceArticleOneInvoice,
    updateinvoiceArticle,
    deleteInvoiceArticle
} = require("../controllers/invoiceController");

router.get("/invoice-article-one-invoice/:invoice_id", invoiceArticleOneInvoice);
router.get("/pdf-invoice/:invoice_id", pdfInvoice);
router.get("/all-invoices/:limit/:offset", allInvoices);
router.get("/render", renderInvoice);
router.get("/redirect-to-all", redirectToAll);
router.post("/", createInovice);
router.post("/create-invoice-article", createInvoiceArticle);
router.put("/update-status", updateInvoiceStatus);
router.put("/update-invoice/:invoice_id", updateInvoice);
router.put("/update-invoice-article/:invoice_article_id", updateinvoiceArticle);
router.delete("/:invoice_id", deleteInvoice);
router.delete("/delete-invoice-article/:invoice_article_id", deleteInvoiceArticle);


module.exports = router;