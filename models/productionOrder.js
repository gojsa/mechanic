const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ProductionOrder = sequelize.define('production_order', {
        production_order_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        car_id: {
            type: DataTypes.INTEGER,
        },
        number: {
            type: DataTypes.STRING,
        },
        mileage: {
            type: DataTypes.STRING,
        },
        note: {
            type: DataTypes.TEXT,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return ProductionOrder;
}
