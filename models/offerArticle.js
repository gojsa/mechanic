const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Offer_article = sequelize.define('offer_article', {
        offer_article_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        offer_id: {
            type: DataTypes.INTEGER,
        },
        article_name: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.STRING,
        },
        price_with_vat: {
            type: DataTypes.DECIMAL(10, 2),
        },
        note: {
            type: DataTypes.TEXT,
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return Offer_article;
}