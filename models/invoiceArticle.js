const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Invoice_article = sequelize.define('invoice_article', {
        invoice_article_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        invoice_id: {
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
        price_with_out_vat: {
            type: DataTypes.DECIMAL(10, 2),
        },
        vat: {
            type: DataTypes.INTEGER,
        },
        discount: {
            type: DataTypes.STRING,
        },
        unit_of_measure: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.TEXT,
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return Invoice_article;
}