const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Offer = sequelize.define('offer', {
        offer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.STRING,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        car_name: {
            type: DataTypes.STRING,
        },
        car_plate: {
            type: DataTypes.STRING,
        },
        jib: {
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
    return Offer;
}