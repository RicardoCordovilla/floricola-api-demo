const { Op } = require("sequelize")
const Registers = require("./registers.model")
const Stations = require("../stations/stations.model")

const createRegister = async (data) => {
    const newRegister = await Registers.create({
        stationtitle: data.station,
        values: data.values
    })
    return newRegister
}

const getAllRegisters = async () => {
    const data = await Registers.findAll({
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}
const getRegisters = async (stationtitle) => {
    const data = await Registers.findAll({
        where: {
            stationtitle
        },
        // include: [
        //     {
        //         model: Stations,
        //         as: "station"
        //     }
        // ]
    })
    return data
}

const getRegistersByDate = async (startDate, endDate, stationtitle) => {
    if (startDate !== endDate) {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    createdAt: {
                        [Op.between]: [new Date(startDate), new Date(endDate)]
                    }
                }
            }
        )
        return data
    }
    else {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    createdAt: {
                        [Op.eq]: [new Date(startDate)]
                    }
                }
            }
        )
        return data
    }
}

const getLast = async (stationtitle) => {
    const data = await Registers.findOne({
        limit: 1,
        where: {
            stationtitle,
            createdAt: { [Op.not]: null }
        },
        order: [['createdAt', 'DESC']]
    })
    return data
}

const deleteRegister = async (id) => {
    const data = await Registers.destroy({
        where: { id },
        force: true
    })
    return data
}

module.exports = {
    createRegister,
    getAllRegisters,
    getRegisters,
    getLast,
    getRegistersByDate,
    deleteRegister
}