const { Sequelize, Op } = require("sequelize");
console.log(process.env.DB_HOST)
console.log(process.env.DB)
console.log(process.env.USER)
console.log(process.env.PASSWORD)
const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    define: {
        freezeTableName: true
    },
    logging: false,
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        decimalNumbers: true
    },
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});
const db = {};
db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.user = require("../models/user")(sequelize, Sequelize);
db.car = require("../models/car")(sequelize, Sequelize);
db.productionOrder = require("../models/productionOrder")(sequelize, Sequelize);

db.user.hasMany(db.car, { foreignKey: 'user_id' });
// db.car.hasMany(db.productionOrder, { foreignKey: 'car_id' });
// db.user.hasMany(db.productionOrder, { foreignKey: 'user_id' });

db.car.hasMany(db.productionOrder, { foreignKey: 'car_id' });
db.productionOrder.belongsTo(db.car, { foreignKey: 'car_id' });

db.user.hasMany(db.productionOrder, { foreignKey: 'user_id' });
db.productionOrder.belongsTo(db.user, { foreignKey: 'user_id' });


module.exports = db