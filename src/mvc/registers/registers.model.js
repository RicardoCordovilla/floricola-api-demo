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
    // values: {
    //     type: DataTypes.JSON,
    //     allowNull: false
    // },
    temp: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    hum: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'hour'
    },
})

module.exports = Registers