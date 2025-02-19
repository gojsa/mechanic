const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Invoice = sequelize.define('invoice', {
        invoice_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.STRING,
        },
        production_order_id: {
            type: DataTypes.INTEGER,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        car_id: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        jib: {
            type: DataTypes.STRING,
        },
        offer_number: {
            type: DataTypes.STRING,
        },
        payment_date: {
            type: DataTypes.DATE,
        },
        activated_date: {
            type: DataTypes.DATE,
        },
        vat: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "OPEN"
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return Invoice;
}