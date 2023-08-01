const { DataTypes } = require("sequelize")
const db = require('../../dabase')
const Stations = require("../stations/stations.model")

const Registers = db.define('registers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    stationtitle: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    values: {
        type: DataTypes.JSON,
        allowNull: false
    },
    date: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})

module.exports = Registers