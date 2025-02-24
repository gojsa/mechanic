const express = require("express");
const router = express.Router();

const {
    findAllOffers,
    createOffer,
    redirectToOffer,
    updateOffer,
    deleteOffer,
    findAllOfferArticles,
    createOfferArticle,
    updateOfferArticle,
    deleteOfferArticle,
    renderPrintOffer
} = require("../controllers/offerController");

router.get("/offer-article-one-offer/:offer_id", findAllOfferArticles);
router.get("/print/:offer_id", renderPrintOffer);
router.get("/redirect-to-all", redirectToOffer);
router.get("/all-offer/:limit/:offset", findAllOffers);
router.post("/", createOffer);
router.post("/article", createOfferArticle);
router.put("/:offer_id", updateOffer);
router.put("/article/:offer_article_id", updateOfferArticle);
router.delete("/:offer_id", deleteOffer);
router.delete("/article/:offer_article_id", deleteOfferArticle);


module.exports = router;