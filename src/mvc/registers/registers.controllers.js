const { Op } = require("sequelize")
const Registers = require("./registers.model")
const Stations = require("../stations/stations.model")


const currentDate = new Date()
const currentLocalDate = currentDate.toLocaleDateString("es-EC", { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')

const promedio = async (stationtitle, type) => {
    const sum = await Registers.sum(type, {
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    const count = await Registers.count({
        where: {
            stationtitle,
            type: 'hour',
            date: {
                [Op.between]: [currentLocalDate, currentLocalDate]
            }
        }
    })

    return (sum / count).toFixed(2)

}

const updateRegisterDay = async (date, stationtitle) => {
    const updateRegisterDay = await Registers.update(
        {
            hum: await promedio(stationtitle, 'hum'),
            temp: await promedio(stationtitle, 'temp')
        }, {
        where: {
            stationtitle,
            date,
            type: 'day'
        }
    })
    return updateRegisterDay
}

const createRegister = async (data) => {
    const currentDate = new Date()
    // currentDate.setDate(currentDate.getDate() - 1)
    // console.log(currentDate.toLocaleDateString("es-EC", { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'))
    // console.log(currentDate.toLocaleTimeString("es-EC", { hour: '2-digit', minute: '2-digit' }))


    const newRegisterDay = await Registers.findOrCreate({
        where: { type: 'day', date: currentLocalDate },
        defaults: {
            stationtitle: data.station,
            temp: data.temp,
            hum: data.hum,
            date: currentLocalDate,
            time: currentDate.toLocaleTimeString("es-EC", { hour: '2-digit', minute: '2-digit' }),
            type: 'day'
        }
    })

    const newRegister = await Registers.create({
        stationtitle: data.station,
        temp: data.temp,
        hum: data.hum,
        // values: data.values,
        // date: currentDate.toISOString().slice(0, 10)
        date: currentLocalDate,
        time: currentDate.toLocaleTimeString("es-EC", { hour: '2-digit', minute: '2-digit' })
    })

    updateRegisterDay(currentLocalDate, data.station)

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

    if (startDate === endDate) {
        const data = await Registers.findAll(
            {
                where: {
                    stationtitle,
                    type: 'hour',
                    date: {
                        [Op.between]: [startDate, endDate]
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
                    type: 'day',
                    date: {
                        [Op.between]: [startDate, endDate]
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