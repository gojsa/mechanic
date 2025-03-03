const { type } = require('os');
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define('appointment', {
        car_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          start: {
            type: DataTypes.DATE,
            allowNull: false
          },
          end: {
            type: DataTypes.DATE
          }
    }, {
        timestamps: false,
    });
    return Appointment;
}

