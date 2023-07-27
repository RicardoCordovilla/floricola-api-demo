const { Op } = require('sequelize')
const Stations = require('./stations.model')

const createStation = async (data) => {
    const newRegister = await Stations.create({
        title: data.title,
        alias: data.alias
    })
    return newRegister
}

const getStations = async () => {
    const data = await Stations.findAll({
        where: {
            enable: true,
        }
    })
    return data
}

const getStation = async (stationtitle) => {
    const data = await Stations.findOne({
        where: { title: stationtitle }
    })
    return data
}

module.exports = {
    createStation,
    getStations,
    getStation
}