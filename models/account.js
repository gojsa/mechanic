const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define('account', {
        account_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        company_name: {
            type: DataTypes.STRING,
        },
        company_user_name: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        phone_number: {
            type: DataTypes.STRING,
        },
        jib: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        card_number: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return Account;
}