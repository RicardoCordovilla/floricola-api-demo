const { Sequelize } = require('sequelize')
const config = require('./config')

const db = new Sequelize({
    dialect: 'postgres',
    host: config.db.host,
    username: config.db.username,
    password: config.db.password,
    database: config.db.dbName,
    port: config.db.dbPort,
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        timezone: '-05:00'
    }
})

module.exports = db