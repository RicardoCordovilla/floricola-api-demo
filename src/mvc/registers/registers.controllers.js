const { Op } = require("sequelize")
const Registers = require("./registers.model")
const Stations = require("../stations/stations.model")

const createRegister = async (data) => {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() - 2)
    const newRegister = await Registers.create({
        stationtitle: data.station,
        values: data.values,
        date: currentDate.toISOString().slice(0, 10)
        // date: new Date().toISOString().toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digits' }).split('/').reverse().join('-')
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
    const data = await Registers.findAll(
        {
            where: {
                stationtitle,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        }
    )
    return data


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