const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('car', {
        car_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        account_id: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        chassis_number: {
            type: DataTypes.STRING,
        },
        motor_number: {
            type: DataTypes.STRING,
        },
        mileage: {
            type: DataTypes.STRING,
        },
        plate_number: {
            type: DataTypes.STRING,
        },
        fuel: {
            type: DataTypes.STRING,
        },
        year: {
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
    return User;
}
