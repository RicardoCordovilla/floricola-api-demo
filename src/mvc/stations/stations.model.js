const { DataTypes } = require("sequelize")
const db = require('../../dabase')

const Stations = db.define('stations', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    alias: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    enable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    flowername: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    beds: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    humRange: {
        type: DataTypes.JSON,
        allowNull: false
    },
    tempRange: {
        type: DataTypes.JSON,
        allowNull: false
    },


}, { freezeTableName: true, timestamps: false })

module.exports = Stations