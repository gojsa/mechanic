const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        jmbg: {
            type: DataTypes.STRING,
        },
        phone_number: {
            type: DataTypes.STRING,
        },
        jib: {
            type: DataTypes.STRING,
        },
        birth_date: {
            type: DataTypes.DATE,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        account_id: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return User;
}
